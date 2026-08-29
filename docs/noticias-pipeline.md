# Pipeline de Notícias Diárias por IA

## Arquitetura

As notícias **não vivem neste repositório**. Elas são mantidas por agente de IA no repositório
central multi-cliente [**agentic-news**](https://github.com/ThiagoAM/agentic-news), na pasta
`clients/advocacia-erika/`, e são publicadas via GitHub Pages daquele repo:

```text
https://thiagoam.github.io/agentic-news/clients/advocacia-erika/noticias.json
```

```text
agentic-news (repo central)                 site-advocacia-erika (este repo)
  clients/advocacia-erika/
    config.json        regras de busca  ──► agente de IA (~10:00 BRT)
    noticias.json      resultado do dia ──► GitHub Pages ──► fetch no build ──► HTML estático
    noticias-anteriores/  histórico
```

Por que assim: um único agente atende vários clientes com o mesmo fluxo e os mesmos scripts de
validação, e cada site consome apenas o JSON pronto. O site continua **100 % estático** — o fetch
acontece no build, não no navegador, o que preserva o SEO e não adiciona JavaScript ao cliente.

> Histórico: a decisão anterior era mono-repo (notícias em `data/` neste próprio repositório,
> padrão herdado de `noticias-cartorio-rio-das-ostras`). Foi substituída pela arquitetura acima
> quando o pipeline passou a atender mais de um cliente.

## Fluxo do agente (OpenClaw no Raspberry Pi, diário ~10:00)

Executado no repositório `agentic-news` — ver o `AGENTS.md` de lá. Em resumo, para cada cliente
pendente: busca conforme `clients/advocacia-erika/config.json` → `noticias-temp.json` →
`validate-news.js --temp` → `archive-news.js` (arquiva a versão anterior e promove a nova) →
commit/push na `main`. O push republica o GitHub Pages do `agentic-news` com o JSON novo.

O que o `config.json` do cliente define: prompt temático (direito imobiliário, REURB, notarial e
registral, sucessões e planejamento patrimonial, mercado imobiliário), fontes sugeridas (Conjur,
Migalhas, CNB), exclusões (violência, política partidária, temas sensacionalistas), idioma,
fuso e os limites de validação (11 a 17 itens, no máximo 30 dias de idade). O tom é estritamente
informativo, compatível com o Provimento 205/2021 da OAB.

## Contrato do JSON

```json
{
  "data-busca": "2026-08-29T14:00:00-03:00",
  "noticias": [
    {
      "titulo": "…",
      "descricao": "…",
      "data_publicacao": "…",
      "url": "https://…",
      "fonte": "…"
    }
  ]
}
```

| Regra | Valor |
|---|---|
| `data-busca` | ISO 8601 **com offset** de fuso |
| Quantidade de itens | Entre **11 e 17** |
| Campos obrigatórios por item | `titulo`, `descricao`, `data_publicacao`, `url`, `fonte` |
| `url` | Absoluta (`http`/`https`), apontando direto para a matéria original |
| Recência | `data_publicacao` no máximo **30 dias** antes de `data-busca` |

A validação é responsabilidade do `agentic-news` (`scripts/validate-news.js` + CI `validate.yml`).
Este repositório trata o feed como entrada externa e revalida o essencial antes de renderizar.

## Consumo no site

`src/data/noticias.ts` é a única porta de entrada:

- `getNoticias()` — faz um `fetch` da URL acima **em tempo de build**, com timeout de 10 s
  (`AbortSignal.timeout`). A promise é memoizada em variável de módulo, então a home
  (`src/components/home/HomeNoticias.astro`) e a página `/noticias` (`src/pages/noticias.astro`)
  compartilham **um único fetch por build**.
- Itens malformados (campo faltando ou vazio, data inválida, `url` que não seja `http(s)`) são
  descartados; o restante é ordenado por `data_publicacao` decrescente.
- `formatarDataNoticia(iso)` — formata em pt-BR curto (`29 ago 2026`), fuso `America/Sao_Paulo`.

Os links dos cards apontam para a matéria original, em nova aba
(`target="_blank" rel="noopener noreferrer"`).

### Fallback quando o feed está indisponível

`getNoticias()` **nunca lança**: em qualquer falha (rede, timeout, HTTP diferente de 200, JSON
inválido, formato inesperado, nenhum item válido) ela loga um `console.warn` no build e devolve
`{ dataBusca: null, noticias: [] }`. Com isso:

- **o build nunca quebra** por causa do feed;
- `/noticias` mostra um cartão "A curadoria de hoje está em atualização. Volte em instantes.";
- a home mantém a seção de notícias com o cabeçalho, uma linha discreta no lugar do grid e o link
  "Ver todas as notícias";
- o deploy anterior continua no ar até o próximo build bem-sucedido.

Esse é o comportamento esperado enquanto o Pages do `agentic-news` ainda não estiver publicado (a
URL responde 404) — o site sobe normalmente, sem notícias.

## Rebuild do site

O JSON é lido no build, então uma atualização das notícias só aparece no ar depois de um novo
build. `.github/workflows/deploy.yml` é disparado por:

| Gatilho | Quando |
|---|---|
| `push` na `main` | Qualquer alteração no próprio site |
| `workflow_dispatch` | Rebuild manual pela aba Actions |
| `schedule` (`0 14 * * *`) | Diário, 11:00 America/Sao_Paulo — depois da atualização das notícias (~10:00) |
| `repository_dispatch` (`news-updated`) | Disparado pelo `agentic-news` quando o `noticias.json` do cliente muda |

O `repository_dispatch` vem do workflow `notify-consumers.yml` do `agentic-news` e depende do
secret `CONSUMER_DISPATCH_TOKEN` configurado **naquele** repositório (fine-grained PAT com
permissão de Contents neste repo). Sem o secret, o passo é pulado lá e o site se atualiza pelo
cron diário — o rebuild agendado é a rede de segurança, o dispatch é só o caminho rápido.

Observação sobre o `schedule` do GitHub Actions: o horário é em UTC e pode atrasar alguns minutos
em janelas de pico; o cron das 14:00 UTC dá folga suficiente sobre a coleta das ~10:00 BRT.
