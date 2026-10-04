import React from "react";
import { useIntl } from "react-intl";
import { ui } from "../../locales/interface";

/**
 * Fontes comuns no Windows, macOS e Linux, mais algumas populares que a pessoa
 * pode ter instalado. Só as que existem nesta máquina aparecem na lista.
 */
const CANDIDATAS = [
  "Arial",
  "Arial Black",
  "Bahnschrift",
  "Calibri",
  "Cambria",
  "Candara",
  "Cascadia Code",
  "Comic Sans MS",
  "Consolas",
  "Constantia",
  "Corbel",
  "Courier New",
  "Fira Code",
  "Franklin Gothic Medium",
  "Gabriola",
  "Georgia",
  "Impact",
  "Ink Free",
  "Inter",
  "JetBrains Mono",
  "Lato",
  "Lucida Console",
  "Montserrat",
  "Open Sans",
  "Palatino Linotype",
  "Poppins",
  "Roboto",
  "Segoe Print",
  "Segoe Script",
  "Segoe UI",
  "Segoe UI Variable Display",
  "Sitka Text",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Ubuntu",
  "Verdana",
];

const OUTRA = "__outra__";

/** Uma fonte existe se trocar o fallback não muda a largura do texto medido */
function fontesInstaladas(): string[] {
  const contexto = document.createElement("canvas").getContext("2d");
  if (!contexto) return CANDIDATAS;
  const amostra = "mmmmmmmmmmlli1WQ@#";
  const largura = (fonte: string) => {
    contexto.font = `72px ${fonte}`;
    return contexto.measureText(amostra).width;
  };
  const bases = ["monospace", "serif", "sans-serif"].map((base) => ({
    base,
    largura: largura(base),
  }));
  return CANDIDATAS.filter((nome) =>
    bases.some(({ base, largura: l }) => largura(`"${nome}", ${base}`) !== l),
  );
}

interface Props {
  value?: string;
  onChange: (fontFamily: string | undefined) => void;
}

const FontInput: React.FC<Props> = ({ value, onChange }) => {
  const intl = useIntl();
  const t = intl.formatMessage;
  const fontes = React.useMemo(fontesInstaladas, []);
  const naLista = !value || fontes.includes(value);
  const [digitando, setDigitando] = React.useState(!naLista);

  return (
    <>
      <label>
        {t(ui.fonte)}
        <select
          value={digitando ? OUTRA : value ?? ""}
          onChange={(evento) => {
            const escolha = evento.target.value;
            if (escolha === OUTRA) return setDigitando(true);
            setDigitando(false);
            onChange(escolha || undefined);
          }}
        >
          <option value="">{t(ui.padrao)}</option>
          {fontes.map((fonte) => (
            <option key={fonte} value={fonte} style={{ fontFamily: fonte }}>
              {fonte}
            </option>
          ))}
          <option value={OUTRA}>{t(ui.outra)}</option>
        </select>
      </label>

      {digitando && (
        <label>
          {t(ui.nomeDaFonte)}
          <input
            type="text"
            value={value ?? ""}
            placeholder={t(ui.exemploFonte)}
            onChange={(evento) => onChange(evento.target.value || undefined)}
          />
        </label>
      )}
    </>
  );
};

export default FontInput;
