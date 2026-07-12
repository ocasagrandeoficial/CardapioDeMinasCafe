# Dê Minas Café — Cardápio Digital

Catálogo digital (cardápio) responsivo **Mobile-First** para a cafeteria **Dê Minas Café**, construído com **Next.js (App Router)**, **Tailwind CSS**, **shadcn/ui** e ícones **lucide-react**.

## Recursos

- **Header fixo** (`sticky top-0`) com nome centralizado e menu Hamburger à esquerda.
- **Menu lateral (Sheet/Drawer)** com as categorias: Cafés, Salgados, Sobremesas, Bebidas, Pães de Queijo e Empório.
- **Scroll Spy**: o menu destaca automaticamente a categoria visível e navega suavemente (`scroll-behavior: smooth`) até a seção correspondente.
- **Grid responsivo**: 1 coluna (mobile) → 2 (tablet) → 3/4 (desktop).
- **Mock data** desacoplado em `data/menu.ts`.
- Paleta acolhedora: fundo `stone-50`, texto `stone-800` e acentos em tons de café (`coffee-*`).

## Pré-requisitos

- **Node.js 18.18+** (recomendado 20 LTS) — não estava instalado no ambiente, então instale a partir de [nodejs.org](https://nodejs.org/).

## Como rodar

```bash
npm install
npm run dev
```

Depois abra [http://localhost:3000](http://localhost:3000).

Outros scripts:

```bash
npm run build   # build de produção
npm run start   # sobe o build de produção
npm run lint    # checa lint
```

## Estrutura do projeto

```
app/
  globals.css        # Tailwind + variáveis de tema + scroll-behavior
  layout.tsx         # fontes (Playfair/Inter) e metadata
  page.tsx           # página principal: hero + seções por categoria
components/
  ProductCard.tsx    # card de produto (imagem, título, descrição, preço)
  layout/
    Header.tsx       # header fixo + Sheet/menu + scroll spy
    Footer.tsx       # rodapé com redes sociais
  ui/                # componentes shadcn/ui (button, sheet)
data/
  menu.ts            # dados fictícios das categorias e produtos
hooks/
  use-scroll-spy.ts  # IntersectionObserver para o link ativo
lib/
  utils.ts           # helper cn()
```

## Observações

- As imagens usam URLs do Unsplash apenas para simulação. Os domínios remotos
  já estão liberados em `next.config.mjs` (`images.unsplash.com`, `placehold.co`).
- Para trocar produtos/preços/imagens, edite apenas `data/menu.ts`.
