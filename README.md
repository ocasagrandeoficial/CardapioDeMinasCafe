# Dê Minas Café — Cardápio Digital + Painel Admin

Catálogo digital **Mobile-First** para a cafeteria **Dê Minas Café**, com um **Painel de Administração** protegido por login e CRUD completo. Construído com **Next.js (App Router)**, **Tailwind CSS**, **shadcn/ui**, **lucide-react**, **Prisma** e **NextAuth (Auth.js v5)**.

## Recursos

### Catálogo público (`/`)

- **Header fixo** com nome centralizado e menu Hamburger (Sheet lateral).
- **Scroll Spy**: o menu destaca a categoria visível e navega suavemente até a seção.
- **Grid responsivo**: 1 coluna (mobile) → 2 (tablet) → 3/4 (desktop).
- Os dados vêm **do banco via Prisma** (Server Component) — sem mock.

### Painel administrativo (`/admin`)

- **Login** em `/admin/login` (NextAuth, provedor de credenciais, 1 admin).
- **Middleware** protege `/admin` e sub-rotas, redirecionando ao login.
- **Dashboard** com contadores (categorias, produtos, indisponíveis).
- **Categorias**: tabela + Dialog para criar/editar + excluir.
- **Produtos**: tabela (miniatura, título, categoria, preço, status) + Sheet
  com formulário (título, descrição, preço, imagem, categoria e switch de
  disponibilidade) + excluir.
- Todas as mutações usam **Next.js Server Actions**.

## Pré-requisitos

- **Node.js 18.18+** (recomendado 20 LTS).

## Configuração e execução

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` (copie de `.env.example`) e ajuste os valores:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="troque-por-um-segredo-aleatorio"   # gere com: npx auth secret
ADMIN_EMAIL="admin@deminascafe.com"
ADMIN_PASSWORD="admin123"
```

3. Crie o banco e popule com dados iniciais:

```bash
npm run db:push   # cria as tabelas no SQLite
npm run db:seed   # popula 6 categorias e 24 produtos
```

4. Rode o projeto:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) (catálogo) e
[http://localhost:3000/admin](http://localhost:3000/admin) (painel).

**Login padrão do admin:** `admin@deminascafe.com` / `admin123`
(definido no `.env`).

### Scripts disponíveis

```bash
npm run dev        # desenvolvimento
npm run build      # prisma generate + build de produção
npm run start      # sobe o build
npm run lint       # checa lint
npm run db:push    # aplica o schema no banco
npm run db:seed    # popula o banco
npm run db:studio  # abre o Prisma Studio (GUI do banco)
```

## Estrutura do projeto

```
app/
  layout.tsx                 # fontes (Playfair/Inter) e metadata
  globals.css                # Tailwind + tema + scroll-behavior
  page.tsx                   # catálogo público (lê do banco via Prisma)
  api/auth/[...nextauth]/    # route handler do NextAuth
  admin/
    login/                   # página de login + action de autenticação
    categorias/actions.ts    # server actions (CRUD de categorias)
    produtos/actions.ts      # server actions (CRUD de produtos)
    (protected)/             # grupo protegido pelo layout + middleware
      layout.tsx             # sidebar fixa + verificação de sessão
      page.tsx               # dashboard (/admin)
      categorias/            # página + dialog de categorias
      produtos/              # página + sheet/form de produtos
components/
  ProductCard.tsx            # card de produto do catálogo
  layout/                    # Header (scroll spy) e Footer
  admin/                     # sidebar, logout, dialog de exclusão
  ui/                        # shadcn/ui (button, sheet, dialog, table,
                             #   input, textarea, label, select, switch)
hooks/use-scroll-spy.ts      # IntersectionObserver para o link ativo
lib/
  prisma.ts                  # singleton do Prisma Client
  utils.ts | format.ts | slugify.ts | auth-guard.ts
prisma/
  schema.prisma              # models Category e Product (1:N)
  seed.ts                    # dados iniciais
auth.ts | auth.config.ts     # configuração do NextAuth (Auth.js v5)
middleware.ts                # protege /admin/*
```

## Modelagem (Prisma)

- **Category**: `id`, `name`, `slug` (único), `order`, `products[]`.
- **Product**: `id`, `title`, `description`, `imageUrl`, `price`,
  `isAvailable`, `categoryId` → relação **1:N** (uma categoria, vários
  produtos; `onDelete: Cascade`).

## Migração para PostgreSQL (Vercel)

O schema já está pronto para produção. Para migrar:

1. Em `prisma/schema.prisma`, troque `provider = "sqlite"` por
   `provider = "postgresql"`.
2. Configure `DATABASE_URL` com a string do Postgres (ex.: Neon/Vercel Postgres).
3. Rode `npx prisma migrate deploy` (ou `prisma db push`).

## Observações

- As imagens usam URLs do Unsplash/Placehold.co. Domínios liberados em
  `next.config.mjs` (`images.unsplash.com`, `placehold.co`).
- `.env` e `dev.db` estão no `.gitignore` (não sobem ao GitHub).
- **Segurança**: para produção, considere trocar a comparação de senha em
  texto puro por um hash (ex.: `bcrypt`) e usar variáveis de ambiente seguras.
