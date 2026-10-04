import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { UiContext } from "../../contexts/ui";
import { exportStore, importStore, resetStore } from "../../db/action";
import { mensagens } from "../../foco/mensagens";
import { ui } from "../../locales/interface";
import { useKeyPress } from "../../hooks";
import Logo from "../shared/Logo";
import Background from "./Background";
import Persist from "./Persist";
import "./Settings.sass";
import System from "./System";
import Widgets from "./Widgets";

const Settings: React.FC = () => {
  const { toggleSettings } = React.useContext(UiContext);
  const intl = useIntl();

  const handleReset = () => {
    if (
      confirm(intl.formatMessage(ui.confirmarRedefinir))
    )
      resetStore();
  };

  const handleExport = () => {
    const json = exportStore();
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" }),
    );

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "productivity-tab.json";
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style.display = "none";
    input.type = "file";
    input.addEventListener("change", function () {
      if (this.files) {
        const file = this.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          if (event.target && event.target.result) {
            try {
              const state = JSON.parse(event.target.result as string);
              importStore(state);
            } catch (error) {
              alert(
                intl.formatMessage(ui.importacaoInvalida, {
                  error:
                    error instanceof Error
                      ? error.message
                      : intl.formatMessage(ui.erroDesconhecido),
                }),
              );
            }
          }
        });
        reader.readAsText(file);
      }
      document.body.removeChild(input);
    });
    input.click();
  };

  useKeyPress(toggleSettings, ["Escape"]);

  return (
    <div className="Settings">
      <a onClick={toggleSettings} className="fullscreen" />

      <div className="plane">
        <Logo />

        <Background />

        <Widgets />

        <System />

        <p style={{ marginBottom: "2rem" }}>
          <FormattedMessage
            {...ui.importarExportar}
            values={{
              import: (
                <a onClick={handleImport}>{intl.formatMessage(ui.importar)}</a>
              ),
              export: (
                <a onClick={handleExport}>{intl.formatMessage(ui.exportar)}</a>
              ),
              reset: (
                <a onClick={handleReset}>{intl.formatMessage(ui.redefinir)}</a>
              ),
            }}
          />
        </p>

        <Persist />

        <FormattedMessage
          {...mensagens.creditos}
          tagName="p"
          values={{
            tabliss: (
              <a
                href="https://github.com/joelshepherd/tabliss"
                rel="noopener noreferrer"
                target="_blank"
              >
                Tabliss
              </a>
            ),
          }}
        />

        <FormattedMessage
          id="settings.translationCredits"
          description="Give yourself some credit :)"
          defaultMessage=" "
          tagName="p"
        />
      </div>
    </div>
  );
};

export default React.memo(Settings);
