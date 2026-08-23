# Redesign v2 — "Autoridade em Navy"

**Data:** 22/08/2026 · **Motivo:** a cliente não aprovou o Tema 3 ("Estrutura Arquitetônica", marfim dominante) e pediu algo no estilo de [kbmarketingjuridico.com.br](https://kbmarketingjuridico.com.br), com as cores do briefing.

Briefing completo da referência: `scratchpad/briefing-kb.md` (levantamento de 22/08/2026). Resumo do que a referência faz bem e que vamos trazer:

1. Fundo escuro dominante com **uma só cor de acento** (dourado), usada com disciplina.
2. **Serif display leve (peso 300) com trecho em itálico dourado** em todos os títulos.
3. Cards "de vidro": gradiente escuro + borda 1 px clara a ~22 %, **sem sombra**; raios 12/16/28.
4. Cabeça de seção padronizada: **pill (eyebrow) → título centrado → linha dourada degradê**.
5. Botão dourado em gradiente com ícone circular; pulso sutil.
6. Fotos com halo dourado desfocado ao fundo; marca-d'água em serif outline gigante.
7. Entrada dos elementos com **fade + blur** ao rolar; marquee; FAQ em accordion.

## Tradução para a marca Saquetti Martins

| Referência (KB) | Saquetti Martins |
|---|---|
| Pretos `#050505 / #0d0d0d` | **Navy** `#041E42` (base), `#02132B` (deep), `#0A2B57` (soft) |
| Gradiente dourado `#bf8e45→#dfc68d→#fddb8e` | `#866D4B → #B8996B → #D9C29A` (Ouro Patrimônio como ponto escuro) |
| Texto `#f5f5f5` | **Marfim** `#FBFBF8`; secundário `rgba(251,251,248,.78)` |
| Borda de card `rgba(255,255,255,.22)` | `rgba(251,251,248,.16)` (navy é mais claro que preto; 22 % ficaria áspero) |
| ivypresto-display 300 | **Cormorant Garamond** 300/400/500 + itálico (Google Fonts) — substituta da Selina até a licença |
| Montserrat | **Montserrat** 400/500/600 (geométrica como a Marlin da marca) |
| Sem header | **Header fixo translúcido** (navy 70 % + blur) com o logo horizontal oficial |
| 15 CTAs para WhatsApp | 1 CTA a cada 2–3 seções; tom consultivo (Provimento 205/2021 — sem promessa de resultado, sem "faturar", sem números de clientes) |
| Mockups de Instagram | Foto real da Dra. Érika + fotos-ambiente já geradas + monograma/padrão da marca |
| Vermelho/verde nas listas | Apenas ouro e marfim (cores proibidas no briefing: vermelho, laranja, amarelo, roxo, rosa, neon, preto absoluto) |

Cores proibidas continuam proibidas. O preto absoluto não entra: o "escuro" é sempre navy.

## Ativos oficiais (extraídos da Proposta Spasso, vetoriais)

`src/assets/brand/`: `logo-horizontal.svg`, `logo-vertical.svg`, `logo-circular.svg`, `simbolo.svg`, `*-mono.svg` (currentColor). Padrão geométrico da marca: página 18 da Proposta (vetorial, a extrair na Fase 2 como `pattern.svg` para uso a 6–8 % de opacidade).

## Tokens v2 (`src/styles/global.css`)

```
--color-navy: #041E42   --color-navy-deep: #02132B   --color-navy-soft: #0A2B57
--color-gold: #866D4B   --color-gold-mid: #B8996B    --color-gold-light: #D9C29A
--color-ivory: #FBFBF8  --ink-soft: rgba(251,251,248,.78)  --ink-faint: rgba(251,251,248,.55)
--gold-gradient: linear-gradient(90deg,#866D4B 0%,#B8996B 50%,#D9C29A 100%)
--card-gradient: linear-gradient(180deg,rgba(2,19,43,.9) 0%,rgba(10,43,87,.55) 100%)
--card-border: 1px solid rgba(251,251,248,.16)
--radius-sm: 12px  --radius-md: 16px  --radius-lg: 28px  --radius-pill: 999px
--font-display: "Cormorant Garamond", Georgia, serif
--font-sans: "Montserrat", -apple-system, sans-serif
--container: 1200px · padding lateral 40px desktop / 16px mobile
--section-pad: clamp(5rem, 9vw, 8rem)
```

Tipografia: H1 display 300, `clamp(2.6rem, 5.2vw, 4.2rem)`, line-height 1.15; H2 `clamp(2.1rem, 3.8vw, 3.1rem)`; corpo 17–18 px / 1.7; eyebrow 13 px uppercase tracking .18em; botão 15 px 600.

Contraste mínimo 4,5:1 para texto: ouro-light `#D9C29A` sobre navy = 9:1 ✔; ouro `#866D4B` sobre navy = 3,4:1 ✖ (só em ícones/linhas, nunca em texto pequeno); marfim 78 % sobre navy ✔.

## Componentes (`src/components/ui/`)

| Componente | Descrição |
|---|---|
| `Eyebrow.astro` | pill com bolinha dourada + texto uppercase |
| `Display.astro` / util `.em-gold` | título serif com `<em>` em itálico + gradiente dourado (`background-clip: text`) |
| `GoldRule.astro` | linha 1 px degradê transparente→ouro→transparente |
| `Button.astro` | `variant: gold | ghost`; gradiente + ícone circular marfim com seta; pulso (`prefers-reduced-motion` respeitado) |
| `GlassCard.astro` | gradiente navy + borda 16 %, `radius: sm|md|lg` |
| `IconSquare.astro` | 48 px navy com ícone ouro, ou 72 px ouro com ícone navy |
| `SectionHead.astro` | eyebrow + h2 + lead + GoldRule, centrado ou à esquerda |
| `Reveal.astro` | wrapper com `data-reveal` (fade + blur 8px + 24px de deslocamento; IntersectionObserver, 1 s) |
| `Marquee.astro` | faixa dupla, uma a −3°, texto repetido, 60 s |
| `Accordion.astro` | `<details>` estilizado (FAQ) |
| `Stat.astro` | número/valor em display dourado + rótulo |
| `Watermark.astro` | palavra gigante em serif outline ao fundo da seção |

Header: fixo, navy 70 % + `backdrop-filter: blur(14px)`, logo horizontal mono em marfim (altura 40 px), links Montserrat 13 px uppercase, CTA `Button ghost` "Falar no WhatsApp"; menu mobile em painel navy. Footer: 3 colunas com eyebrows como títulos ("Contatos", "Navegação", "Redes"), logo vertical mono, OAB/PR 52.743 + aviso Provimento 205/2021, política de privacidade.

## Home v2 (ordem das seções)

1. **Hero** — 2 colunas. Esq.: eyebrow "Advocacia consultiva · Imobiliário & Patrimonial", H1 "Protegendo patrimônios. *Construindo legados.*", parágrafo, `Button gold` WhatsApp + `Button ghost` "Conheça as áreas". Dir.: foto da Érika (`erika.jpg`) em card `radius-lg` com degradê navy na base e 3 chips flutuantes ("Doutora em Direito", "Advogada desde 2009 · OAB/PR", "Brasil · EUA · Canadá · Portugal"). Fundo: `hero-bg.png` (halo dourado + linhas arquitetônicas tênues) + padrão da marca a 6 %. Marca-d'água "Legado".
2. **Faixa de credenciais** — 4 `Stat` em GlassCards: "2009" desde · "Doutora" em Direito (REURB) · "4 países" · "OAB/PR 52.743".
3. **Áreas de atuação** — SectionHead centrado ("Cada patrimônio exige *uma estrutura própria*.") + grid 3×2 de GlassCards com IconSquare ouro, título, descrição, link "Saiba mais →" (usa `areas.ts`).
4. **Como trabalhamos** — eyebrow "Método" + 4 etapas (Diagnóstico → Estratégia → Execução → Acompanhamento) em cards numerados com número em display dourado; coluna esquerda sticky no desktop (padrão da referência).
5. **A Advogada** — 2 colunas: card com canto chanfrado (eyebrow "Quem conduz", nome em *itálico dourado*, bio, lista de credenciais, botão) + foto em card `radius-md`; selo circular mono girando lentamente no canto.
6. **Para quem** — 2 GlassCards `radius-lg`: "Para famílias e pessoas" / "Para empresas e profissionais do mercado imobiliário", listas com ✓ em ouro (sem ✗ vermelho).
7. **Educação & Treinamentos** — card-container com imagem `hero-educacao` à direita, texto + botão.
8. **Notícias** — SectionHead + 3 cards (placeholders atuais).
9. **Marquee** — "SAQUETTI MARTINS ADVOCACIA ◆ PROTEGENDO PATRIMÔNIOS ◆ CONSTRUINDO LEGADOS ◆".
10. **FAQ** — 6 perguntas em Accordion (tom informativo: o que é REURB, quando fazer holding, diferença inventário judicial/extrajudicial, atendimento a residentes no exterior, como é a primeira consulta, documentos para due diligence).
11. **CTA final + canais** — H2 "Vamos desenhar *a estrutura do seu legado*?", botão WhatsApp, 3 canais (e-mail, Instagram, formulário) em GlassCards.

Imagens novas (Codex `image_gen`, sem pessoas/texto): `hero-bg.png` 1536×1024 (navy studio backdrop, halo dourado canto superior direito, linhas isométricas tênues), `glow-gold.png` 1024×1024 (halo radial isolado sobre navy para reutilizar em seções), `metodo-bg.png` 1536×1024 (maquete arquitetônica em navy com luz dourada, bem escura para ficar atrás de cards). As 10 fotos-ambiente atuais continuam nos heros internos e nos cards de área.

## Páginas internas

Mantêm conteúdo e rotas; trocam a pele: `PageHero` escuro com foto + halo, título com itálico dourado, eyebrow como breadcrumb; corpo em navy com GlassCards; `PageCta` idêntico ao CTA final da home. Formulário de contato sobre card marfim (único bloco claro do site, para legibilidade dos campos).

## Execução (subagentes; revisão do orquestrador a cada onda)

| Onda | Agente | Entrega |
|---|---|---|
| 1A | Design system | tokens, fontes, `ui/*`, Header, Footer, BaseLayout, `Reveal` script |
| 1B (paralelo) | Imagens (Codex) | 3 imagens acima + `pattern.svg` extraído da Proposta p.18 |
| 2A | Home | `index.astro` + seções v2 |
| 2B (paralelo) | Páginas internas | PageHero/PageCta v2, áreas, a-advogada, educação, contato, notícias, privacidade |
| 3 | QA | mobile 320/375/390, contraste, a11y, Lighthouse, sem scroll lateral; commit + deploy |

Critérios de aceite: build limpo; nenhum texto < 4,5:1; `prefers-reduced-motion` desliga pulso, marquee e blur; Lighthouse ≥ 90 em performance mobile (fontes com `display=swap`, imagens WebP via `astro:assets`); nenhuma cor proibida; nenhuma promessa de resultado.
