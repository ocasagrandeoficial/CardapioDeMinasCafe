"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Check, Clock, Loader2, Printer, User, UtensilsCrossed } from "lucide-react";

import { completeOrder } from "@/app/admin/pedidos/actions";
import { usePendingOrders } from "@/hooks/use-pending-orders";
import { canPrintOnCashierPc } from "@/lib/print";
import { toKitchenReceiptData, type KitchenReceiptData } from "@/lib/receipt";
import { formatOrderId } from "@/lib/order-period";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KitchenReceipt } from "@/components/admin/kitchen-receipt";

// Guarda os IDs já impressos entre reloads da página, evitando reimprimir
// todos os pendentes caso o kiosk seja reiniciado.
const PRINTED_STORAGE_KEY = "dmc:auto-printed-orders";
const RENDER_DELAY_MS = 500; // tempo para o DOM do recibo térmico renderizar

function loadPrintedIds(): Set<string> {
  try {
    const raw = window.localStorage.getItem(PRINTED_STORAGE_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

function persistPrintedIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(
      PRINTED_STORAGE_KEY,
      JSON.stringify([...ids])
    );
  } catch {
    // localStorage indisponível: seguimos apenas em memória.
  }
}

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

  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [, startTransition] = useTransition();

  // --- Impressão automática ---
  const [receiptToPrint, setReceiptToPrint] = useState<KitchenReceiptData | null>(
    null
  );
  const printedIdsRef = useRef<Set<string>>(new Set());
  const queueRef = useRef<KitchenReceiptData[]>([]);
  const isPrintingRef = useRef(false);
  const canAutoPrint = canPrintOnCashierPc();

  // Carrega os IDs já impressos uma única vez, antes de observar o polling.
  useEffect(() => {
    printedIdsRef.current = loadPrintedIds();
  }, []);

  // Mantém o "tempo de espera" atualizado mesmo entre os ciclos de polling.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const processQueue = useCallback(() => {
    if (isPrintingRef.current) return;
    const next = queueRef.current.shift();
    if (!next) return;

    isPrintingRef.current = true;
    setReceiptToPrint(next);
  }, []);

  // Detecta novos pedidos vindos do polling e os enfileira para impressão.
  useEffect(() => {
    if (!canAutoPrint) return;

    const newOrders = orders.filter(
      (order) => !printedIdsRef.current.has(order.id)
    );
    if (newOrders.length === 0) return;

    for (const order of newOrders) {
      // Marcamos como impresso ANTES de imprimir: isso impede impressões
      // duplicadas causadas tanto pelo próximo ciclo de polling quanto pela
      // dupla execução de efeitos no React Strict Mode (dev).
      printedIdsRef.current.add(order.id);
      queueRef.current.push(
        toKitchenReceiptData({
          ...order,
          createdAt: new Date(order.createdAt),
        })
      );
    }

    persistPrintedIds(printedIdsRef.current);
    processQueue();
  }, [orders, canAutoPrint, processQueue]);

  // Dispara a impressão do recibo atual após o DOM térmico renderizar.
  useEffect(() => {
    if (!receiptToPrint) return;

    // ATENÇÃO: para a impressão ocorrer de forma 100% silenciosa (sem o
    // diálogo do navegador e sem clique humano), o Google Chrome do PDV DEVE
    // ser iniciado com a flag `--kiosk-printing`. Ex.:
    //   chrome.exe --kiosk-printing "https://seu-dominio/admin/pedidos"
    // A impressora Epson precisa estar definida como padrão no Windows.
    const printTimer = window.setTimeout(() => {
      window.print();
    }, RENDER_DELAY_MS);

    // Fallback: se o evento `afterprint` não disparar (comum no modo kiosk),
    // liberamos a fila mesmo assim para não travar as próximas impressões.
    const fallbackTimer = window.setTimeout(() => {
      isPrintingRef.current = false;
      setReceiptToPrint(null);
      processQueue();
    }, RENDER_DELAY_MS + 4000);

    return () => {
      window.clearTimeout(printTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [receiptToPrint, processQueue]);

  // Avança a fila assim que a impressão do recibo atual termina.
  useEffect(() => {
    const onAfterPrint = () => {
      isPrintingRef.current = false;
      setReceiptToPrint(null);
      window.setTimeout(processQueue, 300);
    };

    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, [processQueue]);

  const visibleOrders = orders.filter((order) => !hiddenIds.has(order.id));

  function handleComplete(orderId: string) {
    setError(null);
    setCompletingId(orderId);

    // Optimistic UI: o card some imediatamente da tela.
    setHiddenIds((current) => new Set(current).add(orderId));

    startTransition(async () => {
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
      {/* Camada oculta usada apenas pelo @media print (recibo térmico 80mm). */}
      {receiptToPrint && (
        <div className="kitchen-receipt" aria-hidden="true">
          <KitchenReceipt data={receiptToPrint} />
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs text-stone-500">
        <Printer className="h-4 w-4 shrink-0 text-coffee-600" />
        {canAutoPrint ? (
          <span>
            Impressão automática ativa. Novos pedidos são impressos ao chegar.
          </span>
        ) : (
          <span>
            Neste dispositivo a impressão não está disponível. A impressão
            automática funciona no PC do caixa (com a Epson padrão).
          </span>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
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
                    onClick={() => handleComplete(order.id)}
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
                        <Check className="h-4 w-4" />
                        Concluir Pedido
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
