import { CHAVES, gravar, ler } from "../foco/armazenamento";
import { criarTradutor, formatarDuracao, idiomaSalvo } from "../foco/idioma";
import { mensagens } from "../foco/mensagens";
import { selo, terminou, Timer, timerPadrao } from "../foco/timer";
import {
  BloqueioAgora,
  bloqueioAgoraAtivo,
  Furo,
  hostDaUrl,
  limitesDoHost,
  motivoDoBloqueio,
  Regras,
  regrasVazias,
  registrarFuro,
  somarUso,
  Uso,
  usoVazio,
} from "../foco/regras";

const TICK_MS = 5000;
/** Depois de suspender o PC, o intervalo volta atrasado; não contar esse buraco como uso */
const MAX_SEGUNDOS_POR_TICK = (2 * TICK_MS) / 1000;
/** Sem teclado/mouse por este tempo = ausente, a não ser que a aba esteja tocando áudio */
const SEGUNDOS_PARA_OCIOSO = 60;

const PAGINA_BLOQUEIO = browser.runtime.getURL("bloqueado.html");

// Cópia em memória: o webRequest bloqueante precisa responder sem esperar o storage
let regras: Regras = regrasVazias;
let uso: Uso = usoVazio;
let furos: Furo[] = [];
let manual: BloqueioAgora | null = null;
let timer: Timer = timerPadrao;

const urlDeBloqueio = (url: string) =>
  `${PAGINA_BLOQUEIO}?u=${encodeURIComponent(url)}`;

const motivo = (url: string, agora = new Date()) =>
  motivoDoBloqueio(url, agora, regras, uso, furos, manual);

async function carregar() {
  [regras, uso, furos, manual, timer] = await Promise.all([
    ler(CHAVES.regras, regrasVazias),
    ler(CHAVES.uso, usoVazio),
    ler(CHAVES.furos, [] as Furo[]),
    ler<BloqueioAgora | null>(CHAVES.agora, null),
    ler(CHAVES.timer, timerPadrao),
  ]);
  await sincronizarTimer();
}

browser.storage.onChanged.addListener((mudancas, area) => {
  if (area !== "local") return;
  if (CHAVES.regras in mudancas)
    regras = (mudancas[CHAVES.regras].newValue as Regras) ?? regrasVazias;
  if (CHAVES.uso in mudancas)
    uso = (mudancas[CHAVES.uso].newValue as Uso) ?? usoVazio;
  if (CHAVES.furos in mudancas)
    furos = (mudancas[CHAVES.furos].newValue as Furo[]) ?? [];
  if (CHAVES.agora in mudancas)
    manual = (mudancas[CHAVES.agora].newValue as BloqueioAgora) ?? null;
  if (CHAVES.timer in mudancas) {
    timer = (mudancas[CHAVES.timer].newValue as Timer) ?? timerPadrao;
    sincronizarTimer().catch(console.error);
  }
});

// Timer: o alarme acorda o background no fim, mesmo sem nenhuma aba aberta
const ALARME_TIMER = "timer";

async function sincronizarTimer() {
  if (timer.estado === "rodando" && timer.fimEm !== null)
    browser.alarms.create(ALARME_TIMER, { when: timer.fimEm });
  else await browser.alarms.clear(ALARME_TIMER);
  await atualizarSelo();
}

async function atualizarSelo() {
  await browser.browserAction.setBadgeText({ text: selo(timer, Date.now()) });
}

browser.alarms.onAlarm.addListener(async (alarme) => {
  if (alarme.name !== ALARME_TIMER || !terminou(timer, Date.now() + 1000)) return;
  const minutos = timer.minutos;
  timer = { ...timer, estado: "parado", fimEm: null, restanteMs: null };
  await gravar(CHAVES.timer, timer);
  const locale = await idiomaSalvo();
  const t = criarTradutor(locale);
  await browser.notifications.create(ALARME_TIMER, {
    type: "basic",
    iconUrl: browser.runtime.getURL("icons/128.png"),
    title: t(mensagens.tempoEsgotado),
    message: t(mensagens.timerTerminou, {
      duration: formatarDuracao(minutos, locale),
    }),
  });
});

browser.browserAction.setBadgeBackgroundColor({ color: "#0ea5e9" });
// O ícone da barra abre uma nova aba, onde ficam os widgets
browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({});
});

// Navegação nova para um site bloqueado
browser.webRequest.onBeforeRequest.addListener(
  (detalhes) =>
    motivo(detalhes.url) ? { redirectUrl: urlDeBloqueio(detalhes.url) } : {},
  { urls: ["http://*/*", "https://*/*"], types: ["main_frame"] },
  ["blocking"],
);

// A página de bloqueio pede o furo aqui, para a cópia em memória já estar
// atualizada quando ela navegar de volta ao site
browser.runtime.onMessage.addListener((mensagem: unknown) => {
  const m = mensagem as { tipo?: string; site?: string };
  if (m?.tipo !== "furar" || !m.site) return;
  furos = registrarFuro(furos, m.site, Date.now());
  return gravar(CHAVES.furos, furos).then(() => true);
});

let ultimoTick = Date.now();

async function tick() {
  const agora = Date.now();
  const segundos = Math.min((agora - ultimoTick) / 1000, MAX_SEGUNDOS_POR_TICK);
  ultimoTick = agora;

  await contarUso(segundos, new Date(agora));
  await atualizarSelo();

  // Bloqueio imediato que chegou ao fim sai do storage, para o widget voltar ao normal
  if (manual && !bloqueioAgoraAtivo(manual, agora)) {
    manual = null;
    await gravar(CHAVES.agora, null);
  }

  // Abas que já estavam abertas quando a faixa começou, o limite estourou ou o furo venceu
  const abas = await browser.tabs.query({ url: ["http://*/*", "https://*/*"] });
  for (const aba of abas)
    if (aba.id !== undefined && aba.url && motivo(aba.url, new Date(agora)))
      await browser.tabs.update(aba.id, { url: urlDeBloqueio(aba.url) });
}

/** Conta o tempo só da aba ativa, com o Firefox em foco e alguém presente */
async function contarUso(segundos: number, agora: Date) {
  if (regras.limites.length === 0) return;

  const janela = await browser.windows.getLastFocused();
  if (!janela.focused) return;
  const [aba] = await browser.tabs.query({ active: true, windowId: janela.id });
  const host = aba?.url ? hostDaUrl(aba.url) : null;
  if (!host) return;

  const sites = limitesDoHost(host, regras);
  if (sites.length === 0) return;

  const estado = await browser.idle.queryState(SEGUNDOS_PARA_OCIOSO);
  if (estado === "locked" || (estado === "idle" && !aba.audible)) return;

  uso = somarUso(uso, sites, segundos, agora);
  await gravar(CHAVES.uso, uso);
}

carregar()
  .then(() => setInterval(() => tick().catch(console.error), TICK_MS))
  .catch(console.error);
