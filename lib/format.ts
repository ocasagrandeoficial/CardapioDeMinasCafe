import { BRASILIA_TZ } from "@/lib/timezone";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um número como moeda brasileira. Ex.: 7 -> "R$ 7,00" */
export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

/** Formata percentual. Ex.: 42.5 -> "42,5%" */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

/** Formata data e hora em Brasília. Ex.: "12/07/2026, 14:30" */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: BRASILIA_TZ,
  }).format(date);
}
