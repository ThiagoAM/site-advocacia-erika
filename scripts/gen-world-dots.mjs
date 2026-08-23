/**
 * Gera `src/assets/brand/world-dots.svg` — o mapa-múndi pontilhado da seção
 * "Alcance" (src/components/home/HomeAlcance.astro).
 *
 * Rodar só quando o enquadramento (LAT/LON) ou a densidade (COLS) mudarem.
 * As dependências não fazem parte do site — instale sob demanda:
 *
 *   npm i --no-save world-atlas topojson-client d3-geo sharp
 *   node scripts/gen-world-dots.mjs src/assets/brand/world-dots.svg
 *
 * O script imprime, além do SVG, as coordenadas x/y (em %) de cada país na
 * MESMA projeção — é de lá que saem os percentuais dos marcadores no
 * componente. Se o enquadramento mudar, atualize-os junto.
 *
 * Cada linha de pontos vira um único traço com `stroke-dasharray: 0 1` e
 * ponta redonda: 5 618 pontos cabem em 423 subcaminhos (~5,5 kB).
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import * as topojson from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/land-50m.json');
const land = topojson.feature(topo, topo.objects.land);

// ---- enquadramento: mundo sem a Antártida, com um pouco de folga no topo
const LAT_MAX = 83;
const LAT_MIN = -56;
const LON_MIN = -170;
const LON_MAX = 180;

// grade de pontos
const COLS = 210;                              // colunas de pontos
const ASPECT = (LAT_MAX - LAT_MIN) / (LON_MAX - LON_MIN); // proporção equiretangular
const ROWS = Math.round(COLS * ASPECT);

// projeção que mapeia o retângulo lon/lat exatamente na grade COLS x ROWS
const projection = geoEquirectangular()
  .scale(COLS / ((LON_MAX - LON_MIN) * Math.PI / 180))
  .translate([
    COLS / 2 - (((LON_MIN + LON_MAX) / 2) * Math.PI / 180) * (COLS / ((LON_MAX - LON_MIN) * Math.PI / 180)),
    ROWS / 2 + (((LAT_MIN + LAT_MAX) / 2) * Math.PI / 180) * (COLS / ((LON_MAX - LON_MIN) * Math.PI / 180)),
  ]);

const path = geoPath(projection);
const d = path(land);

// ---- rasteriza a massa de terra na resolução da grade
const raster = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS}" height="${ROWS}" viewBox="0 0 ${COLS} ${ROWS}"><rect width="100%" height="100%" fill="#000"/><path d="${d}" fill="#fff"/></svg>`;
const { data, info } = await sharp(Buffer.from(raster), { density: 72 })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

// ---- gera os pontos (grade em unidades inteiras: 1 unidade = 1 célula)
// Cada linha vira UMA sequência de traços com `stroke-dasharray: 0 1` e ponta
// redonda: o SVG fica ~10x menor do que um <circle>/<use> por ponto.
const OUT_W = COLS;
const OUT_H = ROWS;
const DOT = 0.62; // diâmetro do ponto (= stroke-width)

let count = 0;
const runs = [];
for (let y = 0; y < info.height; y++) {
  let x = 0;
  while (x < info.width) {
    if (data[y * info.width + x] > 110) {
      const start = x;
      while (x < info.width && data[y * info.width + x] > 110) x++;
      const len = x - start;
      count += len;
      runs.push(`M${start}.5 ${y}.5h${len - 1}`);
    } else x++;
  }
}
const dAttr = runs.join('');

// ---- marcadores dos países (lon, lat -> x, y na mesma projeção)
const PLACES = {
  brasil: [-51.9, -14.2],
  eua: [-98.5, 39.8],
  canada: [-106.3, 56.1],
  portugal: [-8.2, 39.5],
};
const marks = Object.fromEntries(
  Object.entries(PLACES).map(([k, lonlat]) => {
    const [px, py] = projection(lonlat);
    return [k, { xpc: +((px / OUT_W) * 100).toFixed(2), ypc: +((py / OUT_H) * 100).toFixed(2) }];
  }),
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OUT_W} ${OUT_H}" width="${OUT_W}" height="${OUT_H}"><path d="${dAttr}" fill="none" stroke="#000" stroke-width="${DOT}" stroke-linecap="round" stroke-dasharray="0 1"/></svg>`;

fs.writeFileSync(process.argv[2] || 'world-dots.svg', svg);
console.log(JSON.stringify({ cols: COLS, rows: ROWS, dots: count, runs: runs.length, OUT_W, OUT_H, bytes: svg.length, marks }, null, 2));
