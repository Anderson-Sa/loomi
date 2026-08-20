import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export async function generateMetadata({
  searchParams,
}: PageProps<"/busca">): Promise<Metadata> {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return {
    title: query ? `Busca por "${query}" — Loomi` : "Buscar produtos — Loomi",
    robots: { index: false, follow: true },
  };
}

export default async function BuscaPage({ searchParams }: PageProps<"/busca">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const produtos = query
    ? await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        include: { campaign: true },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">
        {query ? (
          <>
            Resultados para <span className="text-brand">&quot;{query}&quot;</span>
          </>
        ) : (
          "Buscar produtos"
        )}
      </h1>

      {query && (
        <p className="mt-1 text-sm text-neutral-500">
          {produtos.length} produto{produtos.length === 1 ? "" : "s"} encontrado
          {produtos.length === 1 ? "" : "s"}
        </p>
      )}

      {query && produtos.length === 0 && (
        <p className="mt-10 text-neutral-500">
          Nenhum produto encontrado. Tente buscar por outro termo.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {produtos.map((produto) => (
          <ProductCard
            key={produto.id}
            slug={produto.slug}
            name={produto.name}
            imageUrl={produto.imageUrl}
            priceCents={produto.priceCents}
            promoPriceCents={produto.promoPriceCents}
            campaign={produto.campaign}
          />
        ))}
      </div>
    </div>
  );
}
