import React, { FC } from "react";

import {
  CHAVES,
  extensaoDisponivel,
  useArmazenamento,
} from "../../../foco/armazenamento";
import { descreverAte, formatarDuracao, formatarHora } from "../../../foco/idioma";
import { mensagens } from "../../../foco/mensagens";
import {
  BloqueioAgora,
  bloqueioAgoraAtivo,
  fimDaFaixa,
  Furo,
  furosDoDia,
  minutosArredondados,
  regrasVazias,
  sitesDasRegras,
  usadoHoje,
  usoVazio,
} from "../../../foco/regras";
import { useIdioma } from "../../../foco/useIdioma";
import "./Bloqueio.sass";
import { useAgora } from "./useAgora";

const furosVazios: Furo[] = [];
const semBloqueioAgora: BloqueioAgora | null = null;
/** Durações do "bloquear agora"; null = até desligar */
const DURACOES = [25, 60, 120, null];

const Bloqueio: FC = () => {
  const { t, locale } = useIdioma();
  const [regras] = useArmazenamento(CHAVES.regras, regrasVazias);
  const [uso] = useArmazenamento(CHAVES.uso, usoVazio);
  const [furos] = useArmazenamento(CHAVES.furos, furosVazios);
  const [manual, setManual] = useArmazenamento<BloqueioAgora | null>(
    CHAVES.agora,
    semBloqueioAgora,
  );
  const agora = useAgora();

  if (!extensaoDisponivel)
    return <div className="Bloqueio">{t(mensagens.soNaExtensao)}</div>;

  if (regras.horarios.length === 0 && regras.limites.length === 0)
    return <div className="Bloqueio">{t(mensagens.semRegras)}</div>;

  const faixasAgora = regras.horarios
    .filter((regra) => regra.ativa && regra.sites.length > 0)
    .map((regra) => ({ regra, fim: fimDaFaixa(regra, agora) }))
    .filter(({ fim }) => fim !== null);
  const limites = regras.limites.filter((limite) => limite.ativa);
  const furosHoje = furosDoDia(furos, agora).length;
  const sitesAgora = sitesDasRegras(regras);
  const ligado = bloqueioAgoraAtivo(manual, +agora);

  const bloquearAgora = (minutos: number | null) => {
    const inicio = Date.now();
    setManual({ inicio, ate: minutos === null ? null : inicio + minutos * 60000 });
  };
  // Encerrar antes do fim passa pelo mesmo atrito do furo
  const encerrar = () => {
    location.href = browser.runtime.getURL("bloqueado.html?encerrar=1");
  };

  return (
    <div className="Bloqueio">
      {ligado ? (
        <p>
          🔒 {t(mensagens.bloqueioImediato)}{" "}
          <span>
            {descreverAte(
              manual.ate === null ? null : new Date(manual.ate),
              t,
              locale,
            )}
          </span>{" "}
          · <a onClick={encerrar}>{t(mensagens.encerrar)}</a>
        </p>
      ) : (
        sitesAgora.length > 0 && (
          <p className="Bloqueio-agora">
            {t(mensagens.bloquearAgora)}{" "}
            {DURACOES.map((minutos, indice) => (
              <React.Fragment key={String(minutos)}>
                {indice > 0 && " · "}
                <a onClick={() => bloquearAgora(minutos)}>
                  {minutos === null
                    ? t(mensagens.ateDesligar)
                    : formatarDuracao(minutos, locale)}
                </a>
              </React.Fragment>
            ))}
          </p>
        )
      )}

      {faixasAgora.map(({ regra, fim }) => (
        <p key={regra.id}>
          🔒 {regra.sites.join(", ")}{" "}
          <span>{t(mensagens.ate, { time: formatarHora(fim!, locale) })}</span>
        </p>
      ))}

      {limites.map((limite) => {
        const usado = minutosArredondados(usadoHoje(uso, limite.site, agora));
        const fracao = Math.min(usado / Math.max(limite.minutos, 1), 1);
        return (
          <div key={limite.id} className="Bloqueio-limite">
            <p>
              {limite.site}{" "}
              <span>
                {t(mensagens.usoDoLimite, {
                  used: formatarDuracao(usado, locale),
                  limit: formatarDuracao(limite.minutos, locale),
                })}
              </span>
            </p>
            <div className="Bloqueio-barra">
              <div
                className={fracao >= 1 ? "estourou" : undefined}
                style={{ width: `${fracao * 100}%` }}
              />
            </div>
          </div>
        );
      })}

      {furosHoje > 0 && (
        <p className="Bloqueio-furos">
          {t(mensagens.furosHoje, { count: furosHoje })}
        </p>
      )}
    </div>
  );
};

export default Bloqueio;
