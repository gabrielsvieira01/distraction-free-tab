import React from "react";

/**
 * Dados do foco em browser.storage.local, fora do banco do Tabliss, porque o
 * background e a página de bloqueio precisam ler sem passar pela nova aba.
 */
export const CHAVES = {
  regras: "bloqueio.regras",
  uso: "bloqueio.uso",
  furos: "bloqueio.furos",
  agora: "bloqueio.agora",
  /** Até quando a edição das regras fica destrancada (ms) */
  edicao: "bloqueio.edicaoAte",
  timer: "timer",
} as const;

/** false no build "web", que roda como site comum, sem APIs de extensão */
export const extensaoDisponivel =
  typeof browser !== "undefined" && !!browser.storage;

export async function ler<T>(chave: string, padrao: T): Promise<T> {
  const lido = await browser.storage.local.get(chave);
  return (lido[chave] as T | undefined) ?? padrao;
}

export function gravar<T>(chave: string, valor: T): Promise<void> {
  return browser.storage.local.set({ [chave]: valor });
}

/**
 * Valor ao vivo de uma chave; atualiza quando outra parte da extensão grava.
 * O setter aceita uma função sobre o valor mais recente, para mudanças em
 * sequência rápida não partirem de um render antigo e se sobrescreverem.
 */
export function useArmazenamento<T>(
  chave: string,
  padrao: T,
): [T, (novo: T | ((anterior: T) => T)) => void] {
  const [valor, setValorEstado] = React.useState<T>(padrao);
  const atual = React.useRef(valor);
  const setValor = (novo: T) => {
    atual.current = novo;
    setValorEstado(novo);
  };

  React.useEffect(() => {
    if (!extensaoDisponivel) return;
    let vivo = true;
    ler(chave, padrao).then((lido) => vivo && setValor(lido));
    const aoMudar = (
      mudancas: Record<string, { newValue?: unknown }>,
      area: string,
    ) => {
      if (area === "local" && chave in mudancas)
        setValor((mudancas[chave].newValue as T | undefined) ?? padrao);
    };
    browser.storage.onChanged.addListener(aoMudar);
    return () => {
      vivo = false;
      browser.storage.onChanged.removeListener(aoMudar);
    };
    // padrao é sempre uma constante de módulo, então não entra nas dependências
  }, [chave]);

  const atualizar = React.useCallback(
    (novo: T | ((anterior: T) => T)) => {
      const proximo =
        typeof novo === "function"
          ? (novo as (anterior: T) => T)(atual.current)
          : novo;
      setValor(proximo);
      if (extensaoDisponivel) gravar(chave, proximo);
    },
    [chave],
  );

  return [valor, atualizar];
}
