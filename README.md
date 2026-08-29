# Loomi

Loja de roupas completa construída com **Next.js**, **Prisma** e **Stripe** — catálogo,
carrinho, checkout com cupons e campanhas, conta de cliente e um painel de administração
para gerenciar produtos, pedidos, categorias, campanhas, cupons e financeiro.

[![CI](https://github.com/Anderson-Sa/loomi/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Anderson-Sa/loomi/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)

## Sumário

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Testes](#testes)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Antes de ir para produção](#antes-de-ir-para-produção)
- [Licença](#licença)

## Funcionalidades

**Loja**
- Catálogo com busca e navegação por público (feminino, masculino, infantil)
- Carrinho persistente, cupons de desconto e campanhas promocionais
- Checkout via Stripe com confirmação de pedido por e-mail (Resend)
- SEO básico: `sitemap.xml`, `robots.txt` e metadados por página

**Conta do cliente**
- Cadastro, login e recuperação de senha
- Histórico de pedidos
- Rate limiting contra força bruta no login

**Painel administrativo** (`/admin`)
- Gestão de produtos, categorias, campanhas e cupons
- Acompanhamento de pedidos e visão financeira
- Acesso protegido por sessão, com rate limiting no login

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- [Prisma 7](https://prisma.io) com SQLite local (`@prisma/adapter-better-sqlite3`)
- [Stripe](https://stripe.com) para checkout e webhooks de pagamento
- [Resend](https://resend.com) para e-mails transacionais (confirmação de pedido, redefinição de senha)
- [Vitest](https://vitest.dev) para testes unitários
- Tailwind CSS v4

## Como rodar localmente

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

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `npm test` | Testes unitários (Vitest) |
| `npm run db:seed` | Popula o banco com dados de exemplo |

## Testes

Testes unitários cobrem a lógica de precificação, cupons e rate limiting
(`src/lib/pricing.ts`, `src/lib/coupon.ts`, `src/lib/rateLimit.ts`), que envolvem
cálculo de valores cobrados no checkout e proteção contra abuso:

```bash
npm test
```

Todo push e pull request para `main` roda lint, typecheck, testes e build via
[GitHub Actions](.github/workflows/ci.yml).

## Estrutura do projeto

```
src/
├── app/
│   ├── (store)/    # páginas públicas da loja (catálogo, produto, carrinho, conta, checkout)
│   ├── admin/       # painel administrativo (protegido por sessão de admin)
│   └── api/         # rotas de API (checkout, validação de cupom, webhook do Stripe)
├── components/       # componentes de UI compartilhados
├── context/          # contextos React (carrinho, cliente)
└── lib/               # lógica de domínio (preço, cupom, sessão, e-mail, upload, rate limit)
prisma/
└── schema.prisma      # modelo de dados
```

## Deploy

O banco local usa SQLite em arquivo, o que **não funciona em plataformas serverless**
(ex.: Vercel) porque o filesystem não é persistente entre invocações/deploys. Antes de
colocar em produção, troque `DATABASE_URL` para um Postgres gerenciado (ex.: Prisma
Postgres, Supabase, Neon) e ajuste o `provider` do datasource em `prisma/schema.prisma`.

Configure também o webhook do Stripe (`/api/webhooks/stripe`) apontando para o domínio
de produção e use as chaves live do Stripe e da Resend.

## Antes de ir para produção

Itens que hoje usam dados de placeholder/teste e precisam ser revisados com o cliente
antes do lançamento:

- [ ] Substituir os textos entre colchetes das páginas legais (termos de uso, política
      de privacidade, trocas e devoluções) por dados reais da empresa, revisados por
      um advogado
- [ ] Confirmar nome da marca e aplicar identidade visual definitiva (logo/favicon)
- [ ] Trocar `ADMIN_PASSWORD` por uma senha forte definida com o cliente
- [ ] Migrar `DATABASE_URL` de SQLite para Postgres (veja [Deploy](#deploy))
- [ ] Trocar chaves de teste do Stripe/Resend pelas chaves de produção do cliente

## Licença

Código aberto para fins de portfólio e estudo — sinta‑se à vontade para explorar,
rodar localmente e se inspirar. Sem licença de código aberto formal atribuída; para
reuso em outro projeto, entre em contato.
