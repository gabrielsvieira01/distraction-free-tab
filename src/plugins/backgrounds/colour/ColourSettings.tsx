import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { ui } from "../../../locales/interface";

import { Props, defaultData } from "./types";

const ColourSettings: FC<Props> = ({ data = defaultData, setData }) => (
  <div className="ColourSettings">
    <label>
      <FormattedMessage {...ui.cor} />
      <input
        type="color"
        value={data.colour}
        onChange={(event) => setData({ colour: event.target.value })}
      />
    </label>
  </div>
);

export default ColourSettings;
