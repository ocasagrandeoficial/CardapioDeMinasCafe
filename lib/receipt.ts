export type KitchenReceiptItem = {
  quantity: number;
  title: string;
  unitPrice: number;
};

export type KitchenReceiptData = {
  orderId: string;
  customerName: string;
  waiterName?: string | null;
  createdAt: string;
  totalAmount: number;
  items: KitchenReceiptItem[];
};

type OrderForReceipt = {
  id: string;
  customerName: string;
  waiterName?: string | null;
  createdAt: Date;
  totalAmount: number;
  items: {
    quantity: number;
    priceAtTime: number;
    product: { title: string };
  }[];
};

export function toKitchenReceiptData(order: OrderForReceipt): KitchenReceiptData {
  return {
    orderId: order.id,
    customerName: order.customerName,
    waiterName: order.waiterName ?? null,
    createdAt: order.createdAt.toISOString(),
    totalAmount: order.totalAmount,
    items: order.items.map(
      (item): KitchenReceiptItem => ({
        quantity: item.quantity,
        title: item.product.title,
        unitPrice: item.priceAtTime,
      })
    ),
  };
}
