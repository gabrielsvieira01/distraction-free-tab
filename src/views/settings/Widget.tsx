import React from "react";
import { useIntl } from "react-intl";
import { setWidgetDisplay } from "../../db/action";
import { ui } from "../../locales/interface";
import { usePluginText } from "../../locales/usePluginText";
import { WidgetState } from "../../db/state";
import { useToggle } from "../../hooks";
import { getConfig } from "../../plugins";
import { DownIcon, Icon, IconButton, RemoveIcon, UpIcon } from "../shared";
import PluginContainer from "../shared/Plugin";
import ToggleSection from "../shared/ToggleSection";
import FontInput from "./FontInput";
import "./Widget.sass";
import WidgetDisplay from "./WidgetDisplay";

interface Props {
  plugin: WidgetState;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
}

const Widget: React.FC<Props> = ({
  plugin,
  onMoveDown,
  onMoveUp,
  onRemove,
}) => {
  const [isOpen, toggleIsOpen] = useToggle(onRemove === undefined);

  const config = getConfig(plugin.key);
  const { settingsComponent } = config;
  const intl = useIntl();
  const t = intl.formatMessage;
  const textoDoPlugin = usePluginText();

  const setDisplay = setWidgetDisplay.bind(null, plugin.id);

  return (
    <fieldset className="Widget">
      <div className="title--buttons">
        <IconButton onClick={onRemove} title={t(ui.removerWidget)}>
          <RemoveIcon />
        </IconButton>

        <IconButton
          onClick={toggleIsOpen}
          title={t(isOpen ? ui.fecharWidget : ui.editarWidget)}
        >
          <Icon name="settings" />
        </IconButton>

        {onMoveDown && (
          <IconButton onClick={onMoveDown} title={t(ui.descerWidget)}>
            <DownIcon />
          </IconButton>
        )}

        {onMoveUp && (
          <IconButton onClick={onMoveUp} title={t(ui.subirWidget)}>
            <UpIcon />
          </IconButton>
        )}

        <h4 onClick={toggleIsOpen}>{textoDoPlugin.nome(config)}</h4>
        {!isOpen && <p>{textoDoPlugin.descricao(config)}</p>}
      </div>

      {isOpen && (
        <div>
          {settingsComponent && (
            <div className="settings">
              <PluginContainer id={plugin.id} component={settingsComponent} />
            </div>
          )}

          <ToggleSection abrir={t(ui.abrirExibicao)} fechar={t(ui.fecharExibicao)}>
            <WidgetDisplay display={plugin.display} onChange={setDisplay} />
          </ToggleSection>

          <ToggleSection abrir={t(ui.abrirFonte)} fechar={t(ui.fecharFonte)}>
            <>
              <FontInput
                value={plugin.display.fontFamily}
                onChange={(fontFamily) => setDisplay({ fontFamily })}
              />

              <label>
                {t(ui.peso)}
                <select
                  value={plugin.display.fontWeight}
                  onChange={(event) =>
                    setDisplay({
                      fontWeight: event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    })
                  }
                >
                  <option value="">{t(ui.padrao)}</option>
                  <option value="100">{t(ui.pesoFino)}</option>
                  <option value="300">{t(ui.pesoLeve)}</option>
                  <option value="400">{t(ui.pesoNormal)}</option>
                  <option value="500">{t(ui.pesoMedio)}</option>
                  <option value="700">{t(ui.pesoNegrito)}</option>
                  <option value="900">{t(ui.pesoPreto)}</option>
                </select>
              </label>

              <label>
                {t(ui.cor)}
                <input
                  type="color"
                  value={plugin.display.colour ?? "#ffffff"}
                  onChange={(event) =>
                    setDisplay({ colour: event.target.value })
                  }
                />
              </label>
            </>
          </ToggleSection>
        </div>
      )}
    </fieldset>
  );
};

export default Widget;
