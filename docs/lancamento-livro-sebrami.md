# Lançamento do livro no SEBRAMI 2026

**Pedido:** 21/10/2026, mensagens da Dra. Érika encaminhadas pelo Thiago em 22/10/2026 · **Estado:** implementado na
branch local `feature/lancamento-livro-sebrami`, **não publicado** — aguarda revisão do Thiago antes do merge na `main`
(qualquer push na `main` publica o site).

A Dra. Érika é coautora da coletânea **Direito Imobiliário — Coletânea Imobiliária 2026** (Editora Meta), com o
capítulo *"Reflexos dos regimes de bens nos negócios imobiliários: repercussões notariais e registrais na circulação da
propriedade"*. O lançamento é no **SEBRAMI 2026 — Seminário Brasileiro do Mercado Imobiliário**, e ela pediu a
divulgação no site com o cupom de desconto **SAQUETTI** para a inscrição.

## O que entrou

| Peça | Onde | Comportamento |
|---|---|---|
| Aviso de abertura | `src/components/LancamentoAviso.astro`, incluído no `BaseLayout` | `<dialog>` nativo: capa, data, local, cupom com "Copiar", "Garantir minha vaga" e "Adicionar à agenda". Abre ~0,8 s após carregar, **uma vez por sessão** do navegador (`sessionStorage`), em qualquer página menos `/livro`. Fecha por X, Esc ou clique fora. |
| Seção da home | `src/components/home/HomeLivro.astro`, logo após as credenciais | Card com capa, capítulo, data/local, cupom, "Conhecer o livro" e agenda. |
| Página dedicada | `src/pages/livro.astro` → `/livro` | Hero, o capítulo (com citação da Dra. Érika), o lançamento (data, local, mapa, cupom, inscrição, agenda) e a arte oficial de divulgação. Link "Livro" no rodapé; o menu do topo não mudou. |
| Agenda | `src/pages/sebrami-2026.ics.ts` → `/sebrami-2026.ics`; `googleAgendaUrl()` | Google Agenda por link de modelo (os dois dias como recorrência diária); Apple/Outlook pelo `.ics`, com um evento por dia e lembrete na véspera do primeiro. |
| Dados | `src/data/lancamento.ts` | Fonte única de textos, datas, local, cupom e links. |

Dados do evento conferidos em [sebrami.com](https://sebrami.com) em 22/10/2026: 11/11 (quarta) das 8h20 às 19h30 e
12/11 (quinta) das 8h30 às 19h30, no **Teatro APCD — R. Voluntários da Pátria, 547, Santana, São Paulo/SP, 02011-000**.
O site do evento não cita o lançamento nem o cupom; ambos vêm da Dra. Érika. Título, coleção e editora foram lidos da
capa na arte de divulgação.

## Depois do evento

`eventoEncerrado()` compara a data com o fim do segundo dia (12/11, 19h30). Como o site é reconstruído todo dia às 11h
(`deploy.yml`), a partir de 13/11:

- o aviso de abertura deixa de existir (e, mesmo antes do rebuild, o script não abre depois do horário, via `data-fim`);
- a seção da home e a página `/livro` trocam o tempo verbal ("lançada") e removem cupom, inscrição e agenda — o livro
  continua no site.

Para retirar tudo de vez: apagar o `<HomeLivro />` da home, o `<LancamentoAviso />` do layout e o link do rodapé.

## Imagens

| Arquivo | Origem |
|---|---|
| `src/assets/img/livro/livro-produto.png` (1024 × 1536) | Codex CLI, `gpt-6.1-sol` esforço low, a partir de um recorte da capa na arte de divulgação. Textos da capa conferidos letra a letra. |
| `src/assets/img/livro/teatro-ambiente.png` (1536 × 1024) | Codex CLI, `gpt-6.1-sol` low: plateia vazia com palco em luz dourada, sem pessoas ou texto — hero de `/livro`. |
| `src/assets/img/livro/sebrami-divulgacao.jpg` (1127 × 1396) | Arte oficial "Eu vou lançar um livro no SEBRAMI!", enviada pela Dra. Érika. |

A capa real é laranja — cor vedada na paleta da marca, mas mantida por ser o produto. A arte do SEBRAMI aparece só na
página `/livro`, como material oficial do evento.

## Conformidade

Conteúdo informativo sobre publicação e evento da advogada (Provimento 205/2021). O cupom é da inscrição de um evento
de terceiros, não de serviço jurídico; a página diz que inscrições, valores e condições são da organização do evento.

## Pendências

- Revisão do Thiago e merge na `main` (publica).
- Confirmar com a Dra. Érika o título exato da coletânea e se haverá horário específico de lançamento/autógrafos.
