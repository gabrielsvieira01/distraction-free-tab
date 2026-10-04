import React, { FC } from "react";

import { sortear } from "../../../foco/atrito";
import {
  CHAVES,
  extensaoDisponivel,
  useArmazenamento,
} from "../../../foco/armazenamento";
import { formatarHora, nomesDosDias } from "../../../foco/idioma";
import { mensagens } from "../../../foco/mensagens";
import {
  LimiteDiario,
  normalizarSite,
  novoId,
  RegraHorario,
  regrasVazias,
} from "../../../foco/regras";
import { useIdioma } from "../../../foco/useIdioma";
import Atrito from "./Atrito";
import { useAgora } from "./useAgora";

/** Quanto tempo a edição fica destrancada depois de passar pelo atrito */
const MINUTOS_DESTRANCADA = 10;
const semDestrancar: number | null = null;

const sitesDoTexto = (texto: string) =>
  [...new Set(texto.split(/[\n,]/).map(normalizarSite))].filter(Boolean);

/** Mudança aplicada sobre o valor mais recente do item, não o do último render */
type Mudar<T> = (mudanca: (atual: T) => T) => void;

const EditorHorario: FC<{
  regra: RegraHorario;
  mudar: Mudar<RegraHorario>;
  onRemove: () => void;
}> = ({ regra, mudar, onRemove }) => {
  const { t, locale } = useIdioma();
  const dias = React.useMemo(() => nomesDosDias(locale), [locale]);
  // Texto cru enquanto digita; vira lista normalizada ao sair do campo
  const [texto, setTexto] = React.useState(regra.sites.join("\n"));

  const alternarDia = (dia: number) =>
    mudar((atual) => ({
      ...atual,
      dias: atual.dias.includes(dia)
        ? atual.dias.filter((d) => d !== dia)
        : [...atual.dias, dia].sort(),
    }));

  return (
    <fieldset>
      <label>
        {t(mensagens.sitesUmPorLinha)}
        <textarea
          value={texto}
          placeholder={t(mensagens.exemploSites)}
          onChange={(evento) => setTexto(evento.target.value)}
          onBlur={(evento) => {
            const sites = sitesDoTexto(evento.target.value);
            setTexto(sites.join("\n"));
            mudar((atual) => ({ ...atual, sites }));
          }}
        />
      </label>

      <div className="dias">
        {dias.map((nome, dia) => (
          <label key={dia}>
            <input
              type="checkbox"
              checked={regra.dias.includes(dia)}
              onChange={() => alternarDia(dia)}
            />
            {nome}
          </label>
        ))}
      </div>

      <div className="faixa">
        {t(mensagens.das)}
        <input
          type="time"
          value={regra.inicio}
          onChange={(evento) => {
            const inicio = evento.target.value;
            if (inicio) mudar((atual) => ({ ...atual, inicio }));
          }}
        />
        {t(mensagens.as)}
        <input
          type="time"
          value={regra.fim}
          onChange={(evento) => {
            const fim = evento.target.value;
            if (fim) mudar((atual) => ({ ...atual, fim }));
          }}
        />
      </div>
      {regra.fim <= regra.inicio && (
        <small>{t(mensagens.atravessaMeiaNoite)}</small>
      )}

      <div className="linha">
        <label>
          <input
            type="checkbox"
            checked={regra.ativa}
            onChange={() => mudar((atual) => ({ ...atual, ativa: !atual.ativa }))}
          />
          {t(mensagens.ativa)}
        </label>
        <button
          type="button"
          className="button button--secondary"
          onClick={onRemove}
        >
          {t(mensagens.remover)}
        </button>
      </div>
    </fieldset>
  );
};

const EditorLimite: FC<{
  limite: LimiteDiario;
  mudar: Mudar<LimiteDiario>;
  onRemove: () => void;
}> = ({ limite, mudar, onRemove }) => {
  const { t } = useIdioma();
  const [texto, setTexto] = React.useState(limite.site);

  return (
    <fieldset>
      <label>
        {t(mensagens.site)}
        <input
          type="text"
          value={texto}
          placeholder={t(mensagens.exemploSites)}
          onChange={(evento) => setTexto(evento.target.value)}
          onBlur={(evento) => {
            const site = normalizarSite(evento.target.value);
            setTexto(site);
            mudar((atual) => ({ ...atual, site }));
          }}
        />
      </label>
      <label>
        {t(mensagens.minutosPorDia)}
        <input
          type="number"
          min={1}
          value={limite.minutos}
          onChange={(evento) => {
            const minutos = Math.max(1, Number(evento.target.value) || 1);
            mudar((atual) => ({ ...atual, minutos }));
          }}
        />
      </label>
      <div className="linha">
        <label>
          <input
            type="checkbox"
            checked={limite.ativa}
            onChange={() => mudar((atual) => ({ ...atual, ativa: !atual.ativa }))}
          />
          {t(mensagens.ativa)}
        </label>
        <button
          type="button"
          className="button button--secondary"
          onClick={onRemove}
        >
          {t(mensagens.remover)}
        </button>
      </div>
    </fieldset>
  );
};

const mudarItem = <T extends { id: string }>(
  lista: T[],
  id: string,
  mudanca: (atual: T) => T,
) => lista.map((item) => (item.id === id ? mudanca(item) : item));

/**
 * Com regras já criadas, a edição fica trancada: afrouxar o bloqueio
 * por impulso exige o mesmo atrito do furo, e destranca por alguns minutos.
 */
const Trava: FC<{
  destrancadaAte: number | null;
  setDestrancadaAte: (ate: number | null) => void;
}> = ({ destrancadaAte, setDestrancadaAte }) => {
  const { t, locale } = useIdioma();
  const [pedindo, setPedindo] = React.useState(false);

  if (destrancadaAte !== null)
    return (
      <p className="Trava">
        {t(mensagens.destrancadaAte, {
          time: formatarHora(new Date(destrancadaAte), locale),
        })}{" "}
        <a onClick={() => setDestrancadaAte(null)}>{t(mensagens.trancarAgora)}</a>
      </p>
    );

  return (
    <div className="Trava">
      <p>🔒 {t(mensagens.regrasTrancadas)}</p>
      {pedindo ? (
        <Atrito
          instrucao={mensagens.instrucaoEditar}
          frase={mensagens.fraseEditar}
          rotuloBotao={t(mensagens.destrancar)}
          onConcluir={() => {
            setPedindo(false);
            setDestrancadaAte(Date.now() + MINUTOS_DESTRANCADA * 60000);
          }}
        />
      ) : (
        <button
          type="button"
          className="button button--secondary"
          onClick={() => setPedindo(true)}
        >
          {t(mensagens.destrancar)}
        </button>
      )}
    </div>
  );
};

const BloqueioSettings: FC = () => {
  const { t } = useIdioma();
  const [regras, setRegras] = useArmazenamento(CHAVES.regras, regrasVazias);
  const [destrancadaAte, setDestrancadaAte] = useArmazenamento<number | null>(
    CHAVES.edicao,
    semDestrancar,
  );
  const agora = useAgora();

  if (!extensaoDisponivel)
    return <div className="BloqueioSettings">{t(mensagens.soNaExtensao)}</div>;

  const temRegras = regras.horarios.length > 0 || regras.limites.length > 0;
  const destrancada = destrancadaAte !== null && destrancadaAte > +agora;
  const trancada = temRegras && !destrancada;
  // Quem cria a primeira regra continua configurando sem bater na trava
  const aoAdicionar = () => {
    if (!temRegras) setDestrancadaAte(Date.now() + MINUTOS_DESTRANCADA * 60000);
  };

  return (
    <div className="BloqueioSettings">
      {temRegras && (
        <Trava
          destrancadaAte={destrancada ? destrancadaAte : null}
          setDestrancadaAte={setDestrancadaAte}
        />
      )}

      {/* Um fieldset desabilitado trava todos os campos e botões de uma vez */}
      <fieldset className="BloqueioSettings-regras" disabled={trancada}>
        <h5>{t(mensagens.porHorario)}</h5>
        {regras.horarios.map((regra) => (
          <EditorHorario
            key={regra.id}
            regra={regra}
            mudar={(mudanca) =>
              setRegras((atual) => ({
                ...atual,
                horarios: mudarItem(atual.horarios, regra.id, mudanca),
              }))
            }
            onRemove={() =>
              setRegras((atual) => ({
                ...atual,
                horarios: atual.horarios.filter((r) => r.id !== regra.id),
              }))
            }
          />
        ))}
        <button
          type="button"
          className="button button--primary"
          onClick={() => {
            aoAdicionar();
            setRegras((atual) => ({
              ...atual,
              horarios: [
                ...atual.horarios,
                {
                  id: novoId(),
                  sites: [],
                  dias: [1, 2, 3, 4, 5],
                  inicio: "09:00",
                  fim: "12:00",
                  ativa: true,
                },
              ],
            }));
          }}
        >
          {t(mensagens.adicionarHorario)}
        </button>

        <h5>{t(mensagens.limiteDiario)}</h5>
        {regras.limites.map((limite) => (
          <EditorLimite
            key={limite.id}
            limite={limite}
            mudar={(mudanca) =>
              setRegras((atual) => ({
                ...atual,
                limites: mudarItem(atual.limites, limite.id, mudanca),
              }))
            }
            onRemove={() =>
              setRegras((atual) => ({
                ...atual,
                limites: atual.limites.filter((l) => l.id !== limite.id),
              }))
            }
          />
        ))}
        <button
          type="button"
          className="button button--primary"
          onClick={() => {
            aoAdicionar();
            setRegras((atual) => ({
              ...atual,
              limites: [
                ...atual.limites,
                { id: novoId(), site: "", minutos: 30, ativa: true },
              ],
            }));
          }}
        >
          {t(mensagens.adicionarLimite)}
        </button>
      </fieldset>
    </div>
  );
};

export default BloqueioSettings;
