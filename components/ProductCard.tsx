import Image from "next/image";

import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: {
    title: string;
    description: string;
    imageUrl: string;
    price: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      {/* Imagem no topo com cantos arredondados */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-stone-800">
            {product.title}
          </h3>
          <span className="whitespace-nowrap text-base font-semibold text-coffee-700">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-1 text-sm text-stone-500">{product.description}</p>
      </div>
    </article>
  );
}
