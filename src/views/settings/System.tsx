import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { db } from "../../db/state";
import { useKey } from "../../lib/db/react";
import { ui } from "../../locales/interface";
import TimeZoneInput from "../shared/timeZone/TimeZoneInput";

const System: React.FC = () => {
  const [locale, setLocale] = useKey(db, "locale");
  const [timeZone, setTimeZone] = useKey(db, "timeZone");
  const intl = useIntl();
  // Dica com o nome da língua no idioma atual (ex.: "japonês" para 日本語)
  const nomes = React.useMemo(() => {
    try {
      return new Intl.DisplayNames([intl.locale], { type: "language" });
    } catch {
      return null;
    }
  }, [intl.locale]);
  const dica = (codigo: string) => {
    try {
      return nomes?.of(codigo === "kp" ? "ko-KP" : codigo) ?? codigo;
    } catch {
      return codigo;
    }
  };

  return (
    <div>
      <h2>
        <FormattedMessage
          id="settings"
          defaultMessage="Settings"
          description="Settings title"
        />
      </h2>

      <label
        style={{
          alignItems: "center",
          display: "grid",
          gridGap: "0 0.5rem",
          gridTemplateColumns: "1fr 2fr",
          width: "100%",
          margin: 0,
        }}
      >
        <span>{intl.formatMessage(ui.idioma)}</span>
        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
        >
          <option value="ar" title={dica("ar")}>
            العربية
          </option>
          <option value="ca-ES" title={dica("ca-ES")}>
            Català
          </option>
          <option value="cs" title={dica("cs")}>
            Čeština
          </option>
          <option value="de" title={dica("de")}>
            Deutsch
          </option>
          <option value="el" title={dica("el")}>
            Ελληνικά
          </option>
          <option value="en-AU" title={dica("en-AU")}>
            English (AU)
          </option>
          <option value="en-CA" title={dica("en-CA")}>
            English (CA)
          </option>
          <option value="en-GB" title={dica("en-GB")}>
            English (GB)
          </option>
          <option value="en" title={dica("en")}>
            English (US)
          </option>
          <option value="es" title={dica("es")}>
            Español
          </option>
          <option value="fa" title={dica("fa")}>
            پارسی
          </option>
          <option value="fr" title={dica("fr")}>
            Français
          </option>
          <option value="he" title={dica("he")}>
            עברית
          </option>
          <option value="ga" title={dica("ga")}>
            Gaeilge
          </option>
          <option value="gd" title={dica("gd")}>
            Gàidhlig
          </option>
          <option value="gl" title={dica("gl")}>
            Galego
          </option>
          <option value="gu" title={dica("gu")}>
            ગુજરાતી
          </option>
          <option value="hi" title={dica("hi")}>
            हिन्दी
          </option>
          <option value="hu" title={dica("hu")}>
            Magyar
          </option>
          <option value="id" title={dica("id")}>
            Indonesian
          </option>
          <option value="it" title={dica("it")}>
            Italiano
          </option>
          <option value="ja" title={dica("ja")}>
            日本語
          </option>
          <option value="ko" title={dica("ko")}>
            한국어
          </option>
          <option value="kp" title={dica("kp")}>
            조선말
          </option>
          <option value="lb" title={dica("lb")}>
            Lëtzebuergesch
          </option>
          <option value="lt" title={dica("lt")}>
            Lietuvių k.
          </option>
          <option value="ne" title={dica("ne")}>
            Nepali
          </option>
          <option value="nl" title={dica("nl")}>
            Nederlands
          </option>
          <option value="no" title={dica("no")}>
            Norsk
          </option>
          <option value="pl" title={dica("pl")}>
            Polski
          </option>
          <option value="pt-BR" title={dica("pt-BR")}>
            Português do Brasil
          </option>
          <option value="pt" title={dica("pt")}>
            Português de Portugal
          </option>
          <option value="ro" title={dica("ro")}>
            Română
          </option>
          <option value="ru" title={dica("ru")}>
            Русский
          </option>
          <option value="sk" title={dica("sk")}>
            Slovenčina
          </option>
          <option value="sr" title={dica("sr")}>
            Српски
          </option>
          <option value="fi" title={dica("fi")}>
            Suomi
          </option>
          <option value="sv" title={dica("sv")}>
            Svenska
          </option>
          <option value="ta" title={dica("ta")}>
            தமிழ்
          </option>
          <option value="th" title={dica("th")}>
            ไทย
          </option>
          <option value="tr" title={dica("tr")}>
            Türkçe
          </option>
          <option value="vi" title={dica("vi")}>
            Tiếng Việt
          </option>
          <option value="zh-CN" title={dica("zh-CN")}>
            中文（中国）
          </option>
          <option value="zh-TW" title={dica("zh-TW")}>
            中文（台灣）
          </option>
          <option value="uk" title={dica("uk")}>
            Українська
          </option>
        </select>
      </label>

      <label
        style={{
          alignItems: "center",
          display: "grid",
          gridGap: "0 0.5rem",
          gridTemplateColumns: "1fr 2fr",
          width: "100%",
          margin: 0,
        }}
      >
        {intl.formatMessage(ui.fusoHorario)}
        <TimeZoneInput timeZone={timeZone} onChange={setTimeZone} />
      </label>
    </div>
  );
};

export default System;
