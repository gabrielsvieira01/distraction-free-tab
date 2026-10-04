import React, { FC } from "react";

import { comparavel, SEGUNDOS_DE_ESPERA } from "../../../foco/atrito";
import { Mensagem, mensagens } from "../../../foco/mensagens";
import { useIdioma } from "../../../foco/useIdioma";

/**
 * Digitar a frase (colar não vale) ou esperar 30 s com a aba à vista;
 * só então o botão final libera a ação.
 */
const Atrito: FC<{
  instrucao: Mensagem;
  frase: Mensagem;
  rotuloBotao: string;
  onConcluir: () => void;
}> = ({ instrucao, frase, rotuloBotao, onConcluir }) => {
  const { t } = useIdioma();
  const texto = t(frase);
  const [digitado, setDigitado] = React.useState("");
  const [restante, setRestante] = React.useState<number | null>(null);

  // Desconta um segundo por vez só com a aba à vista; para ao chegar em zero
  const contando = restante !== null && restante > 0;
  React.useEffect(() => {
    if (!contando) return;
    const id = setInterval(() => {
      if (!document.hidden)
        setRestante((r) => (r === null ? r : Math.max(r - 1, 0)));
    }, 1000);
    return () => clearInterval(id);
  }, [contando]);

  const fraseOk = comparavel(digitado) === comparavel(texto);
  const esperaOk = restante === 0;
  const bloquear = (evento: React.SyntheticEvent) => evento.preventDefault();

  return (
    <div className="Atrito">
      <p>{t(instrucao)}</p>
      <blockquote>{texto}</blockquote>
      <input
        type="text"
        value={digitado}
        aria-label={t(mensagens.rotuloFrase)}
        autoComplete="off"
        spellCheck={false}
        onPaste={bloquear}
        onDrop={bloquear}
        onChange={(evento) => setDigitado(evento.target.value)}
      />
      <p className="Atrito-ou">{t(mensagens.ou)}</p>
      <button
        type="button"
        className="button button--secondary"
        disabled={restante !== null}
        onClick={() => setRestante(SEGUNDOS_DE_ESPERA)}
      >
        {esperaOk
          ? t(mensagens.esperaConcluida)
          : restante !== null
            ? t(mensagens.aguarde, { seconds: restante })
            : t(mensagens.prefiroEsperar, { seconds: SEGUNDOS_DE_ESPERA })}
      </button>
      <button
        type="button"
        className="button button--primary"
        disabled={!(fraseOk || esperaOk)}
        onClick={onConcluir}
      >
        {rotuloBotao}
      </button>
    </div>
  );
};

export default Atrito;
