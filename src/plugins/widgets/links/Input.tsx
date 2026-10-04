import icons from "feather-icons/dist/icons.json";
import React, { FC } from "react";
import { useIntl } from "react-intl";
import { ui } from "../../../locales/interface";

import {
  IconButton,
  RemoveIcon,
  DownIcon,
  UpIcon,
} from "../../../views/shared";
import { Link } from "./types";

type Props = Link & {
  number: number;
  onChange: (values: Partial<Link>) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
};

const iconList = Object.keys(icons);

const Input: FC<Props> = (props) => {
  const t = useIntl().formatMessage;
  return (
  <div className="LinkInput">
    <h5>
      <div className="title--buttons">
        <IconButton onClick={props.onRemove} title={t(ui.removerLink)}>
          <RemoveIcon />
        </IconButton>
        {props.onMoveDown && (
          <IconButton onClick={props.onMoveDown} title={t(ui.descerLink)}>
            <DownIcon />
          </IconButton>
        )}
        {props.onMoveUp && (
          <IconButton onClick={props.onMoveUp} title={t(ui.subirLink)}>
            <UpIcon />
          </IconButton>
        )}
      </div>

      {props.number <= 9
        ? t(ui.atalho, { number: props.number })
        : t(ui.atalhoSemNumero)}
    </h5>

    <label>
      {t(ui.endereco)}
      <input
        type="url"
        value={props.url}
        onChange={(event) => props.onChange({ url: event.target.value })}
      />
    </label>

    <label>
      {t(ui.nome)} <span className="text--grey">{t(ui.opcional)}</span>
      <input
        type="text"
        value={props.name}
        onChange={(event) => props.onChange({ name: event.target.value })}
      />
    </label>

    <label>
      {t(ui.icone)} <span className="text--grey">{t(ui.opcional)}</span>
      <select
        value={props.icon}
        onChange={(event) => props.onChange({ icon: event.target.value })}
      >
        <option value={""}>{t(ui.nenhum)}</option>
        <option value="_favicon">{t(ui.iconeDoSite)}</option>
        <optgroup label="Feather Icons">
          {iconList.map((key) => (
            <option key={key}>{key}</option>
          ))}
        </optgroup>
      </select>
    </label>

    <hr />
  </div>
  );
};

export default Input;
