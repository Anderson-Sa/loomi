import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/format";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function ProdutosAdminPage() {
  const produtos = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Novo produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <p className="text-neutral-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Público</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Destaque</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-100">
                        <Image
                          src={produto.imageUrl}
                          alt={produto.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{produto.name}</p>
                        <p className="text-xs text-neutral-500">{produto.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{produto.category.name}</td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{produto.audience}</td>
                  <td className="px-4 py-3">
                    {produto.promoPriceCents ? (
                      <>
                        <span className="mr-1 text-neutral-400 line-through">
                          {formatPriceCents(produto.priceCents)}
                        </span>
                        <span className="font-semibold text-brand">
                          {formatPriceCents(produto.promoPriceCents)}
                        </span>
                      </>
                    ) : (
                      formatPriceCents(produto.priceCents)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {produto.featured && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                        destaque
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/produtos/${produto.id}/editar`}
                        className="text-sm font-medium text-neutral-700 hover:text-brand"
                      >
                        Editar
                      </Link>
                      <DeleteProductButton id={produto.id} name={produto.name} />
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
