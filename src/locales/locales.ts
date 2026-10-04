import ar from "./lang/ar.json";
import caES from "./lang/ca-ES.json";
import cs from "./lang/cs.json";
import de from "./lang/de.json";
import el from "./lang/el.json";
import enAU from "./lang/en-AU.json";
import enCA from "./lang/en-CA.json";
import enGB from "./lang/en-GB.json";
import es from "./lang/es.json";
import fa from "./lang/fa.json";
import fi from "./lang/fi.json";
import fr from "./lang/fr.json";
import ga from "./lang/ga.json";
import gd from "./lang/gd.json";
import gl from "./lang/gl.json";
import gu from "./lang/gu.json";
import he from "./lang/he.json";
import hi from "./lang/hi.json";
import hu from "./lang/hu.json";
import id from "./lang/id.json";
import it from "./lang/it.json";
import ja from "./lang/ja.json";
import ko from "./lang/ko.json";
import kp from "./lang/kp.json";
import lt from "./lang/lt.json";
import lb from "./lang/lb.json";
import ne from "./lang/ne.json";
import nl from "./lang/nl.json";
import no from "./lang/no.json";
import ro from "./lang/ro.json";
import ru from "./lang/ru.json";
import sk from "./lang/sk.json";
import sr from "./lang/sr.json";
import sv from "./lang/sv.json";
import pl from "./lang/pl.json";
import pt from "./lang/pt.json";
import ptBR from "./lang/pt-BR.json";
import ta from "./lang/ta.json";
import th from "./lang/th.json";
import tr from "./lang/tr.json";
import vi from "./lang/vi.json";
import zhCN from "./lang/zh-CN.json";
import zhTW from "./lang/zh-TW.json";
import uk from "./lang/uk.json";

export const messages: Record<string, Record<string, string>> = {
  ar: ar,
  "ca-ES": caES,
  cs: cs,
  de: de,
  el: el,
  en: {},
  "en-AU": enAU,
  "en-CA": enCA,
  "en-GB": enGB,
  es: es,
  fa: fa,
  fi: fi,
  fr: fr,
  ga: ga,
  gd: gd,
  gl: gl,
  gu: gu,
  he: he,
  hi: hi,
  hu: hu,
  id: id,
  it: it,
  ja: ja,
  ko: ko,
  kp: kp,
  lt: lt,
  lb: lb,
  ne: ne,
  nl: nl,
  no: no,
  ro: ro,
  ru: ru,
  sk: sk,
  sr: sr,
  sv: sv,
  pl: pl,
  pt: pt,
  "pt-BR": ptBR,
  ta: ta,
  th: th,
  tr: tr,
  vi: vi,
  zh: {},
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  uk: uk,
};

export const locales = Object.keys(messages);
/**
 * Idioma do navegador. A biblioteca usada antes cortava a região (pt-BR virava
 * pt, zh-TW virava zh, que não tem traduções); aqui a tag exata vem primeiro.
 */
export function escolherIdioma(pedidos: readonly string[]): string {
  const porTag = new Map(locales.map((locale) => [locale.toLowerCase(), locale]));
  const temTextos = (locale: string) =>
    locale === "en" || Object.keys(messages[locale]).length > 0;

  for (const pedido of pedidos) {
    const tag = pedido.toLowerCase();
    const exato = porTag.get(tag);
    if (exato && temTextos(exato)) return exato;

    const base = tag.split("-")[0];
    // Chinês tradicional (Taiwan, Hong Kong, Macau) antes do simplificado
    if (base === "zh" && /-(hant|tw|hk|mo)(-|$)/.test(tag)) return "zh-TW";
    const doBase = porTag.get(base);
    if (doBase && temTextos(doBase)) return doBase;
    const parente = locales.find((locale) =>
      locale.toLowerCase().startsWith(base + "-"),
    );
    if (parente) return parente;
  }
  return "en";
}

export const defaultLocale = escolherIdioma(
  typeof navigator === "undefined"
    ? []
    : [...(navigator.languages ?? []), navigator.language].filter(Boolean),
);

/** Árabe, persa e hebraico são escritos da direita para a esquerda */
export const direcaoDoTexto = (locale: string): "rtl" | "ltr" =>
  /^(ar|fa|he)(-|$)/.test(locale) ? "rtl" : "ltr";
