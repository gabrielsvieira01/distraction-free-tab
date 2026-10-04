import React, { FC } from "react";
import { useIntl } from "react-intl";
import { ui } from "../../../locales/interface";

import { engines } from "./engines";
import { Props, defaultData } from "./types";

const SearchSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const t = useIntl().formatMessage;
  return (
  <div className="SearchSettings">
    <label>
      {t(ui.buscador)}
      <select
        onChange={(event) =>
          setData({ ...data, searchEngine: event.target.value })
        }
        value={data.searchEngine}
      >
        {engines.map(({ key, name }) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>
    </label>

    {BUILD_TARGET === "web" && (
      <label>
        {t(ui.sugestoes)}
        <select
          onChange={(event) =>
            setData({ ...data, suggestionsEngine: event.target.value })
          }
          value={data.suggestionsEngine}
        >
          <option key="off" value="">
            {t(ui.desligado)}
          </option>
          {engines
            .filter(({ suggest_url }) => Boolean(suggest_url))
            .map(({ key, name }) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
        </select>
      </label>
    )}

    {data.suggestionsEngine && (
      <label>
        {t(ui.quantidadeSugestoes)}
        <input
          type="number"
          min="1"
          max="10"
          value={data.suggestionsQuantity}
          onChange={(event) =>
            setData({
              ...data,
              suggestionsQuantity: Number(event.target.value),
            })
          }
        />
      </label>
    )}
  </div>
  );
};

export default SearchSettings;
