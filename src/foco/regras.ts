/**
 * Regras de bloqueio de sites. Lógica pura, sem APIs do navegador, para poder
 * ser testada e compartilhada entre o background, a página de bloqueio e o widget.
 */

export type RegraHorario = {
  id: string;
  sites: string[];
  /** Dias da semana em que vale; 0 = domingo */
  dias: number[];
  /** "HH:MM". Se fim <= inicio, a faixa atravessa a meia-noite */
  inicio: string;
  fim: string;
  ativa: boolean;
};

export type LimiteDiario = {
  id: string;
  site: string;
  minutos: number;
  ativa: boolean;
};

export type Regras = {
  horarios: RegraHorario[];
  limites: LimiteDiario[];
};

/** Segundos de uso por site de limite, no dia `dia` (AAAA-MM-DD, hora local) */
export type Uso = {
  dia: string;
  segundos: Record<string, number>;
};

/** Liberação temporária que o usuário conquistou com atrito */
export type Furo = {
  site: string;
  quando: number;
  ate: number;
};

/** Bloqueio imediato ligado à mão; `ate` null = até a pessoa encerrar */
export type BloqueioAgora = {
  inicio: number;
  ate: number | null;
};

export type Motivo =
  | { tipo: "horario"; site: string; regra: RegraHorario; liberaEm: Date }
  | { tipo: "agora"; site: string; ate: Date | null }
  | { tipo: "limite"; site: string; limite: LimiteDiario; usadoSeg: number };

export const regrasVazias: Regras = { horarios: [], limites: [] };
export const usoVazio: Uso = { dia: "", segundos: {} };
export const MINUTOS_FURO = 5;
const DIAS_DE_HISTORICO_DE_FUROS = 30;

/** "https://www.YouTube.com/watch?v=x" → "youtube.com" */
export function normalizarSite(entrada: string): string {
  return entrada
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

/** Host de uma URL http(s); null para qualquer outra coisa (about:, moz-extension:...) */
export function hostDaUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** O site cobre o próprio domínio e todos os subdomínios */
export function casaSite(host: string, site: string): boolean {
  return site !== "" && (host === site || host.endsWith("." + site));
}

export function chaveDia(data: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${data.getFullYear()}-${p(data.getMonth() + 1)}-${p(data.getDate())}`;
}

function minutosDe(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Se `agora` cai dentro da faixa da regra, devolve quando a faixa termina; senão null */
export function fimDaFaixa(regra: RegraHorario, agora: Date): Date | null {
  const inicio = minutosDe(regra.inicio);
  const fim = minutosDe(regra.fim);
  const t = agora.getHours() * 60 + agora.getMinutes();
  const hoje = agora.getDay();
  const ontem = (hoje + 6) % 7;

  const em = (minutos: number, diasAFrente: number) => {
    const d = new Date(agora);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + diasAFrente);
    d.setMinutes(minutos);
    return d;
  };

  if (inicio < fim)
    return regra.dias.includes(hoje) && t >= inicio && t < fim
      ? em(fim, 0)
      : null;

  // Atravessa a meia-noite; o dia marcado é o dia em que a faixa começa
  if (regra.dias.includes(hoje) && t >= inicio) return em(fim, 1);
  if (regra.dias.includes(ontem) && t < fim) return em(fim, 0);
  return null;
}

export function furoAtivo(
  furos: Furo[],
  site: string,
  agora: number,
): Furo | undefined {
  return furos.find((furo) => furo.site === site && furo.ate > agora);
}

/** O bloqueio imediato vale para todo site que aparece em alguma regra */
export function sitesDasRegras(regras: Regras): string[] {
  const sites = [
    ...regras.horarios.flatMap((regra) => regra.sites),
    ...regras.limites.map((limite) => limite.site),
  ];
  return [...new Set(sites)].filter(Boolean);
}

export function bloqueioAgoraAtivo(
  manual: BloqueioAgora | null,
  agora: number,
): manual is BloqueioAgora {
  return !!manual && (manual.ate === null || manual.ate > agora);
}

export function motivoDoBloqueio(
  url: string,
  agora: Date,
  regras: Regras,
  uso: Uso,
  furos: Furo[],
  manual: BloqueioAgora | null = null,
): Motivo | null {
  const host = hostDaUrl(url);
  if (!host) return null;

  for (const regra of regras.horarios) {
    if (!regra.ativa) continue;
    const site = regra.sites.find((site) => casaSite(host, site));
    if (!site) continue;
    const liberaEm = fimDaFaixa(regra, agora);
    if (liberaEm && !furoAtivo(furos, site, +agora))
      return { tipo: "horario", site, regra, liberaEm };
  }

  if (bloqueioAgoraAtivo(manual, +agora)) {
    const site = sitesDasRegras(regras).find((site) => casaSite(host, site));
    if (site && !furoAtivo(furos, site, +agora))
      return {
        tipo: "agora",
        site,
        ate: manual.ate === null ? null : new Date(manual.ate),
      };
  }

  const usoHoje = uso.dia === chaveDia(agora) ? uso.segundos : {};
  for (const limite of regras.limites) {
    if (!limite.ativa || !casaSite(host, limite.site)) continue;
    const usadoSeg = usoHoje[limite.site] ?? 0;
    if (
      usadoSeg >= limite.minutos * 60 &&
      !furoAtivo(furos, limite.site, +agora)
    )
      return { tipo: "limite", site: limite.site, limite, usadoSeg };
  }

  return null;
}

/** Sites de limite diário cujo contador deve andar quando o host está em uso */
export function limitesDoHost(host: string, regras: Regras): string[] {
  const sites = regras.limites
    .filter((limite) => limite.ativa && casaSite(host, limite.site))
    .map((limite) => limite.site);
  return [...new Set(sites)];
}

export function somarUso(
  uso: Uso,
  sites: string[],
  segundos: number,
  agora: Date,
): Uso {
  const dia = chaveDia(agora);
  const segundosDoDia = { ...(uso.dia === dia ? uso.segundos : {}) };
  for (const site of sites)
    segundosDoDia[site] = (segundosDoDia[site] ?? 0) + segundos;
  return { dia, segundos: segundosDoDia };
}

export function usadoHoje(uso: Uso, site: string, agora: Date): number {
  return uso.dia === chaveDia(agora) ? uso.segundos[site] ?? 0 : 0;
}

export function registrarFuro(furos: Furo[], site: string, agora: number): Furo[] {
  const limite = agora - DIAS_DE_HISTORICO_DE_FUROS * 24 * 60 * 60 * 1000;
  return [
    ...furos.filter((furo) => furo.quando >= limite),
    { site, quando: agora, ate: agora + MINUTOS_FURO * 60 * 1000 },
  ];
}

export function furosDoDia(furos: Furo[], agora: Date): Furo[] {
  const dia = chaveDia(agora);
  return furos.filter((furo) => chaveDia(new Date(furo.quando)) === dia);
}

export function minutosArredondados(segundos: number): number {
  return Math.floor(segundos / 60);
}

export function novoId(): string {
  return Math.random().toString(36).slice(2, 10);
}
