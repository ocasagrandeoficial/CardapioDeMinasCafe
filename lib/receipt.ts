export type KitchenReceiptItem = {
  quantity: number;
  title: string;
  unitPrice: number;
};

export type KitchenReceiptData = {
  orderId: string;
  customerName: string;
  createdAt: string;
  totalAmount: number;
  items: KitchenReceiptItem[];
};

type OrderForReceipt = {
  id: string;
  customerName: string;
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
