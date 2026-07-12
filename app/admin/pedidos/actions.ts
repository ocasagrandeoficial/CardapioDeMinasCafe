"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export type OrderActionState = {
  error?: string;
  success?: boolean;
  orderId?: string;
};

export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
};

export async function createOrder(
  customerName: string,
  items: CreateOrderItemInput[]
): Promise<OrderActionState> {
  await requireAdmin();

  const name = customerName.trim();
  if (!name) {
    return { error: "Informe o nome do cliente." };
  }

  if (items.length === 0) {
    return { error: "Adicione pelo menos um item à comanda." };
  }

  const productIds = [...new Set(items.map((item) => item.productId))];

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isAvailable: true },
  });

  if (products.length !== productIds.length) {
    return { error: "Um ou mais produtos não estão disponíveis." };
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId)!;
    const quantity = Math.max(1, Math.floor(item.quantity));

    return {
      productId: product.id,
      quantity,
      priceAtTime: product.price,
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.priceAtTime * item.quantity,
    0
  );

  try {
    const order = await prisma.order.create({
      data: {
        customerName: name,
        totalAmount,
        items: { create: orderItems },
      },
    });

    revalidatePath("/admin/pedidos/historico");
    revalidatePath("/admin");

    return { success: true, orderId: order.id };
  } catch {
    return { error: "Não foi possível finalizar o pedido." };
  }
}
