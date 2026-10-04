import {
  bloqueioAgoraAtivo,
  fimDaFaixa,
  furosDoDia,
  limitesDoHost,
  motivoDoBloqueio,
  normalizarSite,
  RegraHorario,
  Regras,
  registrarFuro,
  sitesDasRegras,
  somarUso,
  usoVazio,
} from "./regras";

// 2026-10-05 é uma segunda-feira (getDay() === 1)
const em = (dia: number, h: number, m = 0) => new Date(2026, 9, dia, h, m);

const manha: RegraHorario = {
  id: "a",
  sites: ["youtube.com"],
  dias: [1, 2, 3, 4, 5],
  inicio: "09:00",
  fim: "12:00",
  ativa: true,
};

const madrugada: RegraHorario = {
  ...manha,
  id: "b",
  dias: [5], // sexta
  inicio: "23:00",
  fim: "02:00",
};

const regras: Regras = {
  horarios: [manha],
  limites: [{ id: "l", site: "instagram.com", minutos: 30, ativa: true }],
};

describe("normalizarSite", () => {
  it("tira protocolo, www, caminho e porta", () => {
    expect(normalizarSite("https://www.YouTube.com/watch?v=1")).toBe(
      "youtube.com",
    );
    expect(normalizarSite("  reddit.com:443/r/x ")).toBe("reddit.com");
    expect(normalizarSite("m.facebook.com")).toBe("m.facebook.com");
  });
});

describe("fimDaFaixa", () => {
  it("dentro da faixa no mesmo dia", () => {
    expect(fimDaFaixa(manha, em(5, 10, 30))).toEqual(em(5, 12));
  });

  it("fora da faixa, no limite final e em dia não marcado", () => {
    expect(fimDaFaixa(manha, em(5, 8, 59))).toBeNull();
    expect(fimDaFaixa(manha, em(5, 12, 0))).toBeNull();
    expect(fimDaFaixa(manha, em(4, 10))).toBeNull(); // domingo
  });

  it("faixa que atravessa a meia-noite pertence ao dia em que começa", () => {
    expect(fimDaFaixa(madrugada, em(9, 23, 30))).toEqual(em(10, 2)); // sex → sáb
    expect(fimDaFaixa(madrugada, em(10, 1, 0))).toEqual(em(10, 2)); // sáb madrugada
    expect(fimDaFaixa(madrugada, em(10, 23, 30))).toBeNull(); // sáb à noite
    expect(fimDaFaixa(madrugada, em(9, 1, 0))).toBeNull(); // sex madrugada (qui não marcada)
  });
});

describe("motivoDoBloqueio", () => {
  it("bloqueia subdomínio no horário", () => {
    const motivo = motivoDoBloqueio(
      "https://m.youtube.com/x",
      em(5, 10),
      regras,
      usoVazio,
      [],
    );
    expect(motivo?.tipo).toBe("horario");
    expect(motivo?.site).toBe("youtube.com");
  });

  it("não confunde domínios parecidos", () => {
    expect(
      motivoDoBloqueio("https://notyoutube.com", em(5, 10), regras, usoVazio, []),
    ).toBeNull();
  });

  it("ignora regra desativada e páginas que não são http", () => {
    const desligada = { ...regras, horarios: [{ ...manha, ativa: false }] };
    expect(
      motivoDoBloqueio("https://youtube.com", em(5, 10), desligada, usoVazio, []),
    ).toBeNull();
    expect(
      motivoDoBloqueio("about:newtab", em(5, 10), regras, usoVazio, []),
    ).toBeNull();
  });

  it("furo ativo libera; furo vencido não", () => {
    const agora = em(5, 10);
    const furos = registrarFuro([], "youtube.com", +agora);
    expect(
      motivoDoBloqueio("https://youtube.com", agora, regras, usoVazio, furos),
    ).toBeNull();
    expect(
      motivoDoBloqueio(
        "https://youtube.com",
        em(5, 10, 6),
        regras,
        usoVazio,
        furos,
      )?.tipo,
    ).toBe("horario");
  });

  it("limite diário bloqueia só depois de estourar e zera no dia seguinte", () => {
    const agora = em(5, 15);
    let uso = somarUso(usoVazio, ["instagram.com"], 29 * 60, agora);
    expect(
      motivoDoBloqueio("https://instagram.com", agora, regras, uso, []),
    ).toBeNull();
    uso = somarUso(uso, ["instagram.com"], 60, agora);
    expect(
      motivoDoBloqueio("https://www.instagram.com", agora, regras, uso, [])
        ?.tipo,
    ).toBe("limite");
    expect(
      motivoDoBloqueio("https://instagram.com", em(6, 9), regras, uso, []),
    ).toBeNull();
  });
});

describe("contagem e furos", () => {
  it("somarUso troca de dia e limitesDoHost casa subdomínios", () => {
    const ontem = somarUso(usoVazio, ["instagram.com"], 100, em(5, 23));
    const hoje = somarUso(ontem, ["instagram.com"], 5, em(6, 0, 1));
    expect(hoje.segundos["instagram.com"]).toBe(5);
    expect(limitesDoHost("help.instagram.com", regras)).toEqual([
      "instagram.com",
    ]);
  });

  it("furos antigos são podados e furosDoDia conta só hoje", () => {
    const velho = registrarFuro([], "x.com", +em(1, 10) - 40 * 864e5);
    const furos = registrarFuro(
      registrarFuro(velho, "x.com", +em(4, 10)),
      "x.com",
      +em(5, 10),
    );
    expect(furos).toHaveLength(2);
    expect(furosDoDia(furos, em(5, 18))).toHaveLength(1);
  });
});

describe("bloquear agora", () => {
  const agora = em(4, 20); // domingo à noite: nenhuma faixa de horário vale
  const fim = +agora + 25 * 60 * 1000;

  it("junta os sites de todas as regras, sem repetir", () => {
    expect(
      sitesDasRegras({
        ...regras,
        limites: [...regras.limites, { id: "x", site: "youtube.com", minutos: 5, ativa: true }],
      }),
    ).toEqual(["youtube.com", "instagram.com"]);
  });

  it("bloqueia sites das regras fora do horário e antes do limite", () => {
    const manual = { inicio: +agora, ate: fim };
    const motivo = motivoDoBloqueio("https://www.instagram.com", agora, regras, usoVazio, [], manual);
    expect(motivo?.tipo).toBe("agora");
    expect(
      motivoDoBloqueio("https://wikipedia.org", agora, regras, usoVazio, [], manual),
    ).toBeNull();
  });

  it("acaba no fim; sem fim dura até encerrar; furo libera", () => {
    const depois = new Date(fim + 1);
    expect(
      motivoDoBloqueio("https://youtube.com", depois, regras, usoVazio, [], { inicio: +agora, ate: fim }),
    ).toBeNull();
    const semFim = { inicio: +agora, ate: null };
    expect(bloqueioAgoraAtivo(semFim, +agora + 864e5)).toBe(true);
    expect(
      motivoDoBloqueio("https://youtube.com", agora, regras, usoVazio, registrarFuro([], "youtube.com", +agora), semFim),
    ).toBeNull();
  });
});
