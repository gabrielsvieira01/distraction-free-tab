import React, { FC } from "react";

import {
  CHAVES,
  extensaoDisponivel,
  useArmazenamento,
} from "../../../foco/armazenamento";
import { mensagens } from "../../../foco/mensagens";
import { timerPadrao } from "../../../foco/timer";
import { useIdioma } from "../../../foco/useIdioma";

const TimerSettings: FC = () => {
  const { t } = useIdioma();
  const [timer, setTimer] = useArmazenamento(CHAVES.timer, timerPadrao);

  if (!extensaoDisponivel) return <div>{t(mensagens.soNaExtensao)}</div>;

  return (
    <label>
      {t(mensagens.duracaoTimer)}
      <input
        type="number"
        min={1}
        max={600}
        value={timer.minutos}
        onChange={(evento) => {
          const minutos = Math.min(600, Math.max(1, Number(evento.target.value) || 1));
          // A duração nova vale a partir do próximo início
          setTimer((atual) => ({ ...atual, minutos }));
        }}
      />
    </label>
  );
};

export default TimerSettings;
