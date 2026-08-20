import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export default async function CategoriasAdminPage() {
  const categorias = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Link
          href="/admin/categorias/nova"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Nova categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="text-neutral-500">Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Produtos</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="px-4 py-3 font-medium">{categoria.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">{categoria.slug}</td>
                  <td className="px-4 py-3 text-neutral-600">{categoria._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/categorias/${categoria.id}/editar`}
                        className="text-sm font-medium text-neutral-700 hover:text-brand"
                      >
                        Editar
                      </Link>
                      <DeleteCategoryButton id={categoria.id} name={categoria.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
