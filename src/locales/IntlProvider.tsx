import React from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import { db } from "../db/state";
import { useValue } from "../lib/db/react";
import { direcaoDoTexto, messages } from "./locales";

const IntlProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const locale = useValue(db, "locale");

  // Idioma e direção da página acompanham a escolha nas configurações
  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direcaoDoTexto(locale);
  }, [locale]);

  return (
    <ReactIntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
