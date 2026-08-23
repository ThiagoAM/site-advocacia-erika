# Identidade Visual

Fonte: proposta de identidade da agência **Spasso** (ago/2026).

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
| Marca (fontes comerciais) | **Selina** (serif display de alto contraste) | **Marlin** (sans geométrica) |
| Site (substitutas enquanto não há licença web) | **Cormorant Garamond** 300/400 + itálico (redesign v2, 22/08/2026) | **Montserrat** 400/500/600 |

As substitutas do site são servidas via Google Fonts.

## Logo

- Monograma **"SM"** geométrico isométrico, em dourado.
- Versões: horizontal, vertical, circular, símbolo isolado e negativa.

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

Temas considerados e descartados: "Quiet Luxury Editorial" e "Institucional Profundo".

## Pendências

| Pendência | Responsável |
|---|---|
| SVGs finais do logo (todas as versões) | Designer / Spasso |
| Licenças web das fontes Selina e Marlin | Designer / Spasso |

## Fotografia (22/08/2026)

Enquanto não há fotos reais, o site usa **10 imagens geradas por IA** (mais a foto real da advogada) (Codex `image_gen`, arquivos em `src/assets/img/`), todas sem pessoas, sem texto e na paleta navy/marfim/ouro:

| Arquivo | Uso | Tamanho |
|---|---|---|
| `erika.jpg` | **Foto real** da Dra. Érika (recebida em 22/08/2026, 853×1280 — pedir o original em maior resolução quando possível). Home › "A Advogada" (4:5, `object-position: 50% 18%`) e página A Advogada (3:4). Regra: nunca gerar rosto sintético dela (ética/OAB) | 853×1280 |
| `edu-fig.png` | Home › Educação (figura 1:1 chanfrada) | 1024×1024 |
| `hero-*.png` (3) | `PageHero` de A Advogada, Educação e Contato | 1536×1024 |
| `area-<slug>.png` (6) | `PageHero` de cada área (mapeado por slug em `areas/[slug].astro`) | 1536×1024 |

O `PageHero` aceita `image?: ImageMetadata`; o Astro gera WebP responsivo (720/1080/1536) no build. O véu navy (`.hero-img::after`) mantém o texto à esquerda legível.
