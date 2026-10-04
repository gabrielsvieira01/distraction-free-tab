/** Regras do atrito, iguais na página de bloqueio e no destrancar das regras */
export const SEGUNDOS_DE_ESPERA = 30;

/** Compara frases ignorando caixa, espaços extras e o tipo de apóstrofo (’ vs ') */
export const comparavel = (texto: string) =>
  texto
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, " ");

export const sortear = <T>(lista: T[]): T =>
  lista[Math.floor(Math.random() * lista.length)];
