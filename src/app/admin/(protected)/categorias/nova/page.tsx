import Link from "next/link";
import { CategoryForm } from "../CategoryForm";
import { createCategory } from "../actions";

export default function NovaCategoriaPage() {
  return (
    <div>
      <Link href="/admin/categorias" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Nova categoria</h1>
      <CategoryForm action={createCategory} submitLabel="Criar categoria" />
    </div>
  );
}
