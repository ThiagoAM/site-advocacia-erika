# Plano de Desenvolvimento

## Visão geral

Site institucional estático para a Saquetti Martins Advocacia, com foco em SEO, conformidade com a publicidade da OAB (Provimento 205/2021) e seção de notícias jurídicas atualizada diariamente por agente de IA.

## Stack

| Camada | Escolha |
|---|---|
| Framework | Astro v7 (7.2.4 instalado; requer Node ≥ 22.12) |
| CSS | Tailwind CSS v4 |
| Saída | 100% estática (SSG) |
| Hospedagem | GitHub Pages |
| CI/CD | GitHub Actions (`withastro/action`) |
| Domínio customizado | `public/CNAME` |
| DNS | Cloudflare |
| Fontes web | Google Fonts (Inter) — ver [identidade-visual.md](./identidade-visual.md) |
| Notícias | Agente OpenClaw diário — ver [noticias-pipeline.md](./noticias-pipeline.md) |

## Fases

Status em **22/08/2026**.

| Fase | Escopo | Status |
|---|---|---|
| **0 — Fundação** | Registro dos domínios; scaffold Astro + Tailwind; CI de deploy (GitHub Actions → Pages); obter SVGs do logo e licenças das fontes com a designer | Scaffold e CI prontos; faltam domínios e assets da designer |
| **1 — Design system** | Tokens de design (cores, tipografia, espaçamento); componentes base; implementação do Tema 3 "Estrutura Arquitetônica" | **Concluída** (19/08/2026) |
| **2 — Páginas institucionais** | Home; A Advogada; **1 página por área de atuação** (importante para SEO); Educação & Treinamentos; Contato com formulário (Web3Forms) | **Concluída** (22/08/2026) — formulário de contato com Web3Forms; pendência operacional: cadastrar o secret `PUBLIC_WEB3FORMS_KEY` |
| **3 — Notícias diárias** | Pipeline de notícias por IA no mesmo repositório (`data/` + `scripts/`); renderização estática no build | Pendente |
| **4 — Qualidade e conformidade** | SEO técnico; Open Graph; sitemap; schema.org `LegalService`/`Attorney`; LGPD / política de privacidade; acessibilidade; Lighthouse ≥ 95; rodapé com aviso de conformidade com o Provimento 205/2021 da OAB e número de inscrição | Pendente |
| **5 — Lançamento** | Google Search Console; Google Business Profile (a cliente ainda não tem); Analytics (Plausible ou GA4); revisão final | Pendente |

## Detalhes por fase

### Fase 0 — Fundação
- Registrar domínios conforme [dominios.md](./dominios.md).
- Scaffold Astro v7 + Tailwind v4 com saída estática (build local exige Node ≥ 22.12 — use `fnm use 22`).
- Workflow de deploy: `withastro/action` publicando no GitHub Pages.
- `public/CNAME` com o domínio principal.
- Pendência externa: SVGs finais do logo e licenças de fonte (designer / agência Spasso).

### Fase 1 — Design system
- Tokens: paleta Azul Legado / Ouro Patrimônio / Marfim; tipografia Inter.
- Componentes do Tema 3: cards com cantos chanfrados (clip-path), numeração blueprint de seções, labels uppercase com tracking largo, linhas duplas douradas, grid vertical de fundo, seções alternando marfim e navy.

### Fase 2 — Páginas
- Uma página dedicada por área de atuação (SEO on-page: título, meta description, headings, conteúdo próprio).
- Formulário de contato sem backend próprio via **Web3Forms** (`src/components/ContactForm.astro`) — envio por `fetch` com fallback de POST nativo, honeypot anti-spam, consentimento LGPD. Renderiza apenas se `PUBLIC_WEB3FORMS_KEY` existir no build. Ver [formulario-contato.md](./formulario-contato.md).
- CTAs de WhatsApp ([wa.me/5541997248234](https://wa.me/5541997248234)).

### Fase 3 — Notícias
- Ver [noticias-pipeline.md](./noticias-pipeline.md). O commit diário do agente dispara rebuild do Pages, então as notícias são HTML estático (melhor SEO). Benefício extra: marketing de conteúdo.

### Fase 4 — Qualidade
- Todo o conteúdo em tom informativo (Provimento 205/2021: sem promessa de resultado, sem mercantilização).

### Fase 5 — Lançamento
- Criar Google Business Profile (inexistente hoje) e verificar propriedade no Search Console.
