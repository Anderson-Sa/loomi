import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const categorias = await prisma.category.findMany({
    include: { products: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Moda com identidade.
        </h1>
        <p className="mt-2 max-w-xl text-neutral-600">
          Peças selecionadas para o seu dia a dia. Novas coleções toda semana.
        </p>
      </section>

      {categorias.map((categoria) => (
        <section key={categoria.id} className="mb-14">
          <h2 className="mb-5 text-lg font-medium">{categoria.name}</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {categoria.products.map((produto) => (
              <ProductCard
                key={produto.id}
                slug={produto.slug}
                name={produto.name}
                imageUrl={produto.imageUrl}
                priceCents={produto.priceCents}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
