import React, { FC } from "react";

import {
  CHAVES,
  extensaoDisponivel,
  useArmazenamento,
} from "../../../foco/armazenamento";
import { mensagens } from "../../../foco/mensagens";
import {
  iniciar,
  pausar,
  relogio,
  restanteMs,
  timerPadrao,
  zerar,
} from "../../../foco/timer";
import { useIdioma } from "../../../foco/useIdioma";
import { useAgora } from "../bloqueio/useAgora";
import "./Timer.sass";

const Timer: FC = () => {
  const { t } = useIdioma();
  const [timer, setTimer] = useArmazenamento(CHAVES.timer, timerPadrao);
  // Um tique por segundo basta para o relógio; parado, quase nada muda
  const agora = +useAgora(timer.estado === "rodando" ? 1000 : 15000);

  if (!extensaoDisponivel)
    return <div className="Timer">{t(mensagens.soNaExtensao)}</div>;

  return (
    <div className="Timer">
      <h2>{relogio(restanteMs(timer, agora))}</h2>
      <p>
        {timer.estado === "rodando" ? (
          <a onClick={() => setTimer((atual) => pausar(atual, Date.now()))}>
            {t(mensagens.pausar)}
          </a>
        ) : (
          <a onClick={() => setTimer((atual) => iniciar(atual, Date.now()))}>
            {t(timer.estado === "pausado" ? mensagens.continuar : mensagens.iniciar)}
          </a>
        )}
        {timer.estado !== "parado" && (
          <>
            {" · "}
            <a onClick={() => setTimer(zerar)}>{t(mensagens.zerar)}</a>
          </>
        )}
      </p>
    </div>
  );
};

export default Timer;
