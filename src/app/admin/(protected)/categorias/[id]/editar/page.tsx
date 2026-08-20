import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "../../CategoryForm";
import { updateCategory } from "../../actions";

export default async function EditarCategoriaPage({
  params,
}: PageProps<"/admin/categorias/[id]/editar">) {
  const { id } = await params;

  const categoria = await prisma.category.findUnique({ where: { id } });
  if (!categoria) notFound();

  const boundUpdate = updateCategory.bind(null, categoria.id);

  return (
    <div>
      <Link href="/admin/categorias" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Editar categoria</h1>
      <CategoryForm
        action={boundUpdate}
        submitLabel="Salvar alterações"
        initialData={{ name: categoria.name, slug: categoria.slug }}
      />
    </div>
  );
}
