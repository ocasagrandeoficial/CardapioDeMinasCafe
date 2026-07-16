"use client";

import { useEffect, useState, useTransition } from "react";
import { Clock, Loader2, Printer, User, UtensilsCrossed } from "lucide-react";

import { completeOrder } from "@/app/admin/pedidos/actions";
import { usePendingOrders } from "@/hooks/use-pending-orders";
import { useReceiptPrint } from "@/hooks/use-receipt-print";
import { toKitchenReceiptData } from "@/lib/receipt";
import { formatOrderId } from "@/lib/order-period";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function formatWaitTime(createdAtISO: string, now: number): string {
  const minutes = Math.max(
    0,
    Math.floor((now - new Date(createdAtISO).getTime()) / 60000)
  );

  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

export function PedidosBoard() {
  const { orders, isLoading, refresh } = usePendingOrders();
  const { printReceipt, printMessage, ReceiptLayer } = useReceiptPrint();

  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [, startTransition] = useTransition();

  // Mantém o "tempo de espera" atualizado mesmo entre os ciclos de polling.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const visibleOrders = orders.filter((order) => !hiddenIds.has(order.id));

  function handleCompleteAndPrint(orderId: string) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;

    setError(null);
    setCompletingId(orderId);

    // a) Impressão térmica da comanda (CSS Print / window.print()).
    printReceipt(
      toKitchenReceiptData({
        ...order,
        createdAt: new Date(order.createdAt),
      })
    );

    // c) Optimistic UI: o card some imediatamente da tela.
    setHiddenIds((current) => new Set(current).add(orderId));

    startTransition(async () => {
      // b) Server Action move o pedido para COMPLETED.
      const result = await completeOrder(orderId);
      setCompletingId(null);

      if (result.error) {
        setError(result.error);
        setHiddenIds((current) => {
          const next = new Set(current);
          next.delete(orderId);
          return next;
        });
        return;
      }

      refresh();
    });
  }

  return (
    <>
      {ReceiptLayer}

      {(error || printMessage) && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error ?? printMessage}
        </p>
      )}

      {isLoading && orders.length === 0 ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-16 text-stone-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando pedidos...
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
          <UtensilsCrossed className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-3 font-medium text-stone-600">
            Nenhum pedido pendente
          </p>
          <p className="mt-1 text-sm text-stone-400">
            Novos pedidos aparecem aqui automaticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleOrders.map((order) => {
            const waitMinutes = Math.floor(
              (now - new Date(order.createdAt).getTime()) / 60000
            );
            const isLate = waitMinutes >= 10;
            const isCompleting = completingId === order.id;

            return (
              <div
                key={order.id}
                className="flex flex-col rounded-xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 p-4">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-semibold text-stone-800">
                      <User className="h-4 w-4 text-coffee-600" />
                      {order.customerName}
                    </p>
                    {order.waiterName && (
                      <p className="mt-0.5 text-xs text-stone-500">
                        Garçom/Mesa: {order.waiterName}
                      </p>
                    )}
                    <p className="mt-0.5 font-mono text-xs text-stone-400">
                      #{formatOrderId(order.id)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                      isLate
                        ? "bg-red-100 text-red-700"
                        : "bg-stone-100 text-stone-600"
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {formatWaitTime(order.createdAt, now)}
                  </span>
                </div>

                <ul className="flex-1 space-y-1.5 p-4">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex gap-2 text-sm text-stone-700">
                      <span className="font-bold text-coffee-700">
                        {item.quantity}x
                      </span>
                      <span>{item.product.title}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-stone-100 p-4">
                  <span className="text-sm font-semibold text-stone-700">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <Button
                    type="button"
                    onClick={() => handleCompleteAndPrint(order.id)}
                    disabled={isCompleting}
                    className="bg-coffee-600 text-white hover:bg-coffee-700"
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Concluindo...
                      </>
                    ) : (
                      <>
                        <Printer className="h-4 w-4" />
                        Imprimir e Concluir
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
