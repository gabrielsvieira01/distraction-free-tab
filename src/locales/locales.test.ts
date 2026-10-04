import { escolherIdioma } from "./locales";

describe("escolherIdioma", () => {
  it("prefere a tag exata à língua base", () => {
    expect(escolherIdioma(["pt-BR", "pt"])).toBe("pt-BR");
    expect(escolherIdioma(["pt-PT"])).toBe("pt");
    expect(escolherIdioma(["en-GB"])).toBe("en-GB");
  });

  it("usa a língua base quando a região não existe", () => {
    expect(escolherIdioma(["de-AT"])).toBe("de");
    expect(escolherIdioma(["en-US"])).toBe("en");
    expect(escolherIdioma(["es-MX"])).toBe("es");
  });

  it("chinês tradicional e simplificado", () => {
    expect(escolherIdioma(["zh-HK"])).toBe("zh-TW");
    expect(escolherIdioma(["zh-Hant-TW"])).toBe("zh-TW");
    expect(escolherIdioma(["zh"])).toBe("zh-CN");
  });

  it("segue a ordem de preferência e cai para inglês", () => {
    expect(escolherIdioma(["xx", "fr-CA"])).toBe("fr");
    expect(escolherIdioma(["xx"])).toBe("en");
    expect(escolherIdioma([])).toBe("en");
  });
});
