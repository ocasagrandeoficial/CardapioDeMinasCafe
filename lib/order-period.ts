export type OrderPeriod = "today" | "week" | "month" | "all";

export const ORDER_PERIODS: { value: OrderPeriod; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "week", label: "Últimos 7 dias" },
  { value: "month", label: "Últimos 30 dias" },
  { value: "all", label: "Todo o período" },
];

/** Retorna o filtro Prisma `createdAt` conforme o período selecionado. */
export function getOrderDateFilter(period: string): { gte: Date } | undefined {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  switch (period as OrderPeriod) {
    case "today":
      return { gte: startOfToday };
    case "week": {
      const from = new Date(startOfToday);
      from.setDate(from.getDate() - 7);
      return { gte: from };
    }
    case "month": {
      const from = new Date(startOfToday);
      from.setDate(from.getDate() - 30);
      return { gte: from };
    }
    default:
      return undefined;
  }
}

/** Resumo legível dos itens. Ex.: "2x Café, 1x Pão de Queijo" */
export function formatOrderSummary(
  items: { quantity: number; product: { title: string } }[]
): string {
  return items.map((item) => `${item.quantity}x ${item.product.title}`).join(", ");
}

/** ID curto para exibição na tabela. */
export function formatOrderId(id: string): string {
  return id.slice(-8).toUpperCase();
}
