import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/format";
import { AddToCartForm } from "@/components/AddToCartForm";

export default async function ProdutoPage({
  params,
}: PageProps<"/produto/[slug]">) {
  const { slug } = await params;

  const produto = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!produto) notFound();

  const sizes = produto.sizes.split(",").map((s) => s.trim());

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={produto.imageUrl}
            alt={produto.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="max-w-md">
          <p className="text-sm uppercase tracking-wide text-neutral-500">
            {produto.category.name}
          </p>
          <h1 className="mt-1 text-2xl font-semibold">{produto.name}</h1>
          <p className="mt-3 text-xl">{formatPriceCents(produto.priceCents)}</p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            {produto.description}
          </p>

          <div className="mt-8">
            <AddToCartForm
              productId={produto.id}
              slug={produto.slug}
              name={produto.name}
              imageUrl={produto.imageUrl}
              priceCents={produto.priceCents}
              sizes={sizes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
