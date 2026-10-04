/** Timer simples. O estado mora no storage; o background agenda o fim com alarms. */
export type Timer = {
  minutos: number;
  estado: "parado" | "rodando" | "pausado";
  /** Quando rodando: instante em que acaba */
  fimEm: number | null;
  /** Quando pausado: quanto faltava */
  restanteMs: number | null;
};

export const timerPadrao: Timer = {
  minutos: 25,
  estado: "parado",
  fimEm: null,
  restanteMs: null,
};

export function restanteMs(timer: Timer, agora: number): number {
  if (timer.estado === "rodando" && timer.fimEm !== null)
    return Math.max(timer.fimEm - agora, 0);
  if (timer.estado === "pausado" && timer.restanteMs !== null)
    return timer.restanteMs;
  return timer.minutos * 60000;
}

/** Inicia do zero ou continua de onde pausou */
export function iniciar(timer: Timer, agora: number): Timer {
  return {
    ...timer,
    estado: "rodando",
    fimEm: agora + restanteMs(timer, agora),
    restanteMs: null,
  };
}

export function pausar(timer: Timer, agora: number): Timer {
  if (timer.estado !== "rodando") return timer;
  return {
    ...timer,
    estado: "pausado",
    fimEm: null,
    restanteMs: restanteMs(timer, agora),
  };
}

export function zerar(timer: Timer): Timer {
  return { ...timer, estado: "parado", fimEm: null, restanteMs: null };
}

export function terminou(timer: Timer, agora: number): boolean {
  return timer.estado === "rodando" && timer.fimEm !== null && timer.fimEm <= agora;
}

/** "24:59" ou "1:04:59" */
export function relogio(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const dois = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${dois(m)}:${dois(s)}` : `${dois(m)}:${dois(s)}`;
}

/** Texto curto para o selo no ícone da barra */
export function selo(timer: Timer, agora: number): string {
  if (timer.estado === "pausado") return "II";
  if (timer.estado !== "rodando") return "";
  return String(Math.ceil(restanteMs(timer, agora) / 60000));
}
