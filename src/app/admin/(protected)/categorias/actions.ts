"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminSessionValid } from "@/lib/adminSession";
import { slugify } from "@/lib/slugify";

export type CategoryFormState = { error?: string } | undefined;

function buildCategoryData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Informe o nome da categoria." } as const;

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);
  if (!slug) return { error: "Não foi possível gerar um slug válido." } as const;

  return { data: { name, slug } } as const;
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const result = buildCategoryData(formData);
  if ("error" in result) return { error: result.error };

  const existing = await prisma.category.findUnique({ where: { slug: result.data.slug } });
  if (existing) return { error: "Já existe uma categoria com esse nome." };

  await prisma.category.create({ data: result.data });

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return { error: "Categoria não encontrada." };

  const result = buildCategoryData(formData);
  if ("error" in result) return { error: result.error };

  if (result.data.slug !== current.slug) {
    const existing = await prisma.category.findUnique({ where: { slug: result.data.slug } });
    if (existing) return { error: "Já existe uma categoria com esse nome." };
  }

  await prisma.category.update({ where: { id }, data: result.data });

  revalidatePath("/");
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: string) {
  if (!(await isAdminSessionValid())) throw new Error("Sessão expirada. Faça login novamente.");

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new Error("Não é possível excluir: existem produtos nessa categoria.");
  }

  revalidatePath("/");
  revalidatePath("/admin/categorias");
}
