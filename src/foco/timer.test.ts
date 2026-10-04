import {
  iniciar,
  pausar,
  relogio,
  restanteMs,
  selo,
  terminou,
  timerPadrao,
  zerar,
} from "./timer";

describe("timer", () => {
  it("roda, pausa e continua sem perder tempo", () => {
    const rodando = iniciar(timerPadrao, 0);
    expect(restanteMs(rodando, 60000)).toBe(24 * 60000);
    const pausado = pausar(rodando, 60000);
    expect(restanteMs(pausado, 999999)).toBe(24 * 60000);
    const continua = iniciar(pausado, 500000);
    expect(continua.fimEm).toBe(500000 + 24 * 60000);
  });

  it("termina no fim e zera para a duração cheia", () => {
    const rodando = iniciar({ ...timerPadrao, minutos: 1 }, 0);
    expect(terminou(rodando, 59999)).toBe(false);
    expect(terminou(rodando, 60000)).toBe(true);
    expect(restanteMs(zerar(rodando), 60000)).toBe(60000);
  });

  it("formata relógio e selo", () => {
    expect(relogio(25 * 60000)).toBe("25:00");
    expect(relogio(3599 * 1000 + 1)).toBe("1:00:00");
    expect(relogio(61500)).toBe("01:02");
    expect(selo(iniciar(timerPadrao, 0), 30000)).toBe("25");
    expect(selo(iniciar(timerPadrao, 0), 24.5 * 60000)).toBe("1");
    expect(selo(pausar(iniciar(timerPadrao, 0), 1000), 1000)).toBe("II");
    expect(selo(timerPadrao, 0)).toBe("");
  });
});
