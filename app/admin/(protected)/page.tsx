import Link from "next/link";
import { Tags, UtensilsCrossed, EyeOff, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [categoriesCount, productsCount, unavailableCount, recentProducts] =
    await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: false } }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

  const stats = [
    {
      label: "Categorias",
      value: categoriesCount,
      icon: Tags,
      href: "/admin/categorias",
    },
    {
      label: "Produtos",
      value: productsCount,
      icon: UtensilsCrossed,
      href: "/admin/produtos",
    },
    {
      label: "Indisponíveis",
      value: unavailableCount,
      icon: EyeOff,
      href: "/admin/produtos",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-800">
          Dashboard
        </h1>
        <p className="mt-1 text-stone-500">
          Visão geral do catálogo da cafeteria.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-coffee-100 text-coffee-700">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-coffee-500" />
              </div>
              <p className="mt-4 text-3xl font-bold text-stone-800">
                {stat.value}
              </p>
              <p className="text-sm text-stone-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-stone-800">
          Produtos adicionados recentemente
        </h2>
        {recentProducts.length === 0 ? (
          <p className="text-sm text-stone-500">Nenhum produto cadastrado.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {recentProducts.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-stone-800">{product.title}</p>
                  <p className="text-sm text-stone-500">
                    {product.category.name}
                  </p>
                </div>
                <span className="text-sm font-semibold text-coffee-700">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
