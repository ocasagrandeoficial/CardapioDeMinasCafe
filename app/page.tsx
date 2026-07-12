import { menu } from "@/data/menu";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Header categories={menu} />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-stone-200 bg-white">
          <div className="container flex flex-col items-center gap-4 py-16 text-center">
            <span className="rounded-full bg-coffee-100 px-4 py-1 text-sm font-medium text-coffee-700">
              Cafeteria e Empório
            </span>
            <h1 className="font-serif text-4xl font-bold text-stone-800 sm:text-5xl">
              Dê Minas Café
            </h1>
            <p className="max-w-xl text-base text-stone-500">
              Sabores mineiros preparados com carinho. Explore nosso cardápio e
              descubra cafés especiais, salgados, sobremesas e produtos do
              empório.
            </p>
          </div>
        </section>

        {/* Seções por categoria */}
        <div className="container py-12">
          {menu.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-20 py-10"
            >
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-serif text-3xl font-bold text-stone-800">
                  {category.label}
                </h2>
                <span className="h-px flex-1 bg-stone-200" />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
