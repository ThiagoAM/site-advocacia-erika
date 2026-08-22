# Domínios

Disponibilidade verificada no Registro.br em **19/08/2026**. Nenhum domínio foi comprado ainda.

## Tabela de domínios

| Domínio | Papel | Onde registrar | Status | Notas |
|---|---|---|---|---|
| `saquettimartins.adv.br` | **Principal** | Registro.br (~R$ 40/ano) | Disponível, não comprado | `.adv.br` é exclusivo de advogados — registrar **na conta da Érika**, com validação OAB |
| `saquettimartins.com.br` | Redirect → principal | Registro.br (~R$ 40/ano) | Disponível, não comprado | |
| `saquettimartins.com` | Público internacional (EUA, Canadá, Portugal) | Cloudflare Registrar ou Porkbun | Disponível, não comprado | |
| `erikasaquetti.adv.br` | Opcional (nome pessoal) | Registro.br (~R$ 40/ano) | Disponível, não comprado | Mesma exigência de validação OAB |

DNS de todos: **Cloudflare**.

## Passos de configuração

### 1. Registro
1. Criar/usar conta da Érika no Registro.br (CPF dela + validação de inscrição na OAB para os `.adv.br`).
2. Registrar os `.br` diretamente no Registro.br.
3. Registrar `saquettimartins.com` no Cloudflare Registrar (ou Porkbun).

### 2. DNS (Cloudflare)
1. Adicionar as zonas no Cloudflare e apontar os nameservers no Registro.br para os do Cloudflare.
2. No domínio principal, criar registros para o GitHub Pages:
   - `A` no apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `<usuario>.github.io`
3. Domínios de redirect: Redirect Rules (301) do Cloudflare para `https://saquettimartins.adv.br`.

### 3. GitHub Pages
1. Manter `public/CNAME` no repositório com `saquettimartins.adv.br` (o Astro copia para a saída do build).
2. Em Settings → Pages: definir o custom domain e habilitar **Enforce HTTPS** após a emissão do certificado.
3. Deploy contínuo via GitHub Actions (`withastro/action`).

## Status (22/08/2026)

- `saquettimartins.adv.br` registrado no Registro.br (único domínio por enquanto).
- DNS no próprio Registro.br (modo avançado): 4 registros `A` → 185.199.108/109/110/111.153 e `CNAME www` → `thiagoam.github.io`. Nameservers finais: `d.sec.dns.br` / `e.sec.dns.br` (DNSSEC ativo).
- GitHub Pages: domínio customizado verificado, certificado Let's Encrypt emitido (válido até 20/11/2026, renovação automática) e **Enforce HTTPS ativado**.
- Site no ar em https://saquettimartins.adv.br (www redireciona).
