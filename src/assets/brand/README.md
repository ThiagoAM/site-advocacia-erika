# Marca — Saquetti Martins Advocacia

Arte **definitiva**, extraída do *press kit* entregue pela agência Spasso
(`Brand Kit/Arquivos editáveis/Saquetti Martins - Logo.pdf`, ago/2026). São
vetores de verdade (nada de traçado sobre bitmap), sem fundo, com `viewBox`
justo ao conteúdo e 3 % de folga.

Substituem os SVGs anteriores, que tinham sido extraídos da *proposta* — a arte
final mudou de proporção e de recorte em várias peças.

## Lockups

Cada lockup vem em três versões, que correspondem exatamente às aplicações
oficiais das págs. 4–7 do press kit:

| Sufixo | Aplicação oficial | Cores |
|---|---|---|
| *(nenhum)* | "Cor — fundos claros" | navy `#041E42` + ouro `#866D4B` |
| `-light` | "Cor — fundos escuros" | marfim `#FBFBF8` + ouro `#866D4B` |
| `-mono` | "Positivo / negativo" | tudo em `currentColor` |

| Arquivo | Conteúdo | Proporção |
|---|---|---|
| `logo-horizontal*.svg` | monograma à esquerda, nome à direita | 385 × 78 |
| `logo-vertical*.svg` | monograma acima, nome abaixo | 313 × 133 |
| `logo-circular*.svg` | selo com o nome em arco e anéis | 122 × 122 |
| `simbolo.svg` / `simbolo-mono.svg` | monograma SM isolado (sempre ouro) | 92 × 115 |

O site usa `-light` no cabeçalho, no rodapé e no selo da home; `-mono` sobra
para casos em que a cor precisa vir do CSS.

## Padrão

`pattern-01.svg` e `pattern-02.svg` são **ladrilhos sem emenda** de um período
exato do padrão oficial (`Brand Kit/Pattern/*.png`, 2900 × 1500). O período foi
medido por autocorrelação (≈ 394 × 395 px no 01, ≈ 363 × 459 px no 02), o
recorte foi convertido em máscara de cobertura e vetorizado em polígonos.

Ambos usam `fill="currentColor"`, então servem tanto inline quanto como
**máscara** — é assim que o site os aplica (ver `.pattern-veil` em
`src/styles/global.css`): a cor vem do gradiente dourado, o SVG só recorta.

`pattern-01` é o entrelaçado do próprio monograma e é o que está no ar.

## Fonte

`fonts/SELINA.otf` é a display da marca, como entregue. Ela **não tem nenhum
glifo acentuado** (á, ç, ã… constam do cmap mas apontam para a letra sem
acento) e o `i`/`j` saíram sem pingo. `scripts/build-selina.py` repara isso e
gera `public/fonts/selina-sm.woff2`, que é o arquivo servido.

## Outros

`world-dots.svg` — mapa-múndi pontilhado da seção "Alcance"; não faz parte do
Brand Kit (gerado por `scripts/gen-world-dots.mjs`).

Cores: navy `#041E42` · ouro `#866D4B` · marfim `#FBFBF8`.
