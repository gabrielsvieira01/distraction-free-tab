import React from "react";

/** Re-renderiza de tempos em tempos para estados que dependem do relógio */
export function useAgora(intervaloMs = 15000): Date {
  const [agora, setAgora] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), intervaloMs);
    return () => clearInterval(id);
  }, [intervaloMs]);
  return agora;
}
