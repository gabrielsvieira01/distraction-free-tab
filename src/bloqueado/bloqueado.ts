import "./bloqueado.css";
import { CHAVES, gravar, ler } from "../foco/armazenamento";
import { comparavel, SEGUNDOS_DE_ESPERA, sortear } from "../foco/atrito";
import { direcaoDoTexto } from "../locales";
import {
  criarTradutor,
  descreverMotivo,
  formatarDuracao,
  formatarHora,
  idiomaSalvo,
} from "../foco/idioma";
import { FRASES_FURO, mensagens } from "../foco/mensagens";
import {
  BloqueioAgora,
  bloqueioAgoraAtivo,
  Furo,
  furosDoDia,
  hostDaUrl,
  MINUTOS_FURO,
  motivoDoBloqueio,
  Motivo,
  regrasVazias,
  usoVazio,
} from "../foco/regras";

const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;

const parametros = new URLSearchParams(location.search);
/**
 * Dois modos: "furar" (padrão, chegou aqui ao abrir um site bloqueado) e
 * "encerrar" (veio do widget para desligar o bloqueio imediato antes do fim).
 */
const encerrar = parametros.has("encerrar");
const destino = parametros.get("u") ?? "";
// A página é web_accessible: nunca navegar para algo que não seja http(s)
const destinoValido = hostDaUrl(destino) !== null;
const NOVA_ABA = browser.runtime.getURL("index.html");

async function iniciar() {
  const locale = await idiomaSalvo();
  const t = criarTradutor(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = direcaoDoTexto(locale);
  document.title = t(encerrar ? mensagens.tituloEncerrar : mensagens.tituloBloqueado);

  const frase = t(encerrar ? mensagens.fraseEncerrar : sortear(FRASES_FURO));
  const duracaoFuro = formatarDuracao(MINUTOS_FURO, locale);

  let motivoAtual: Motivo | null = null;
  let manualAtual: BloqueioAgora | null = null;
  let fraseOk = false;
  let esperaOk = false;
  let esperaRestante = SEGUNDOS_DE_ESPERA;
  let esperando = false;

  /** No modo furar: há motivo para bloquear. No modo encerrar: há bloqueio imediato ligado */
  const temAtrito = () =>
    encerrar ? bloqueioAgoraAtivo(manualAtual, Date.now()) : !!motivoAtual;

  async function atualizar() {
    const [regras, uso, furos, manual] = await Promise.all([
      ler(CHAVES.regras, regrasVazias),
      ler(CHAVES.uso, usoVazio),
      ler(CHAVES.furos, [] as Furo[]),
      ler<BloqueioAgora | null>(CHAVES.agora, null),
    ]);
    const agora = new Date();
    manualAtual = manual;
    motivoAtual = motivoDoBloqueio(destino, agora, regras, uso, furos, manual);

    if (encerrar) {
      $("site").textContent = t(mensagens.tituloEncerrar);
      $("motivo").textContent = !bloqueioAgoraAtivo(manual, +agora)
        ? ""
        : manual.ate === null
          ? t(mensagens.ligadaAberta)
          : t(mensagens.ligadaAte, { time: formatarHora(new Date(manual.ate), locale) });
    } else {
      $("site").textContent = hostDaUrl(destino) ?? destino;
      $("motivo").textContent = motivoAtual
        ? descreverMotivo(motivoAtual, t, locale)
        : "";
    }
    $("atrito").hidden = !temAtrito();
    $("livre").hidden = temAtrito();

    const hoje = furosDoDia(furos, agora).length;
    $("furos").textContent =
      encerrar || hoje === 0 ? "" : t(mensagens.vezesFurou, { count: hoje });
  }

  function atualizarBotoes() {
    const esperar = $<HTMLButtonElement>("esperar");
    if (esperaOk) esperar.textContent = t(mensagens.esperaConcluida);
    else if (esperando)
      esperar.textContent = t(mensagens.aguarde, { seconds: esperaRestante });
    else
      esperar.textContent = t(mensagens.prefiroEsperar, {
        seconds: SEGUNDOS_DE_ESPERA,
      });
    esperar.disabled = esperando || esperaOk;

    const liberar = $<HTMLButtonElement>("liberar");
    liberar.textContent = encerrar
      ? t(mensagens.botaoEncerrar)
      : t(mensagens.liberar, { duration: duracaoFuro });
    liberar.disabled = !(fraseOk || esperaOk);
  }

  function iniciarEspera() {
    esperando = true;
    atualizarBotoes();
    const intervalo = setInterval(() => {
      if (document.hidden) return;
      esperaRestante -= 1;
      if (esperaRestante <= 0) {
        clearInterval(intervalo);
        esperando = false;
        esperaOk = true;
      }
      atualizarBotoes();
    }, 1000);
  }

  async function liberar() {
    $<HTMLButtonElement>("liberar").disabled = true;
    if (encerrar) {
      await gravar(CHAVES.agora, null);
      location.replace(NOVA_ABA);
      return;
    }
    if (!motivoAtual || !destinoValido) return;
    await browser.runtime.sendMessage({ tipo: "furar", site: motivoAtual.site });
    location.replace(destino);
  }

  $("instrucao").textContent = encerrar
    ? t(mensagens.instrucaoEncerrar)
    : t(mensagens.instrucaoFuro, { duration: duracaoFuro });
  $("livre-texto").textContent = t(
    encerrar ? mensagens.nenhumaLigada : mensagens.naoBloqueado,
  );
  $("voltar").textContent = t(
    encerrar ? mensagens.voltarNovaAba : mensagens.abrirSite,
  );
  $("ou").textContent = t(mensagens.ou);
  $("frase").textContent = frase;

  const digitado = $<HTMLInputElement>("digitado");
  digitado.setAttribute("aria-label", t(mensagens.rotuloFrase));
  // Colar ou arrastar o texto derrota o propósito do atrito
  digitado.addEventListener("paste", (evento) => evento.preventDefault());
  digitado.addEventListener("drop", (evento) => evento.preventDefault());
  digitado.addEventListener("input", () => {
    fraseOk = comparavel(digitado.value) === comparavel(frase);
    atualizarBotoes();
  });
  digitado.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && fraseOk) liberar();
  });

  $("esperar").addEventListener("click", iniciarEspera);
  $("liberar").addEventListener("click", liberar);
  $("voltar").addEventListener("click", () => {
    if (encerrar) location.replace(NOVA_ABA);
    else if (destinoValido) location.replace(destino);
  });

  atualizarBotoes();
  await atualizar();
  // A faixa de horário ou o bloqueio imediato podem acabar com a página aberta
  setInterval(atualizar, 15000);
}

iniciar();
