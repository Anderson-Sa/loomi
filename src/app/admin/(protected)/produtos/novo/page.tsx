import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";

export default async function NovoProdutoPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <Link href="/admin/produtos" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Novo produto</h1>
      <ProductForm action={createProduct} categories={categories} submitLabel="Criar produto" />
    </div>
  );
}
