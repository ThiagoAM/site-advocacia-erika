# Redesign v3 — "Navy Profundo"

**Data:** 22/08/2026 · **Motivo:** o cliente pediu (a) mais proximidade com
[kbmarketingjuridico.com.br](https://kbmarketingjuridico.com.br), (b) um site **mais escuro**
mantendo as cores do briefing, (c) o fim do "mosaico" (padrão em favo repetido) e (d) o
mapa-múndi pontilhado da referência, com os quatro países de atuação.

A v2 já seguia a referência, mas usava o **Azul Legado `#041E42` como fundo de página inteira**.
Em tela cheia esse navy lê claro e saturado — o oposto da atmosfera da KB, que é quase preta com
um único acento dourado. A v3 rebaixa a base e promove o navy a *elevação*.

## 1. Base mais escura

| Papel | v2 | v3 | Token |
|---|---|---|---|
| Fundo da página | `#041E42` | **`#01060F`** | `--bg-page` / `--color-abyss` |
| Fundo alternado | `#02132B` | **`#020B18`** | `--bg-alt` / `--color-ink-900` |
| Superfície elevada | — | **`#041225`** | `--bg-raised` / `--color-ink-800` |
| Azul Legado `#041E42` | fundo | **elevação**: gradiente de card, halos, ícones | `--color-navy` |

O preto absoluto continua proibido: `#01060F` é navy, não preto (R 1 · G 6 · B 15).

Cards deixaram de ser "azuis": `--card-gradient` sai de `rgba(10,43,87,.28)` no topo e cai para
`rgba(1,6,15,.92)` na base, com borda `rgba(251,251,248,.10)` e um fio de luz de 1 px na aresta
superior (`.glass::before`). Sem sombra externa, como na referência.

As seções não trocam mais de cor "em degrau": alternam `--bg-page` / `--bg-alt` e são separadas
por um **fio de luz** (`.section-hairline`), gradiente transparente → dourado → transparente.

## 2. Fim do mosaico

O padrão da marca (`pattern-tile.svg`, página 18 da Proposta) era aplicado em `repeat` no fundo do
hero e do rodapé. Em tela cheia o favo repetido dominava a composição.

**Saiu de todos os lugares.** No hero entrou uma fotografia arquitetônica escura gerada para o
projeto (`img/v3/hero-bg.png`: luz dourada entrando pela direita, 55 % da esquerda praticamente
sólido) + véus em degradê + `.grain` (textura de grão em SVG inline, sem imagem). No rodapé
entraram um fio de luz no topo e um halo dourado bem discreto.

`pattern.svg` / `pattern-tile.svg` continuam em `src/assets/brand/` como ativos oficiais da marca —
apenas não são mais usados como fundo de tela cheia.

## 3. Mapa-múndi pontilhado (`HomeAlcance.astro`)

Seção nova: **"Patrimônio no Brasil, *vida em outro país*"**, com o mapa em pontos e marcadores em
Brasil, EUA, Canadá e Portugal.

O SVG é **gerado**, não desenhado à mão:

1. Massa de terra do Natural Earth 50m (`world-atlas`), projeção `geoEquirectangular`
   recortada em lon −170…180 / lat −56…83 (sem Antártida).
2. A silhueta é rasterizada numa grade de 210 × 83 células; cada célula "com terra" vira um ponto.
3. Cada **linha** de pontos consecutivos é emitida como um único traço com
   `stroke-dasharray: 0 1` e `stroke-linecap: round` — 5 618 pontos em 423 subcaminhos.
   Resultado: `src/assets/brand/world-dots.svg` com **5,5 kB** (1,8 kB gzip).

O script gerador está em `scripts/gen-world-dots.mjs` (rodar só se o enquadramento mudar).

O SVG entra como **máscara** (`mask-image`) de um elemento pintado com um degradê — os pontos
ficam mais frios à esquerda e dourados sobre a Europa, em vez de cor chapada.

Os marcadores usam **as coordenadas da mesma projeção**, convertidas em porcentagem no próprio
gerador, então alinham no ponto exato:

| País | x | y |
|---|---|---|
| Canadá | 18,20 % | 19,20 % |
| EUA | 20,43 % | 30,99 % |
| Portugal | 46,23 % | 31,20 % |
| Brasil | 33,74 % | 70,02 % |

No celular, `.mapa-inner` (que mantém a proporção 210 × 83) cresce para 175 % e desloca −10 %:
pontos e marcadores ampliam juntos, centrando no Atlântico. Ampliado, Portugal fica perto da
borda direita — nessa faixa o rótulo dele sobe para cima do próprio ponto, o que evita tanto o
estouro à direita quanto a colisão com o rótulo da EUA à esquerda.

## 4. Leiautes quebrados corrigidos

| Onde | Problema | Correção |
|---|---|---|
| CTA final ("Vamos desenhar a estrutura do seu legado?") | Os três cards de canal tinham **larguras diferentes**: `.cta-wrap :global([data-reveal]) { align-items: center }` fazia cada card encolher até a largura do próprio texto | O bloco de texto e a lista de canais viraram irmãos independentes; o wrapper de revelação de cada card ocupa a célula inteira da grade (`.canal-reveal { display:flex; width:100% }`) |
| CTA final | O halo era uma **imagem com `mix-blend-mode: screen`**, que clareava a seção inteira e destoava do resto | Virou `radial-gradient` em CSS, com queda até o fundo da página |
| CTA final | E-mail quebrando no meio (`erikasaquetti@gmail.co / m`) | Container mais largo (1020 px) + corpo 14 px |
| Rodapé | Mosaico em favo cobrindo tudo | Fio de luz + halo |
| `/contato` | Seção "Como funciona o atendimento" com `background: var(--color-navy)` — bloco azul claro no meio do site escuro | `var(--bg-alt)` |
| `PageHero` / `PageCta` | Halos em imagem com `mix-blend-mode: screen` | `radial-gradient` em CSS (menos 2 requisições e sem clarear a seção) |
| Rodapé (mobile) | Links com ~19 px de altura de toque | `padding-block` nos links |
| Mapa (selo "4 países") | Número e legenda se sobrepondo | `line-height` e larguras revistas |

## 5. Retratos

A foto da Dra. Érika tem fundo claro (janela e cortina) e "saltava" sobre a base quase preta.
Duas classes globais fazem a ponte, aplicadas nos três pontos onde a foto aparece:

- `.photo-grade` no `<img>` — `saturate(.78) contrast(1.06) brightness(.86)`
- `.photo-tint` numa camada por cima — radial + degradê navy que escurece as bordas e preserva o rosto

## 6. Outras mudanças de composição

- **Hero**: retrato em card 4:5 com halo dourado atrás (fora do `overflow`), legenda com nome e
  OAB sobre o véu, chip de países no topo, linha de credenciais abaixo dos botões e indicador
  de rolagem circular.
- **Áreas de atuação**: cada card carrega a foto-ambiente da própria área como fundo a 20 % de
  opacidade, que sobe para 40 % e escala 1,04 no hover; numeração 01–06 em display dourado.
- **Educação** (home) e **Método**: novas imagens escuras (`img/v3/educacao.png`,
  `img/v3/metodo-bg.png`).
- **Marca-d'água** "Legado": voltou como palavra-fantasma atrás da cabeça da seção "Para quem"
  (contorno dourado 16 % + preenchimento marfim 3,5 %).

## 7. Imagens geradas (Codex, modelo `gpt-5.6-luna`)

Todas em `src/assets/img/v3/`, sem pessoas, sem texto, sem cores proibidas:

| Arquivo | Uso |
|---|---|
| `hero-bg.png` | Fundo do hero da home |
| `metodo-bg.png` | Fundo da seção "Como trabalhamos" |
| `educacao.png` | Figura da seção Educação (home) |
| `educacao-fig.png` | Figura da seção "Públicos" em `/educacao` (substitui `edu-fig.png`, que era clara demais) |

Os halos dourados são todos `radial-gradient` em CSS — não há imagem de glow na v3.
Ficaram **sem uso** (mantidos no repositório): `edu-fig.png`, `glow-gold.png`, `hero-bg.png`,
`metodo-bg.png` (as versões antigas, na raiz de `img/`) e `pattern-tile.svg` como fundo.

## 8. QA

Verificado no build estático (`dist`), com Chromium headless:

- **Sem scroll horizontal**: 64 combinações (8 rotas × 320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 px).
- **Sem erros de console** em nenhuma das 64 combinações.
- **Contraste**: nenhum texto abaixo de 4,5:1 (3:1 para texto grande). O único apontamento
  automático é falso-positivo — o rótulo do botão dourado é medido contra o fundo da página
  porque o botão usa `background-image` (gradiente); medido contra o gradiente real, o pior caso
  é **5,86:1**.
- `prefers-reduced-motion` desliga pulso, marquee, blur de entrada, o "ping" dos marcadores do
  mapa e o zoom dos cards de área.
