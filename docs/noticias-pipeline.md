# Pipeline de Notícias Diárias por IA

## Decisão de arquitetura

**Mono-repo**: as notícias vivem no **mesmo repositório do site**, em `data/` (JSONs) + `scripts/` (validação/arquivamento). Padrão replicado do repo `noticias-cartorio-rio-das-ostras`.

Vantagens:
- O commit diário do agente dispara o rebuild do GitHub Pages → notícias renderizadas **estaticamente no build** (melhor SEO, zero JS no cliente).
- Benefício extra: marketing de conteúdo com atualização diária.

## Fluxo do agente (OpenClaw, execução diária)

1. `git pull`
2. `node scripts/get-current-date.js` — obtém a data corrente
3. Busca notícias com o prompt temático fixo (abaixo)
4. Escreve `noticias-temp.json`
5. `node scripts/validate-news.js` — valida o temp contra o contrato
6. `node scripts/archive-news.js` — arquiva o JSON anterior em `noticias-anteriores/` e promove o temp a atual
7. Commit na `main` com mensagem padronizada `chore(noticias): ...`
8. O push dispara o workflow do GitHub Pages → site rebuilda com as notícias novas

## Contrato do JSON

```json
{
  "data-busca": "2026-08-19T07:00:00-03:00",
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
| Recência | `data_publicacao` no máximo **30 dias** antes de `data-busca` |

`scripts/validate-news.js` rejeita o arquivo que violar qualquer regra (o agente deve refazer a busca em vez de commitar).

## Prompt temático sugerido (completo)

> Busque notícias jurídicas recentes publicadas no Brasil sobre os seguintes temas:
>
> - Direito imobiliário (compra e venda, incorporação, locação, financiamento, distratos);
> - Regularização fundiária e REURB;
> - Direito notarial e registral (atos de cartório, provimentos do CNJ, Colégio Notarial do Brasil, registros de imóveis);
> - Sucessões e planejamento patrimonial (inventário, testamento, holdings familiares, doação);
> - Mercado imobiliário (dados, tendências e regulação com impacto jurídico).
>
> Fontes sugeridas: Conjur, Colégio Notarial do Brasil (CNB), Migalhas e portais jurídicos equivalentes.
>
> Regras:
> - Retorne entre 11 e 17 notícias, todas publicadas nos últimos 30 dias;
> - Cada item deve ter: titulo, descricao (2–3 frases, tom informativo e neutro), data_publicacao, url (link direto para a matéria original) e fonte;
> - **Exclua** notícias sobre violência, política partidária e temas polêmicos ou sensacionalistas;
> - Mantenha tom estritamente informativo, compatível com o Provimento 205/2021 da OAB (sem promessa de resultado, sem mercantilização);
> - Saída: apenas o JSON no contrato definido, sem texto adicional.

## Regras de validação (`scripts/validate-news.js`)

- JSON parseável, com chaves exatas `data-busca` e `noticias`.
- `data-busca` em ISO 8601 com offset.
- `noticias.length` entre 11 e 17.
- Cada item com os 5 campos não vazios; `url` iniciando com `http(s)://`.
- `data_publicacao` ≤ 30 dias antes de `data-busca` (e nunca futura).

## Renderização no site

O build do Astro lê o JSON atual de `data/` e gera a página de notícias como HTML estático. Histórico permanece disponível em `noticias-anteriores/` para eventual página de arquivo.
