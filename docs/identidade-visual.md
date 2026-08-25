# Identidade Visual

Fontes: **Brand Kit** definitivo da agência **Spasso** (ago/2026) — press kit
(`Saquetti Martins - Logo.pdf`, 13 págs.), padrões, exportações em PNG e a
fonte `SELINA.otf` — mais a proposta original (45 págs.).

> O Brand Kit vive fora do repositório (entregue em `~/Desktop/Brand Kit`). O que
> o site precisa já foi extraído para `src/assets/brand/` e `public/`.

## Paleta

| Cor | Hex | Uso aproximado | Notas |
|---|---|---|---|
| Azul Legado | `#041E42` | ~50% | Cor dominante (navy profundo) |
| Ouro Patrimônio | `#866D4B` | ~35% | Dourado fosco, nunca brilhante/metálico saturado |
| Marfim | `#FBFBF8` | ~15% | Fundo claro |

### Cores proibidas

- Neon (qualquer)
- Roxo / lilás
- Laranja
- Vermelho
- Amarelo
- Rosa
- Preto absoluto como cor dominante

## Tipografia

| Contexto | Display | Corpo |
|---|---|---|
| Marca (press kit, pág. 10–11) | **Selina** | **Marlin** (sans geométrica) |
| Site (24/08/2026) | **Selina SM** — a própria Selina, reparada e auto-hospedada | **Montserrat** 400/500/600 (substituta da Marlin, via Google Fonts) |

O logotipo **não** é composto em Selina: "Saquetti Martins" é um lettering
serifado próprio, com pingo no i e serifas — outro desenho.

### Selina SM — por que a fonte foi reparada

A `SELINA.otf` entregue (TOKOPRESS, gerada no Fontself) tem 107 glifos e cobre
só o ASCII. Dois problemas fatais para um site em português:

1. **Nenhum glifo acentuado.** `Á`, `ç`, `ã`… existem no cmap, mas apontam para
   a letra-base sem acento — "patrimônios" sairia "patrimonios", "Proteção"
   sairia "Protecao". Não é fallback do navegador: a fonte responde que tem o
   caractere e desenha a letra errada.
2. **`i` e `j` sem pingo.**

`scripts/build-selina.py` compõe os 65 glifos que faltavam a partir das marcas
do próprio desenho (`` ` ``, `~`, vírgula, ponto), redesenha o circunflexo (o
`^` original é um filete que some em corpo de texto) e devolve o pingo ao i/j,
preservando as formas sem pingo como `dotlessi`/`dotlessj` — que são a base
correta de `í`, `ì`, `î`, `ï`. Também entram `–`, `—`, `…`, `·`, `°`, `º`, `ª`.

Saída: `public/fonts/selina-sm.woff2` (16 KB), com `preload` no `BaseLayout`.

Para regerar:

```
python scripts/build-selina.py src/assets/brand/fonts/SELINA.otf /tmp/SelinaSM.otf
```

(depois converta para WOFF2 com `fontTools` — `f.flavor = "woff2"`.)

### Consequências no CSS

- A Selina tem **um único corte** e **não tem itálico**: os títulos usam
  `font-weight: 400` + `font-synthesis: none`, e `<em>` dentro de h1/h2/h3
  perde o itálico (`.em-gold` continua marcando pelo ouro).
- A altura de x da Selina é maior que a da Cormorant: as escalas de h1/h2
  desceram para manter a mesma mancha.

### Licenciamento — pendente

A Selina é uma fonte comercial da TOKOPRESS. O arquivo tem `fsType = 0`
(*installable embedding*), mas **licença de webfont é contrato à parte**.
Confirmar com a Spasso se a licença adquirida cobre uso web antes de publicar.

## Logo

- Monograma **"SM"** geométrico isométrico, em dourado.
- Quatro lockups: horizontal, vertical, circular (selo) e símbolo isolado.
- Três aplicações por lockup: cor para fundos claros, cor para fundos escuros
  (`-light`) e positivo/negativo (`-mono`, em `currentColor`).
- Vetores definitivos em `src/assets/brand/` — ver o
  [README da pasta](../src/assets/brand/README.md).
- **Restrição (press kit, pág. 12):** a marca não aceita distorção de proporção
  nem troca de cor.

## Padrão

Dois padrões oficiais, ambos ladrilhados sem emenda em
`src/assets/brand/pattern-01.svg` e `-02.svg`. O 01 — o entrelaçado do próprio
monograma — é o que está no ar, aplicado como **máscara** de baixa opacidade
(`.pattern-veil`, 5,5 % no CTA e 4 % no rodapé), nunca como papel de parede.

## Ícones e compartilhamento

| Arquivo | Uso |
|---|---|
| `public/favicon.svg` | símbolo em ouro sobre quadrado navy, cantos 26/128 |
| `public/favicon.ico` | 16/32/48/64 |
| `public/apple-touch-icon.png` | 180 × 180, sem cantos (o iOS recorta) |
| `public/og.png` | 1200 × 630 — logo horizontal negativo, slogan em Selina e o padrão oficial ao fundo |

## Tom de voz

"Quiet luxury": consultivo, estratégico, didático, elegante, humano, inspirador. Slogan: **"Protegendo patrimônios. Construindo legados."**

## Tema visual escolhido — Tema 3: "Estrutura Arquitetônica"

Inspirado no conceito isométrico do monograma e na ideia de "estrutura".

Características:

- Grid vertical sutil de fundo
- Cards com cantos chanfrados (`clip-path`), ecoando o hexágono do monograma
- Numeração de seções estilo blueprint (ex.: "01 / Áreas")
- Labels uppercase com tracking largo
- Linhas duplas douradas como divisores/ornamentos
- Seções alternando fundo marfim e navy profundo
- **Redesign v2 (22/08/2026)** — ver [redesign-v2.md](./redesign-v2.md): navy dominante, serif display leve com itálico em gradiente dourado, cards de vidro, botão dourado com ícone circular. Texto dourado sempre em `--color-gold-light` `#D9C29A` ou `.em-gold` (≥ 4,5:1); `#866D4B` só em ícones/linhas. Logos e padrão oficiais vetoriais em `src/assets/brand/`
- **Redesign v3 — vigente (22/08/2026)** — ver [redesign-v3.md](./redesign-v3.md): a base da página desceu para `#01060F` (navy quase preto) e o Azul Legado `#041E42` passou a ser **elevação** (gradiente de card, halos, ícones). O padrão em favo saiu de todos os fundos de tela cheia. Entrou a seção "Alcance" com mapa-múndi pontilhado gerado (`src/assets/brand/world-dots.svg`, gerador em `scripts/gen-world-dots.mjs`).

Temas considerados e descartados: "Quiet Luxury Editorial" e "Institucional Profundo".

- **Marca definitiva (24/08/2026)** — entrada do Brand Kit: todos os lockups
  refeitos a partir do press kit, padrão oficial de volta (como véu de máscara,
  não como fundo), Selina no lugar da Cormorant, favicon/OG da marca.

## Pendências

| Pendência | Responsável |
|---|---|
| ~~SVGs finais do logo~~ — entregues no Brand Kit e já no repositório | ✔ 24/08/2026 |
| Licença **web** da Selina (o OTF permite embedding, mas webfont é contrato à parte) | Designer / Spasso |
| Licença da **Marlin** — hoje substituída por Montserrat | Designer / Spasso |
| Foto da Dra. Érika em resolução maior (a atual tem 853 × 1280) | Cliente |

## Superfícies (v3)

| Papel | Hex | Token |
|---|---|---|
| Fundo da página | `#01060F` | `--bg-page` / `--color-abyss` |
| Fundo alternado | `#020B18` | `--bg-alt` / `--color-ink-900` |
| Superfície elevada | `#041225` | `--bg-raised` / `--color-ink-800` |
| Azul Legado (elevação, halos, ícones) | `#041E42` | `--color-navy` |

O preto absoluto continua proibido — `#01060F` é navy, não preto.

## Fotografia (22/08/2026)

Enquanto não há fotos reais, o site usa **10 imagens geradas por IA** (mais a foto real da advogada) (Codex `image_gen`, arquivos em `src/assets/img/`), todas sem pessoas, sem texto e na paleta navy/marfim/ouro:

| Arquivo | Uso | Tamanho |
|---|---|---|
| `erika.jpg` | **Foto real** da Dra. Érika (recebida em 22/08/2026, 853×1280 — pedir o original em maior resolução quando possível). Home › "A Advogada" (4:5, `object-position: 50% 18%`) e página A Advogada (3:4). Regra: nunca gerar rosto sintético dela (ética/OAB) | 853×1280 |
| `edu-fig.png` | Home › Educação (figura 1:1 chanfrada) | 1024×1024 |
| `hero-*.png` (3) | `PageHero` de A Advogada, Educação e Contato | 1536×1024 |
| `v3/*.png` (4) | Redesign v3: `hero-bg` (hero da home), `metodo-bg`, `educacao` (home) e `educacao-fig` (`/educacao`) | 1024–1536 |
| `area-<slug>.png` (6) | `PageHero` de cada área (mapeado por slug em `areas/[slug].astro`) | 1536×1024 |

O `PageHero` aceita `image?: ImageMetadata`; o Astro gera WebP responsivo (720/1080/1536) no build. O véu navy (`.hero-img::after`) mantém o texto à esquerda legível.
