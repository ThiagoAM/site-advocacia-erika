# Formulário de contato (Web3Forms)

O formulário da página `/contato/` envia mensagens por e-mail **sem backend próprio**, usando o serviço [Web3Forms](https://web3forms.com). O site continua 100% estático no GitHub Pages.

## Por que Web3Forms

- **Sem servidor**: o `<form>` faz `POST` direto para `https://api.web3forms.com/submit`; o serviço encaminha o conteúdo ao e-mail cadastrado.
- **Chave pública**: a *access key* não é segredo sensível — ela só identifica o destinatário e fica embutida no HTML (por isso o nome `PUBLIC_…`). Abuso é mitigado pelo honeypot e pelo limite mensal do serviço.
- **Sem cadastro de conta** para começar: a chave é gerada informando apenas o e-mail de destino.
- **Plano gratuito suficiente** para um escritório: 250 envios/mês, sem marca d'água, com anti-spam (honeypot) incluído.
- Alternativas avaliadas: Formspree (limite gratuito menor, 50/mês) e Cloudflare Worker (exigiria manter código e segredos de SMTP).

## Como funciona no código

| Arquivo | Papel |
|---|---|
| `src/components/ContactForm.astro` | Seção "02 / Envie uma mensagem": markup, estilos e JS de envio |
| `src/pages/contato.astro` | Inclui o componente e ajusta a numeração das seções |
| `.env.example` | Modelo da variável `PUBLIC_WEB3FORMS_KEY` |
| `.github/workflows/deploy.yml` | Injeta a chave no build a partir do secret do repositório |

Campos: Nome*, E-mail*, Telefone/WhatsApp, Assunto* (as seis áreas de atuação + "Educação & Treinamentos" + "Outro"), Mensagem*, consentimento LGPD* (link para `/politica-de-privacidade/`).

Campos ocultos enviados ao Web3Forms: `access_key`, `subject` ("Novo contato pelo site — Saquetti Martins Advocacia"), `from_name` ("Site Saquetti Martins Advocacia") e o honeypot `botcheck` (checkbox invisível; se um bot marcar, o envio é descartado pelo serviço).

Envio: JavaScript intercepta o `submit`, valida com a API nativa do navegador, faz `fetch` com `Accept: application/json` e exibe o resultado inline (sucesso substitui o formulário por confirmação + botão de WhatsApp; erro mostra aviso com `role="alert"` sugerindo WhatsApp/e-mail). Sem JS, o `POST` tradicional continua funcionando (o Web3Forms mostra uma página de confirmação própria).

**Sem a chave no build**, o formulário continua visível em modo degradado: o botão "Enviar" abre o aplicativo de e-mail do visitante com nome, contato, assunto e mensagem já preenchidos (`mailto:`). Com a chave, o envio passa a ser pela API do Web3Forms, sem sair da página.

## Como gerar a access key

1. Acesse <https://web3forms.com>.
2. No campo "Create your Access Key", informe o e-mail que deve **receber** as mensagens: `erika@saquettimartins.adv.br` (chave atual, criada em 27/08/2026, já aponta para ele).
3. A chave (formato UUID) é enviada para esse e-mail. Guarde-a.

## Onde colocar a chave

### Produção (GitHub Pages)

1. No repositório: **Settings → Secrets and variables → Actions → New repository secret**.
2. Nome: `PUBLIC_WEB3FORMS_KEY`. Valor: a chave recebida.
3. Salve e dispare um novo deploy (push na `main` ou **Actions → Deploy to GitHub Pages → Run workflow**).

O workflow já passa o secret para o step de build:

```yaml
- uses: withastro/action@v3
  with:
    node-version: 22
  env:
    PUBLIC_WEB3FORMS_KEY: ${{ secrets.PUBLIC_WEB3FORMS_KEY }}
```

### Local

```sh
cp .env.example .env
# edite .env e preencha PUBLIC_WEB3FORMS_KEY=...
```

`.env` está no `.gitignore` — nunca faça commit dele.

## Limites do plano gratuito

- **250 envios por mês** por chave. Ao atingir o limite, o serviço responde com erro e o site mostra o aviso de erro com o fallback de WhatsApp/e-mail.
- Anexos de arquivo não estão disponíveis no plano gratuito (o formulário não usa anexos).
- Se o volume crescer, há planos pagos no próprio Web3Forms ou migração simples para outro provedor — basta trocar `action` e os campos ocultos no componente.

## Trocar o e-mail de destino no futuro

A chave está vinculada ao e-mail usado na criação. Para mudar o destinatário:

1. Gere uma **nova** chave em <https://web3forms.com> com o novo e-mail.
2. Atualize o secret `PUBLIC_WEB3FORMS_KEY` no GitHub (e o `.env` local).
3. Rode um novo deploy.

Alternativa para encaminhar a vários destinatários sem trocar a chave: configurar uma regra de redirecionamento no Gmail da conta atual.

## Conformidade

Textos do formulário são informativos e sem promessa de resultado (Provimento 205/2021 da OAB). A coleta de dados exige consentimento explícito (checkbox obrigatório) e os dados são usados apenas para responder ao contato, conforme a Política de Privacidade.
