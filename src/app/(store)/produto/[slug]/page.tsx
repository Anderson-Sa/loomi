import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatInstallments, formatPriceCents } from "@/lib/format";
import { getAudienceName } from "@/lib/audience";
import { getEffectivePriceCents } from "@/lib/pricing";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ProductGallery } from "@/components/ProductGallery";

export async function generateMetadata({
  params,
}: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  const produto = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, imageUrl: true, priceCents: true, promoPriceCents: true },
  });

  if (!produto) return { title: "Produto não encontrado — Loomi" };

  const price = formatPriceCents(produto.promoPriceCents ?? produto.priceCents);
  const title = `${produto.name} — ${price} | Loomi`;

  return {
    title,
    description: produto.description,
    openGraph: {
      title,
      description: produto.description,
      images: [{ url: produto.imageUrl }],
    },
  };
}

export default async function ProdutoPage({
  params,
}: PageProps<"/produto/[slug]">) {
  const { slug } = await params;

  const produto = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, campaign: true, images: { orderBy: { position: "asc" } } },
  });

  if (!produto) notFound();

  const sizes = produto.sizes.split(",").map((s) => s.trim());
  const galleryImages = [produto.imageUrl, ...produto.images.map((img) => img.url)];
  const effectivePriceCents = getEffectivePriceCents(produto);
  const onSale = effectivePriceCents < produto.priceCents;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 text-xs text-neutral-500">
        <Link href="/" className="hover:text-brand">
          Vitrine
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/#${produto.audience}`} className="hover:text-brand">
          {getAudienceName(produto.audience)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">{produto.category.name}</span>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">{produto.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <ProductGallery images={galleryImages} alt={produto.name} />

        <div className="max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {produto.category.name}
          </p>
          <h1 className="mt-1 text-2xl font-semibold">{produto.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            {onSale && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPriceCents(produto.priceCents)}
              </span>
            )}
            <span className="text-3xl font-bold text-brand">
              {formatPriceCents(effectivePriceCents)}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            {formatInstallments(effectivePriceCents)}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            {produto.description}
          </p>

          <div className="mt-8">
            <AddToCartForm
              productId={produto.id}
              slug={produto.slug}
              name={produto.name}
              imageUrl={produto.imageUrl}
              priceCents={effectivePriceCents}
              sizes={sizes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
