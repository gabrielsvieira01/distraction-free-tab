import React from "react";
import { useIntl } from "react-intl";
import { temasUnsplash, ui } from "../../../locales/interface";
import { Icon } from "../../../views/shared";
import { DebounceInput } from "../../shared";
import topics from "./topics.json";
import { defaultData, Props } from "./types";

const UnsplashSettings: React.FC<Props> = ({ data = defaultData, setData }) => {
  const intl = useIntl();
  const t = intl.formatMessage;
  const nomeDoTema = (topic: { id: string; title: string }) =>
    temasUnsplash[topic.id] ? t(temasUnsplash[topic.id]) : topic.title;
  const temas = [...topics].sort((a, b) =>
    nomeDoTema(a).localeCompare(nomeDoTema(b), intl.locale),
  );

  return (
  <div className="UnsplashSettings">
    <label>
      <span style={{ float: "right" }}>
        {data.paused ? <span className="text--grey">{t(ui.pausado)} </span> : null}
        <a onClick={() => setData({ ...data, paused: !data.paused })}>
          <Icon name={data.paused ? "play" : "pause"} />
        </a>
      </span>
      {t(ui.novaFoto)}
      <select
        value={data.timeout}
        onChange={(event) =>
          setData({ ...data, timeout: Number(event.target.value) })
        }
      >
        <option value="0">{t(ui.cadaAba)}</option>
        <option value="300">{t(ui.cada5Min)}</option>
        <option value="900">{t(ui.cada15Min)}</option>
        <option value="3600">{t(ui.cadaHora)}</option>
        <option value="86400">{t(ui.cadaDia)}</option>
        <option value="604800">{t(ui.cadaSemana)}</option>
      </select>
    </label>

    <label>
      <input
        type="radio"
        checked={data.by === "official"}
        onChange={() => setData({ ...data, by: "official" })}
      />{" "}
      {t(ui.colecaoOficial)}
    </label>

    <label>
      <input
        type="radio"
        checked={data.by === "topics"}
        onChange={() => setData({ ...data, by: "topics" })}
      />{" "}
      {t(ui.tema)}
    </label>

    <label>
      <input
        type="radio"
        checked={data.by === "search"}
        onChange={() => setData({ ...data, by: "search" })}
      />{" "}
      {t(ui.pesquisa)}
    </label>

    <label>
      <input
        type="radio"
        checked={data.by === "collections"}
        onChange={() => setData({ ...data, by: "collections" })}
      />{" "}
      {t(ui.colecao)}
    </label>

    {data.by === "topics" && (
      <label>
        {t(ui.tema)}
        <select
          value={data.topics}
          onChange={(event) => setData({ ...data, topics: event.target.value })}
        >
          {temas.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {nomeDoTema(topic)}
            </option>
          ))}
        </select>
      </label>
    )}

    {data.by === "search" && (
      <>
        <label>
          {t(ui.etiquetas)}
          <DebounceInput
            type="text"
            value={data.search}
            placeholder={t(ui.exemploEtiquetas)}
            onChange={(value) => setData({ ...data, search: value })}
            wait={500}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={data.featured}
            onChange={(event) => setData({ ...data, featured: !data.featured })}
          />{" "}
          {t(ui.soDestaques)}
        </label>
      </>
    )}

    {data.by === "collections" && (
      <label>
        {t(ui.colecao)}
        <DebounceInput
          type="text"
          value={data.collections}
          placeholder={t(ui.idDaColecao)}
          onChange={(value) => setData({ ...data, collections: value })}
          wait={500}
        />
      </label>
    )}
  </div>
  );
};

export default UnsplashSettings;
