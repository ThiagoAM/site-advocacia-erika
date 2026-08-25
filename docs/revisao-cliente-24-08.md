# Revisão da cliente — 24/08/2026

Primeira leitura da Dra. Érika sobre o site já publicado, feita no desktop e enviada por WhatsApp em
áudios e prints (18h50 → 21h). Este documento registra o que foi pedido, o que foi aplicado e o que
ficou em aberto — as decisões de conteúdo aqui valem sobre o que estiver escrito nos docs de redesign.

## 1. Posicionamento: atuação exclusivamente extrajudicial

A mudança mais importante. Nas palavras dela: *"eu atuo só na área extrajudicial… o judicial hoje eu
não faço mais"*, e o site precisava deixar isso claro **para não atrair demanda contenciosa**.

O site deixou de oferecer serviços judiciais em todo lugar:

| Onde | Antes | Depois |
|---|---|---|
| Eyebrow do hero | Advocacia consultiva · Imobiliário & Patrimonial | Advocacia extrajudicial · Consultiva, imobiliária, patrimonial, registral e notarial |
| Lead do hero | …estruturas jurídicas sólidas para famílias e investidores | Advocacia **extrajudicial e consultiva** em… — para famílias, investidores e **profissionais do mercado imobiliário** |
| Direito Imobiliário | "a via mais adequada ao caso — negociada, extrajudicial ou judicial" | composição entre as partes e solução em cartório |
| Direito Imobiliário (tópico) | Conflitos imobiliários | Solução extrajudicial de divergências |
| Regularização (tópicos) | Usucapião judicial e extrajudicial; adjudicação "pela via judicial ou extrajudicial" | Usucapião **extrajudicial**; Adjudicação compulsória **extrajudicial** |
| Inventário | "inventários judiciais e extrajudiciais"; tópico "Inventário judicial"; "alvarás judiciais" | inventários **extrajudiciais**; tópico substituído por "Análise da via e dos requisitos"; sobrepartilha por escritura |
| /a-advogada | Do serviço público à advocacia consultiva | Do serviço público à advocacia **extrajudicial** |

Continuam citando o Judiciário, de propósito: o FAQ que **explica** a diferença entre as vias, os
leilões judiciais como origem do imóvel numa due diligence (trabalho consultivo) e o nome oficial da
"Comissão de Direito Notarial e das Serventias Extrajudicial e Judicial — OAB/PR".

## 2. Hero

- A tag "Brasil · EUA · Canadá · Portugal · Itália" **saiu da foto**. Sobrou uma única tag flutuante.
- A tag com o nome dela saiu da esquerda (caía sobre o cabelo) para a **direita e mais abaixo**, na
  altura do braço, com a letra um pouco maior (`1rem` contra os `0.875rem` do chip padrão). O cabelo
  dela desce até cerca de 60 % da altura da figura **dos dois lados**, por isso o `top: 66%`.
- Três recortes, porque a figura encolhe mas a tag não: no desktop `right: -24%`; entre 901 e
  1150 px `top: 70% / right: -22%` (aí `--fig-max` vira `33vw`); empilhado (≤ 900 px) a tag ancora na
  margem direita do container, `top: 72%`.
- O eyebrow passou a ocupar duas linhas no desktop — a lista completa das frentes não cabe em uma só
  na coluna de texto. `text-wrap: balance` equilibra as linhas.

## 3. Textos por área

- **Regularização de Imóveis & REURB → Regularização de Imóveis.** O `slug` continua
  `regularizacao-reurb` (URL já indexada e REURB pesa em SEO); só o título mudou. Descrição passou a
  incluir *adjudicação compulsória*, e entrou o tópico **Estremação**.
- **Direito Imobiliário** — a primeira frase agora abre em "de uma pessoa, de uma família ou de um
  investidor".
- **Planejamento Patrimonial** — "para quem é" ganhou *casais prestes a se casar ou a formalizar
  união estável*.
- **Holdings Familiares** — a visão geral passou a começar pela definição dela: holding **não é uma
  empresa**, é um sistema que pode ser estruturado com quantas empresas (células) forem necessárias.
  Entrou também a distinção **holding pura / patrimonial / mista**, e o "para quem é" abre em
  "pessoas e famílias".
- **Inventário e Sucessões** — "Para **todos** que precisam conduzir um inventário".
- **Due Diligence** — "para quem é" ganhou *profissionais do mercado imobiliário*.
- **Home / Áreas** — "Cada patrimônio exige uma estrutura própria" → "Cada **fase da vida** e cada
  patrimônio exigem uma estrutura própria".
- **FAQ do inventário** — resposta reescrita com o texto dela, incluindo a Resolução nº 571/2024 do
  CNJ (que flexibilizou o inventário extrajudicial com herdeiro menor). São três parágrafos: por
  isso o `Accordion` passou a renderizar a resposta em `<div class="acc-a">`, e não mais num `<p>`.

## 4. Contatos

Ela passou a usar também um número do Rio de Janeiro, mas quis manter o do Paraná como principal
("minha OAB a princípio é do Paraná"). Ficou assim:

- **(41) 99724-8234** — em todos os botões de WhatsApp do site.
- **(22) 99265-2515** — listado no rodapé e no card de WhatsApp de `/contato`, sem botão próprio.

## 5. Países: histórico de clientes, não oferta de atendimento

Confirmado por ela em **25/08/2026**, fechando o pedido do Tio Robson e da Larissa: o site **não
oferece atendimento em outros países**. O mapa-múndi fica, com os cinco marcadores — mas relendo o
que ele significa: **países onde clientes já foram atendidos**. A atuação é sempre sobre patrimônio,
herança ou negócios **no Brasil**, regidos pelo direito brasileiro; o cliente é que mora fora.

| Onde | Antes | Depois |
|---|---|---|
| Tag sobre a foto do hero | Brasil · EUA · Canadá · Portugal · Itália | **removida** |
| Faixa de credenciais | 5 países · Brasil · EUA · Canadá · Portugal · Itália | 5 países · **com clientes já atendidos** |
| Card da advogada | **Atendimento internacional** — Brasil, EUA… | **Clientes já atendidos** — no Brasil, nos EUA… |
| Seção do mapa | eyebrow "Alcance"; "O atendimento acompanha a distância" | eyebrow **"Clientes já atendidos"**; "O trabalho é sempre sobre esse patrimônio brasileiro" |
| Selo do mapa | 5 países · Brasil · EUA · Canadá · Portugal · Itália | 5 países · **com clientes já atendidos** (os nomes já estão nos marcadores) |
| Abaixo do mapa | — | nota nova: "Os marcadores indicam os países onde clientes já foram atendidos — todos em questões de patrimônio, herança ou negócios no Brasil, regidas pelo direito brasileiro." |
| CTAs (home e páginas) | **Atendimento** · Brasil — EUA — … | **Clientes já atendidos** · Brasil — EUA — … |
| Rodapé | Curitiba — PR · Atendimento no Brasil **e no exterior** | Curitiba — PR · Atendimento presencial e online **em todo o Brasil** |
| `/contato` | bloco "**No exterior**" — atendimento por videoconferência para clientes nos EUA… | bloco "**Quem mora fora**" — brasileiros em outro país, sempre sobre patrimônio no Brasil |
| FAQ "Atende quem mora fora?" | residentes nos EUA, no Canadá… | "clientes **já foram atendidos** nos EUA…" + "o trabalho é sempre sobre questões regidas pelo direito brasileiro" |
| `/a-advogada` | marco "atuação **internacional**" | marco "**clientes fora do país**"; "brasileiros que moram nos EUA…" |
| `/educacao` | cursos "no Brasil e no exterior" | "para turmas de qualquer lugar" |

Regra para textos futuros: os países qualificam **onde o cliente mora**, nunca onde o escritório
atua. "Atendimento internacional", "atendimento no exterior" e afins não voltam ao site.

## 6. Crédito do estúdio

O rodapé passou a trazer "Criado por **Owari Labs**" (<https://owarilabs.com/pt-br/>), agrupado com o
copyright para os dois descerem juntos quando não cabem na linha do aviso de conformidade.

## 7. Créditos acadêmicos

O doutorado passou a ser creditado à **ITE** ("Doutora em Direito — ITE" na página da advogada,
"pesquisa em REURB, pela ITE" no card da home).

## 8. Em aberto

| Item | Situação |
|---|---|
| **E-mail profissional no domínio** | Ela pediu para incluir o e-mail vinculado ao site, mas o Google Workspace ainda não foi contratado (`erika@` / `contato@saquettimartins.adv.br`). O site segue com `erikasaquetti@gmail.com` para não publicar um endereço que devolve mensagem. Trocar em `src/data/site.ts` e gerar nova chave do Web3Forms — ver [formulario-contato.md](./formulario-contato.md). |

## 9. Aprovado sem alteração

Ela revisou tela a tela e aprovou o restante ("restante está maravilhoso"). Em especial, pediu para
**não mexer** na visão geral da Regularização de Imóveis ("Do imóvel de fato ao imóvel de direito").
