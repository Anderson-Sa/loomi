# Loomi

Loja de roupas construída com Next.js (App Router), Prisma e Stripe. Catálogo por
público (feminino/masculino/infantil), carrinho, checkout com cupons e campanhas,
conta de cliente e um painel de admin para produtos, pedidos, categorias, campanhas,
cupons e financeiro.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- [Prisma 7](https://prisma.io) com SQLite local (`@prisma/adapter-better-sqlite3`)
- [Stripe](https://stripe.com) para checkout e webhooks de pagamento
- [Resend](https://resend.com) para e-mails transacionais (confirmação de pedido, redefinição de senha)
- Tailwind CSS v4

## Getting started

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e preencha os valores:

   ```bash
   cp .env.example .env
   ```

   Veja a seção [Variáveis de ambiente](#variáveis-de-ambiente) abaixo para o que cada uma faz.

3. Rode as migrations do Prisma para criar o banco SQLite local:

   ```bash
   npx prisma migrate dev
   ```

4. (Opcional) Popule o banco com categorias e produtos de exemplo:

   ```bash
   npm run db:seed
   ```

5. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Abra [http://localhost:3000](http://localhost:3000) para a loja e
   [http://localhost:3000/admin](http://localhost:3000/admin) para o painel de admin
   (senha definida em `ADMIN_PASSWORD`).

## Variáveis de ambiente

Todas estão documentadas em [`.env.example`](.env.example). Resumo:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Caminho do banco SQLite (`file:./dev.db` em dev). Em produção, veja [Deploy](#deploy). |
| `STRIPE_SECRET_KEY` | Para checkout | Chave secreta do Stripe (use chave de teste em dev). |
| `STRIPE_WEBHOOK_SECRET` | Para checkout | Secret do endpoint de webhook (`/api/webhooks/stripe`). |
| `ADMIN_PASSWORD` | Para o admin | Senha de acesso ao `/admin`. |
| `ADMIN_SESSION_SECRET` | Para o admin | Chave usada para assinar o cookie de sessão do admin (`openssl rand -hex 32`). |
| `CUSTOMER_SESSION_SECRET` | Para `/conta` | Chave usada para assinar o cookie de sessão do cliente (`openssl rand -hex 32`). |
| `RESEND_API_KEY` | Não | Sem ela, o pedido é processado normalmente mas nenhum e-mail é enviado. |
| `RESEND_FROM_EMAIL` | Não | Remetente verificado na Resend. Sem isso, usa `onboarding@resend.dev`, que só entrega para o e-mail dono da conta Resend. |
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública do site (usada no `sitemap.xml`, `robots.txt` e tags OpenGraph). Padrão: `http://localhost:3000`. |

## Scripts

```bash
npm run dev        # servidor de desenvolvimento
npm run build       # build de produção
npm run start       # serve o build de produção
npm run lint         # ESLint
npm run typecheck    # checagem de tipos (tsc --noEmit)
npm test             # testes unitários (Vitest)
npm run db:seed      # popula o banco com dados de exemplo
```

## Testes

Testes unitários cobrem a lógica de precificação e cupons (`src/lib/pricing.ts`,
`src/lib/coupon.ts`), que envolvem cálculo de valores cobrados no checkout:

```bash
npm test
```

## Deploy

O banco local usa SQLite em arquivo, o que **não funciona em plataformas serverless**
(ex.: Vercel) porque o filesystem não é persistente entre invocações/deploys. Antes de
colocar em produção, troque `DATABASE_URL` para um Postgres gerenciado (ex.: Prisma
Postgres, Supabase, Neon) e ajuste o `provider` do datasource em `prisma/schema.prisma`.

Configure também o webhook do Stripe (`/api/webhooks/stripe`) apontando para o domínio
de produção e use as chaves live do Stripe e da Resend.

## Estrutura

- `src/app/(store)` — páginas públicas da loja (catálogo, produto, carrinho, conta, checkout)
- `src/app/admin` — painel administrativo (protegido por sessão de admin)
- `src/app/api` — rotas de API (checkout, validação de cupom, webhook do Stripe)
- `src/lib` — lógica de domínio (preço, cupom, sessão, e-mail, upload, etc.)
- `prisma/schema.prisma` — modelo de dados
