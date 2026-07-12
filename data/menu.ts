export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface Category {
  id: string;
  label: string;
  products: Product[];
}

/**
 * Dados fictícios do cardápio. As imagens usam URLs do Unsplash
 * (configuradas em `next.config.mjs`) apenas para simulação.
 */
export const menu: Category[] = [
  {
    id: "cafes",
    label: "Cafés",
    products: [
      {
        id: "espresso",
        name: "Espresso Tradicional",
        description: "Grãos 100% arábica, torra média, extração intensa.",
        price: "R$ 7,00",
        image:
          "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "cappuccino",
        name: "Cappuccino Cremoso",
        description: "Espresso, leite vaporizado e espuma aveludada com canela.",
        price: "R$ 12,00",
        image:
          "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "latte",
        name: "Café Latte",
        description: "Espresso suave envolto em leite cremoso e leve espuma.",
        price: "R$ 13,00",
        image:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "mocha",
        name: "Mocha Belga",
        description: "Espresso, chocolate belga, leite vaporizado e chantilly.",
        price: "R$ 15,00",
        image:
          "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "salgados",
    label: "Salgados",
    products: [
      {
        id: "coxinha",
        name: "Coxinha de Frango",
        description: "Massa artesanal, frango desfiado temperado e catupiry.",
        price: "R$ 9,00",
        image:
          "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "empada",
        name: "Empada de Palmito",
        description: "Massa amanteigada com recheio cremoso de palmito.",
        price: "R$ 10,00",
        image:
          "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "quiche",
        name: "Quiche Lorraine",
        description: "Massa crocante, creme de ovos, queijo e bacon defumado.",
        price: "R$ 14,00",
        image:
          "https://images.unsplash.com/photo-1591985666643-1ecc67616216?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "sanduiche",
        name: "Sanduíche Caprese",
        description: "Pão ciabatta, muçarela de búfala, tomate e pesto.",
        price: "R$ 18,00",
        image:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "sobremesas",
    label: "Sobremesas",
    products: [
      {
        id: "cheesecake",
        name: "Cheesecake de Frutas Vermelhas",
        description: "Base de biscoito, creme de cream cheese e calda de frutas.",
        price: "R$ 16,00",
        image:
          "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "brownie",
        name: "Brownie com Nozes",
        description: "Chocolate meio amargo, nozes crocantes e textura úmida.",
        price: "R$ 13,00",
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "tiramisu",
        name: "Tiramisù da Casa",
        description: "Camadas de biscoito, café, mascarpone e cacau em pó.",
        price: "R$ 17,00",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "petit-gateau",
        name: "Petit Gâteau",
        description: "Bolinho quente de chocolate com sorvete de creme.",
        price: "R$ 19,00",
        image:
          "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "bebidas",
    label: "Bebidas",
    products: [
      {
        id: "suco-laranja",
        name: "Suco de Laranja Natural",
        description: "Laranjas frescas espremidas na hora, sem açúcar.",
        price: "R$ 11,00",
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "chocolate-quente",
        name: "Chocolate Quente",
        description: "Chocolate ao leite cremoso finalizado com chantilly.",
        price: "R$ 14,00",
        image:
          "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "cha-gelado",
        name: "Chá Gelado de Hibisco",
        description: "Infusão de hibisco com toque cítrico e hortelã.",
        price: "R$ 10,00",
        image:
          "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "smoothie",
        name: "Smoothie de Frutas Vermelhas",
        description: "Morango, amora, mirtilo e iogurte natural batidos.",
        price: "R$ 15,00",
        image:
          "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "paes-de-queijo",
    label: "Pães de Queijo",
    products: [
      {
        id: "pdq-tradicional",
        name: "Pão de Queijo Tradicional",
        description: "Receita mineira com queijo canastra e polvilho azedo.",
        price: "R$ 6,00",
        image:
          "https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "pdq-recheado",
        name: "Pão de Queijo Recheado",
        description: "Massa dourada recheada com catupiry cremoso.",
        price: "R$ 9,00",
        image:
          "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "pdq-cestinha",
        name: "Cestinha de Pão de Queijo",
        description: "Porção generosa servida quentinha, ideal para dividir.",
        price: "R$ 22,00",
        image:
          "https://images.unsplash.com/photo-1568051243858-533a607809a5?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "pdq-integral",
        name: "Pão de Queijo Integral",
        description: "Versão leve com polvilho integral e queijo minas.",
        price: "R$ 8,00",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "emporio",
    label: "Empório",
    products: [
      {
        id: "cafe-graos",
        name: "Café em Grãos 250g",
        description: "Torra artesanal, notas de chocolate e caramelo.",
        price: "R$ 34,00",
        image:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "geleia",
        name: "Geleia Artesanal",
        description: "Frutas selecionadas cozidas lentamente, sem conservantes.",
        price: "R$ 28,00",
        image:
          "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "mel",
        name: "Mel Silvestre 300g",
        description: "Mel puro de florada silvestre, colhido em Minas Gerais.",
        price: "R$ 32,00",
        image:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "caneca",
        name: "Caneca Dê Minas",
        description: "Caneca de cerâmica exclusiva com a marca da casa.",
        price: "R$ 45,00",
        image:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];
