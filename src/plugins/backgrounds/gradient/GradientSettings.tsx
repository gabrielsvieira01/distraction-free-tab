import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { ui } from "../../../locales/interface";

import { Props, defaultData } from "./types";

const GradientSettings: FC<Props> = ({ data = defaultData, setData }) => (
  <div className="GradientSettings">
    <label>
      <FormattedMessage {...ui.corInicial} />
      <input
        type="color"
        value={data.from}
        onChange={(event) => setData({ ...data, from: event.target.value })}
      />
    </label>

    <label>
      <FormattedMessage {...ui.corFinal} />
      <input
        type="color"
        value={data.to}
        onChange={(event) => setData({ ...data, to: event.target.value })}
      />
    </label>

    <label>
      <FormattedMessage {...ui.angulo} />
      <input
        type="number"
        value={data.angle}
        onChange={(event) =>
          setData({ ...data, angle: Number(event.target.value) })
        }
      />
    </label>
  </div>
);

export default GradientSettings;
