import { formatDateTime, formatPrice } from "@/lib/format";
import { formatOrderId } from "@/lib/order-period";
import type { KitchenReceiptData } from "@/lib/receipt";

interface KitchenReceiptProps {
  data: KitchenReceiptData;
}

export function KitchenReceipt({ data }: KitchenReceiptProps) {
  const createdAt = new Date(data.createdAt);

  return (
    <div className="w-[300px] bg-white p-3 font-mono text-[11px] leading-tight text-black">
      <p className="text-center text-sm font-bold uppercase tracking-wide">
        Dê Minas Café
      </p>
      <p className="mb-2 text-center text-xs font-semibold uppercase">
        Comanda — Cozinha
      </p>

      <div className="my-2 border-t border-dashed border-black" />

      <p>
        <span className="font-bold">Comanda:</span> #{formatOrderId(data.orderId)}
      </p>
      <p>
        <span className="font-bold">Cliente:</span> {data.customerName}
      </p>
      <p>
        <span className="font-bold">Data:</span> {formatDateTime(createdAt)}
      </p>

      <div className="my-2 border-t border-dashed border-black" />

      <p className="mb-1 font-bold uppercase">Itens</p>
      <ul className="space-y-1">
        {data.items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="shrink-0 font-bold">{item.quantity}x</span>
            <span className="flex-1">{item.title}</span>
          </li>
        ))}
      </ul>

      <div className="my-2 border-t border-dashed border-black" />

      <p className="text-right text-sm font-bold">
        TOTAL: {formatPrice(data.totalAmount)}
      </p>

      <div className="mt-2 border-t border-dashed border-black" />
    </div>
  );
}
