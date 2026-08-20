import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../ProductForm";
import { updateProduct } from "../../actions";

export default async function EditarProdutoPage({
  params,
}: PageProps<"/admin/produtos/[id]/editar">) {
  const { id } = await params;

  const [produto, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!produto) notFound();

  const boundUpdate = updateProduct.bind(null, produto.id);

  return (
    <div>
      <Link href="/admin/produtos" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Editar produto</h1>
      <ProductForm
        action={boundUpdate}
        categories={categories}
        submitLabel="Salvar alterações"
        initialData={{
          name: produto.name,
          slug: produto.slug,
          description: produto.description,
          priceCents: produto.priceCents,
          promoPriceCents: produto.promoPriceCents,
          sizes: produto.sizes,
          audience: produto.audience,
          categoryId: produto.categoryId,
          stock: produto.stock,
          imageUrl: produto.imageUrl,
          featured: produto.featured,
          images: produto.images,
        }}
      />
    </div>
  );
}
