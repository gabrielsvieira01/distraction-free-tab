import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { addWidget, removeWidget, reorderWidget } from "../../db/action";
import { selectWidgets } from "../../db/select";
import { db } from "../../db/state";
import { useSelector } from "../../lib/db/react";
import { ui } from "../../locales/interface";
import { usePluginText } from "../../locales/usePluginText";
import { widgetConfigs } from "../../plugins";
import Widget from "./Widget";

const Widgets: React.FC = () => {
  const widgets = useSelector(db, selectWidgets);
  const intl = useIntl();
  const textoDoPlugin = usePluginText();
  // Ordem alfabética no idioma atual, não no inglês
  const opcoes = widgetConfigs
    .map((config) => ({ config, nome: textoDoPlugin.nome(config) }))
    .sort((a, b) => a.nome.localeCompare(b.nome, intl.locale));

  return (
    <div>
      <h2>
        <FormattedMessage
          id="widgets"
          defaultMessage="Widgets"
          description="Widgets title"
        />
      </h2>

      <label>
        <select
          value=""
          onChange={(event) => addWidget(event.target.value)}
          className="primary"
        >
          <option disabled value="">
            {intl.formatMessage(ui.adicionarWidget)}
          </option>
          {opcoes.map(({ config, nome }) => (
            <option key={config.key} value={config.key}>
              {nome}
            </option>
          ))}
        </select>
      </label>

      {widgets.map((widget, index) => (
        <Widget
          key={widget.id}
          plugin={widget}
          onMoveUp={
            index > 0 ? () => reorderWidget(index, index - 1) : undefined
          }
          onMoveDown={
            index < widgets.length - 1
              ? () => reorderWidget(index, index + 1)
              : undefined
          }
          onRemove={() => removeWidget(widget.id)}
        />
      ))}
    </div>
  );
};

export default Widgets;
