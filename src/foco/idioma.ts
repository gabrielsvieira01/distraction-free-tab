import { IntlMessageFormat } from "intl-messageformat";
import { defaultLocale, messages } from "../locales";
import { Mensagem, mensagens } from "./mensagens";
import { Motivo, minutosArredondados } from "./regras";

export type Traduzir = (
  mensagem: Mensagem,
  valores?: Record<string, string | number>,
) => string;

/**
 * Idioma escolhido nas configurações do Tabliss (gravado só quando difere do
 * padrão) ou, se não houver, o do navegador. Usado fora do React: página de
 * bloqueio e notificações do background.
 */
export async function idiomaSalvo(): Promise<string> {
  const chave = "tabliss/config/locale";
  const salvo = (await browser.storage.sync.get(chave))[chave];
  return typeof salvo === "string" && salvo in messages ? salvo : defaultLocale;
}

export function criarTradutor(locale: string): Traduzir {
  return (mensagem, valores) =>
    String(
      new IntlMessageFormat(
        messages[locale]?.[mensagem.id] ?? mensagem.defaultMessage,
        locale,
      ).format(valores),
    );
}

export function formatarHora(data: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

/** "25 min", "2 h", "25 мин", "2 時間"... no idioma da pessoa */
export function formatarDuracao(minutos: number, locale: string): string {
  const horas = minutos >= 60 && minutos % 60 === 0;
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit: horas ? "hour" : "minute",
    unitDisplay: "short",
  }).format(horas ? minutos / 60 : minutos);
}

/** Abreviações dos dias, de domingo (0) a sábado (6) */
export function nomesDosDias(locale: string): string[] {
  const formato = new Intl.DateTimeFormat(locale, { weekday: "short" });
  // 4 de outubro de 2026 é um domingo
  return [0, 1, 2, 3, 4, 5, 6].map((dia) =>
    formato.format(new Date(2026, 9, 4 + dia)),
  );
}

export function descreverAte(
  ate: Date | null,
  t: Traduzir,
  locale: string,
): string {
  return ate
    ? t(mensagens.ate, { time: formatarHora(ate, locale) })
    : t(mensagens.ateEncerrar);
}

export function descreverMotivo(
  motivo: Motivo,
  t: Traduzir,
  locale: string,
): string {
  if (motivo.tipo === "horario")
    return t(mensagens.motivoHorario, {
      time: formatarHora(motivo.liberaEm, locale),
    });
  if (motivo.tipo === "agora")
    return motivo.ate
      ? t(mensagens.motivoAgoraAte, { time: formatarHora(motivo.ate, locale) })
      : t(mensagens.motivoAgoraAberto);
  return t(mensagens.motivoLimite, {
    limit: formatarDuracao(motivo.limite.minutos, locale),
    used: formatarDuracao(minutosArredondados(motivo.usadoSeg), locale),
  });
}
