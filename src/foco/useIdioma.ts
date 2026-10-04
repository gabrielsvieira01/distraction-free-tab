import { useIntl } from "react-intl";
import { Traduzir } from "./idioma";

/** Tradutor e idioma atuais dentro do React, no mesmo formato do idioma.ts */
export function useIdioma(): { t: Traduzir; locale: string } {
  const intl = useIntl();
  return {
    t: (mensagem, valores) => intl.formatMessage(mensagem, valores),
    locale: intl.locale,
  };
}
