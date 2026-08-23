# Redesign v4 — retrato integrado ao fundo

**Data:** 23/08/2026 · Continuação da [v3](./redesign-v3.md).

Quatro pedidos do cliente, todos tomando como referência
[kbmarketingjuridico.com.br](https://kbmarketingjuridico.com.br):

1. o retrato do topo deveria **se integrar ao fundo**, como o da referência;
2. tirar a marca-d'água "LEGADO" da seção "Para quem";
3. no topo, remover o botão "Conheça as áreas" e **aumentar** o do WhatsApp;
4. tirar o efeito de escurecimento da foto na seção "Quem conduz".

## 1. O hero

Na referência a pessoa **não fica em card**: ela é recortada e nasce do fundo escuro,
sem moldura, sangrando na aresta inferior da seção. A v3 usava a foto num card 4:5
com borda e legenda — o oposto disso.

### 1.1 O retrato

A foto real da Dra. Érika é *high-key* (fundo de cortina branca, luz frontal difusa):
sobre a base quase preta do site ela salta em vez de fundir. Foi feito primeiro um
recorte da foto real (subject lifting do Vision + descontaminação de borda +
re-iluminação), mas **o retrato em produção é gerado por IA**, com a foto real como
referência de semelhança — uso autorizado pela própria Dra. Érika.

| Etapa | Ferramenta |
|---|---|
| Geração | Codex CLI, modelo `gpt-5.6-luna`, com `src/assets/img/erika.jpg` como referência de semelhança |
| Recorte | `VNGenerateForegroundInstanceMaskRequest` (Vision, macOS) → PNG com alfa |
| Descontaminação de borda | *unmix* `F = (C − B(1−α)) / α`, com `B` estimado por borrão do fundo mascarado |
| Escala | Lanczos 1,4× + *unsharp mask* → **1308 × 1645** |
| Queda na base | degradê multiplicativo, para ela morrer no fundo da página |

A imagem do Codex já nasce *low-key*, em fundo navy e com luz de recorte dourada —
por isso ela dispensa a re-iluminação pesada que a foto real exigiu.

O prompt proíbe explicitamente as cores vedadas pela marca (neon, roxo, laranja,
vermelho, amarelo, rosa, verde, ciano), texto, logotipo e moldura.

### 1.2 O fundo

`img/v3/hero-backdrop.png` — **3200 × 1355 (2,36:1)**, gerado no Codex e rebaixado num
passo de Core Image (compressão das altas luzes, ×0,52, escuros puxados para `#01060F`,
croma reduzido).

O primeiro backdrop era 16:9 e vinha com vinheta: o feixe dourado picava aos 60 % da
largura e a luminância média caía para **10,3** na última faixa de 10 %, contra 43,7 no
pico. Em tela larga isso lê como uma **margem preta à direita**, e não como profundidade.

Não era problema de CSS — o `<img>` mede exatamente `[0, 0, 1920, 940]`. E não dava para
resolver deslocando o enquadramento: com uma fonte 16:9 num hero de ~2:1, o `object-fit:
cover` limita pela largura e **a borda direita da fonte passa a ser a borda da página**.
Tentou-se ainda corrigir na imagem, com uma poça de luz sintética à direita; melhorou os
números, mas continuava lendo como faixa apagada.

A solução foi gerar o fundo **para o formato certo**: ultrawide e com o briefing
explícito de que as faixas 6 a 10 (de dez faixas verticais) tivessem brilho parecido
entre si, com o ponto mais claro por volta de 70–80 % da largura — nunca no centro, nunca
com queda na borda. Luminância média por faixa de 10 %:

| | 0 % | 20 % | 40 % | 50 % | 60 % | 70 % | 80 % | 90 % |
|---|---|---|---|---|---|---|---|---|
| Fundo antigo (16:9) | 7,4 | 7,4 | 9,2 | 20,2 | **43,7** | 28,4 | 17,6 | **10,3** |
| Fundo novo (2,36:1) | 4,8 | 6,0 | 8,5 | 18,8 | 36,0 | 38,7 | **39,0** | **36,2** |

A metade esquerda ficou ainda mais escura (bom para o texto) e a direita virou um platô,
sem queda na borda.

Como agora a fonte é mais larga que o hero, existe folga horizontal e o enquadramento
volta a importar: `object-position: 100% center` no desktop mantém a borda direita da
fonte — a mais iluminada — colada na borda da tela. No empilhado ele vai para `58% 26%`,
que pega a zona de transição em vez da arquitetura cheia atrás dela.

Contraste do texto do hero contra o **pixel mais claro do fundo** sob cada bloco, medido
de 900 a 1920 px: título 14,2–17,8:1, parágrafo 14,1–18,0:1, credenciais 17,1–20,3:1.

### 1.3 A geometria — o contrato `--fig-ar`

O detalhe que sustenta o leiaute: **a caixa da figura tem a proporção exata do PNG**.

```css
.hero {
  --fig-ar: 1308 / 1645;  /* proporção do PNG do retrato */
  --fig-arw: 0.7951;      /* a mesma, como fator numérico */
}
```

Como a caixa *é* a pessoa, as tags flutuantes podem ser posicionadas em porcentagem e
continuam no mesmo ponto do corpo dela em qualquer largura. **Trocando o retrato,
essas duas variáveis têm de ser atualizadas** — senão a caixa deixa de coincidir com a
silhueta e as tags saem do lugar.

**Escala da figura.** Na referência a pessoa ocupa ~22 % da largura da tela e sobra
fundo à direita dela — ela não encosta na borda. Sem teto, a figura acompanhava a coluna
e chegava a 607 px de largura em 1440 px, com a cabeça quase o dobro da referência.
`--fig-max: clamp(320px, 33vw, 470px)` + `justify-self: center` põem a escala na faixa da
referência e devolvem fundo visível à direita dela.

Ancorar a figura pelo topo (para a cabeça subir) foi testado e descartado: o véu de
dissolução passa a terminar no meio do hero e desenha um retângulo escuro visível.

Outras decisões:

- `align-self: end` + `margin-bottom: calc(-1 * var(--hero-pb))` estica a célula até a
  aresta inferior da seção: é ali que a figura sangra e que o véu de dissolução encosta.
- `justify-self: start` + `width: calc(100% + var(--fig-bleed))` joga o excedente para a
  direita, na direção da borda da tela. **Margem negativa não serve aqui**: num item de
  grade com `width: 100%` ela não alarga nada.
- No empilhado, a altura da foto é amarrada a **~54svh** (`max-width: calc(54svh *
  var(--fig-arw))`), a mesma proporção da referência. Sem esse teto, em 768 px de
  largura a figura passava de **890 px de altura** e empurrava o texto do hero para fora
  da tela.
- O véu de dissolução do empilhado usa `inset: auto -50vw 0 -50vw`. Limitado à largura
  da figura, ele pintava o fundo sólido num painel mais estreito que a seção e a emenda
  vertical aparecia nas laterais.

## 2. Botão principal

`Button.astro` ganhou a prop `size` (`md` | `lg`). No hero, "Conheça as áreas" saiu e o
do WhatsApp virou `size="lg"`:

| | v3 | v4 | referência (KB) |
|---|---|---|---|
| Rótulo | 15 px | **20 px** | 20 px |
| Altura | 56 px | **89 px** | 88 px |
| Largura (1440) | 246 px | **414 px** | 547 px |
| Ícone | 40 px | **54 px** | — |
| Raio | 13 px | 15 px | 13 px |

Uma armadilha aqui: `min-width: min(100%, 24rem)` **não funciona**. `.hero-copy` tem
`align-items: flex-start`, então o wrapper encolhe até o conteúdo e o `100%` passa a ser
a largura do próprio botão — o `min-width` se anula. A regra usa `min-width: 25rem` com
`max-width: 100%`.

## 3. Marca-d'água removida

A palavra-fantasma "Legado" ao fundo da seção "Para quem" saiu. Como era o único uso,
foram removidos também o componente `ui/Watermark.astro` e o bloco `.watermark` do
`global.css`.

## 4. Retratos sem escurecimento

`.photo-grade` (filtro) e `.photo-tint` (camada por cima) existiam para fazer a ponte
entre a foto clara e a base escura. Saíram da seção "Quem conduz" e, pela mesma razão —
é a mesma foto, com o mesmo efeito —, também de `/a-advogada`. Nesses dois pontos a foto
é retrato institucional dentro de um card; quem precisa fundir com o fundo é o recorte do
hero, e esse tratamento agora está na própria imagem. O bloco CSS ficou sem uso e foi
removido.

## 5. QA

No build estático (`dist`), Chromium headless:

- **80 combinações** (8 rotas × 320 / 360 / 390 / 430 / 600 / 768 / 900 / 1024 / 1280 /
  1440 px): sem scroll horizontal, sem erro de console, todas HTTP 200.
- **Contraste do hero** medido contra o pixel mais claro do fundo sob cada bloco de texto
  (com o texto ocultado, de 900 a 1920 px): pior caso **14,1:1**.
- Sem colisão entre as tags flutuantes e o texto do hero em nenhuma largura.
- `prefers-reduced-motion: reduce`: nenhuma animação ativa, nenhum bloco `[data-reveal]`
  preso invisível.
- 1920 px: a figura sangra 77 px além do container, sem estouro.
- Alvos de toque abaixo de 24 px: só links *inline* dentro de parágrafos (e-mail,
  "Política de Privacidade" no rodapé) — pré-existentes e cobertos pela exceção da
  WCAG 2.5.8 para links em meio a texto.

## 6. Ativos

| Arquivo | Origem |
|---|---|
| `img/v3/erika-retrato-ia.png` | Codex `gpt-5.6-luna` + recorte/preparo em Core Image |
| `img/v3/hero-backdrop.png` | Codex `gpt-5.6-luna`, 3200 × 1355 + rebaixamento em Core Image |

Os utilitários Swift de recorte, descontaminação e preparo foram de uso pontual e não
estão versionados; o processo está descrito acima e é reprodutível.

## 7. Itália, o quinto país

Acrescentada em 23/08/2026 a Brasil, EUA, Canadá e Portugal — no mapa da seção "Alcance" e em
todos os textos (hero, faixa de credenciais, CTA, FAQ, `/a-advogada`, `/contato` e os metadados
das páginas).

As coordenadas saem da **mesma projeção equiretangular** do mapa (ver
[redesign-v3.md](./redesign-v3.md)), que para o enquadramento em uso se reduz a:

```
x % = 50 + 0,285714 · (lon − 5)
y % = (49,6 − 0,6 · lat) / 83 · 100
```

Conferida contra os quatro marcadores existentes, reproduz os quatro exatamente. Roma
(lon 12,5 / lat 41,9) → **52,14 % / 29,47 %**, sobre a massa de terra pontilhada.
`italia: [12.5, 41.9]` entrou em `scripts/gen-world-dots.mjs`, que segue sendo a fonte de
verdade das coordenadas.

**O que a Itália quebrou.** Ela fica a 5,9 % de Portugal na horizontal e 1,7 % na vertical. O
rótulo de Portugal saía à direita e passava por cima do marcador dela, então Portugal virou
`side: 'left'` — e isso o pôs de frente para o do Canadá, que sai à direita e está a apenas
12 % da altura do mapa acima dele. Com rótulos de ~28 px, isso só cabe em mapas largos:

| Largura | Sobreposição Canadá × Portugal |
|---|---|
| 320 px | 50 × 6 px |
| 720 px | 27 × 1 px |
| 1150 px ou mais | nenhuma (folga acima de 20 px) |

Correções, ambas medidas e não estimadas:

- `.pin-canada` sobe para cima do próprio ponto abaixo de **1100 px**; acima disso a folga passa
  de 20 px e ele fica na horizontal. O espaço acima do marcador do Canadá é oceano.
- `.pin-italia` sobe para cima do próprio ponto abaixo de **700 px**, onde o mapa é ampliado e o
  rótulo à direita estouraria a borda.

Verificado com um teste dedicado que mede, em **37 larguras** de 320 a 2560 px, sobreposição
entre rótulos, rótulo cobrindo o marcador de outro país e rótulo fora da caixa do mapa — todas
limpas.
