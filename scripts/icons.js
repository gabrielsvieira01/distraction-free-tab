// Gera os PNGs do manifesto a partir de target/shared/icons/logo.svg
const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const pasta = path.resolve(__dirname, "../target/shared/icons");
const svg = fs.readFileSync(path.join(pasta, "logo.svg"));

for (const tamanho of [32, 48, 96, 128]) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: tamanho } })
    .render()
    .asPng();
  fs.writeFileSync(path.join(pasta, `${tamanho}.png`), png);
  console.log(`icons/${tamanho}.png`);
}
