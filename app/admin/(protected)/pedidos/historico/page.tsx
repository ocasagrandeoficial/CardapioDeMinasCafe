import { prisma } from "@/lib/prisma";
import { formatPrice, formatDateTime } from "@/lib/format";
import {
  formatOrderId,
  formatOrderSummary,
  getOrderDateFilter,
  type OrderPeriod,
} from "@/lib/order-period";
import { OrderPeriodFilter } from "@/components/admin/order-period-filter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const VALID_PERIODS = new Set(["today", "week", "month", "all"]);

interface HistoricoPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function HistoricoPedidosPage({
  searchParams,
}: HistoricoPageProps) {
  const params = (await searchParams) ?? {};
  const rawPeriod = params.period;
  const period: OrderPeriod = VALID_PERIODS.has(rawPeriod ?? "")
    ? (rawPeriod as OrderPeriod)
    : "all";

  const dateFilter = getOrderDateFilter(period);

  let orders: Awaited<
    ReturnType<
      typeof prisma.order.findMany<{
        include: { items: { include: { product: true } } };
      }>
    >
  > = [];
  let loadError: string | null = null;

  try {
    orders = await prisma.order.findMany({
      where: dateFilter ? { createdAt: dateFilter } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  } catch (error) {
    console.error("historico pedidos:", error);
    loadError =
      "Não foi possível carregar o histórico. Verifique se o banco de dados está atualizado.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-800">
          Histórico de Pedidos
        </h1>
        <p className="mt-1 text-stone-500">
          Consulte as comandas finalizadas por período.
        </p>
      </div>

      <OrderPeriodFilter current={period} />

      {loadError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {loadError}
        </p>
      )}

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Comanda</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-stone-500"
                >
                  Nenhum pedido encontrado neste período.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-medium text-stone-500">
                    #{formatOrderId(order.id)}
                  </TableCell>
                  <TableCell className="font-medium text-stone-800">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-stone-600">
                    {formatDateTime(order.createdAt)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-stone-500">
                    {formatOrderSummary(order.items)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-coffee-700">
                    {formatPrice(order.totalAmount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
