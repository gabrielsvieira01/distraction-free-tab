import React, { FC } from "react";
import { useIntl } from "react-intl";
import { ui } from "../../../locales/interface";

import { Props, defaultData } from "./types";
import TimeZoneInput from "../../../views/shared/timeZone/TimeZoneInput";

const TimeSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const t = useIntl().formatMessage;
  return (
  <div className="TimeSettings">
    <label>
      {t(ui.nome)}
      <input
        type="text"
        value={data.name}
        placeholder={t(ui.nomeOpcional)}
        onChange={(event) => setData({ ...data, name: event.target.value })}
      />
    </label>

    <label>
      {t(ui.fusoHorario)}
      <TimeZoneInput
        timeZone={data.timeZone}
        onChange={(timeZone) => setData({ ...data, timeZone })}
      />
    </label>

    <label>
      <input
        type="radio"
        checked={data.mode === "analogue"}
        onChange={() => setData({ ...data, mode: "analogue" })}
      />{" "}
      {t(ui.analogico)}
    </label>

    <label>
      <input
        type="radio"
        checked={data.mode === "digital" && data.hour12}
        onChange={() => setData({ ...data, mode: "digital", hour12: true })}
      />{" "}
      {t(ui.digital12)}
    </label>

    <label>
      <input
        type="radio"
        checked={data.mode === "digital" && !data.hour12}
        onChange={() => setData({ ...data, mode: "digital", hour12: false })}
      />{" "}
      {t(ui.digital24)}
    </label>

    <label>
      <input
        type="checkbox"
        checked={data.showSeconds}
        onChange={() => setData({ ...data, showSeconds: !data.showSeconds })}
      />{" "}
      {t(ui.mostrarSegundos)}
    </label>

    <label>
      <input
        type="checkbox"
        checked={data.showMinutes}
        onChange={() => setData({ ...data, showMinutes: !data.showMinutes })}
      />{" "}
      {t(ui.mostrarMinutos)}
    </label>

    {data.mode === "digital" && data.hour12 && (
      <label>
        <input
          type="checkbox"
          checked={data.showDayPeriod}
          onChange={() =>
            setData({ ...data, showDayPeriod: !data.showDayPeriod })
          }
        />{" "}
        {t(ui.mostrarPeriodo)}
      </label>
    )}

    <label>
      <input
        type="checkbox"
        checked={data.showDate}
        onChange={() => setData({ ...data, showDate: !data.showDate })}
      />{" "}
      {t(ui.mostrarData)}
    </label>
  </div>
  );
};

export default TimeSettings;
