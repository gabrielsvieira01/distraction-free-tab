import React, { FC } from "react";
import { useIntl } from "react-intl";
import { ui } from "../../../locales/interface";

import { useSavedReducer } from "../../../hooks";
import Input from "./Input";
import { addLink, removeLink, reorderLink, updateLink } from "./actions";
import { reducer } from "./reducer";
import { Link, Props, defaultData } from "./types";

const LinksSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const t = useIntl().formatMessage;
  const saveLinks = (links: Link[]) => setData({ ...data, links });
  const dispatch = useSavedReducer(reducer, data.links, saveLinks);

  return (
    <div className="LinksSettings">
      <label>
        {t(ui.colunas)}
        <input
          type="number"
          value={data.columns}
          onChange={(event) =>
            setData({ ...data, columns: Number(event.target.value) })
          }
          min={1}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.visible}
          onChange={() => setData({ ...data, visible: !data.visible })}
        />
        {t(ui.linksSempreVisiveis)}
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.linkOpenStyle}
          onChange={() =>
            setData({ ...data, linkOpenStyle: !data.linkOpenStyle })
          }
        />
        {t(ui.linksNovaAba)}
      </label>

      <hr />

      {data.links.map((link, index) => (
        <Input
          {...link}
          key={index}
          number={index + 1}
          onChange={(values) =>
            dispatch(updateLink(index, { ...link, ...values }))
          }
          onMoveUp={
            index !== 0
              ? () => dispatch(reorderLink(index, index - 1))
              : undefined
          }
          onMoveDown={
            index !== data.links.length - 1
              ? () => dispatch(reorderLink(index, index + 1))
              : undefined
          }
          onRemove={() => dispatch(removeLink(index))}
        />
      ))}

      <p style={{ marginTop: "0.5rem" }}>
        <button
          className="button button--primary"
          onClick={() => dispatch(addLink())}
        >
          {t(ui.adicionarLink)}
        </button>
      </p>
    </div>
  );
};

export default LinksSettings;
