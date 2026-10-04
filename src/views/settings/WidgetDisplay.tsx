import React from "react";
import { useIntl } from "react-intl";
import { ui } from "../../locales/interface";
import { WidgetDisplay as WidgetDisplayType } from "../../db/state";
import PositionInput from "./PositionInput";
import "./WidgetDisplay.css";

type Props = {
  display: WidgetDisplayType;
  onChange: (display: Partial<WidgetDisplayType>) => void;
};

const WidgetDisplay: React.FC<Props> = ({ display, onChange }) => {
  const intl = useIntl();
  return (
    <div className="WidgetDisplay">
      <PositionInput
        value={display.position}
        onChange={(position) => onChange({ position })}
      />

      <label>
        {intl.formatMessage(ui.tamanho)}
        <br />
        <input
          type="range"
          value={display.fontSize}
          min="2"
          max="100"
          step="2"
          onChange={(event) =>
            onChange({ fontSize: Number(event.target.value) })
          }
        />
      </label>
    </div>
  );
};

export default WidgetDisplay;
