const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um número como moeda brasileira. Ex.: 7 -> "R$ 7,00" */
export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}
