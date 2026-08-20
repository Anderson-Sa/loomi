"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminSessionValid } from "@/lib/adminSession";
import { saveUploadedImage } from "@/lib/upload";
import { slugify } from "@/lib/slugify";

export type ProductFormState = { error?: string } | undefined;

function parseReaisToCents(value: FormDataEntryValue | null): number | null {
  if (!value) return null;
  const normalized = String(value).replace(",", ".").trim();
  if (!normalized) return null;
  const reais = Number(normalized);
  if (!Number.isFinite(reais) || reais < 0) return null;
  return Math.round(reais * 100);
}

async function resolveImageUrl(formData: FormData, currentImageUrl?: string) {
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    return saveUploadedImage(file);
  }
  const url = String(formData.get("imageUrl") ?? "").trim();
  if (url) return url;
  return currentImageUrl ?? null;
}

async function buildProductData(formData: FormData, currentImageUrl?: string) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sizes = String(formData.get("sizes") ?? "").trim();
  const audience = String(formData.get("audience") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const stockRaw = String(formData.get("stock") ?? "100").trim();

  if (!name) return { error: "Informe o nome do produto." } as const;
  if (!description) return { error: "Informe a descrição do produto." } as const;
  if (!sizes) return { error: "Informe ao menos um tamanho." } as const;
  if (!["feminino", "masculino", "infantil"].includes(audience)) {
    return { error: "Selecione um público válido." } as const;
  }
  if (!categoryId) return { error: "Selecione uma categoria." } as const;

  const priceCents = parseReaisToCents(formData.get("price"));
  if (priceCents === null || priceCents <= 0) {
    return { error: "Informe um preço válido." } as const;
  }

  const promoPriceRaw = formData.get("promoPrice");
  let promoPriceCents: number | null = null;
  if (promoPriceRaw && String(promoPriceRaw).trim()) {
    promoPriceCents = parseReaisToCents(promoPriceRaw);
    if (promoPriceCents === null || promoPriceCents <= 0) {
      return { error: "Preço promocional inválido." } as const;
    }
    if (promoPriceCents >= priceCents) {
      return { error: "O preço promocional deve ser menor que o preço normal." } as const;
    }
  }

  const stock = Number.isFinite(Number(stockRaw)) ? Math.max(0, Math.trunc(Number(stockRaw))) : 100;

  let imageUrl: string | null;
  try {
    imageUrl = await resolveImageUrl(formData, currentImageUrl);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Falha ao salvar a imagem." } as const;
  }
  if (!imageUrl) return { error: "Envie uma imagem ou informe a URL de uma imagem." } as const;

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);
  if (!slug) return { error: "Não foi possível gerar um slug válido para esse nome." } as const;

  return {
    data: {
      name,
      slug,
      description,
      sizes,
      audience,
      categoryId,
      priceCents,
      promoPriceCents,
      stock,
      imageUrl,
      featured: formData.get("featured") === "on",
    },
  } as const;
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const result = await buildProductData(formData);
  if ("error" in result) return { error: result.error };

  const existing = await prisma.product.findUnique({ where: { slug: result.data.slug } });
  if (existing) return { error: "Já existe um produto com esse nome/slug." };

  await prisma.product.create({ data: result.data });

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) return { error: "Produto não encontrado." };

  const result = await buildProductData(formData, current.imageUrl);
  if ("error" in result) return { error: result.error };

  if (result.data.slug !== current.slug) {
    const existing = await prisma.product.findUnique({ where: { slug: result.data.slug } });
    if (existing) return { error: "Já existe um produto com esse nome/slug." };
  }

  await prisma.product.update({ where: { id }, data: result.data });

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  revalidatePath(`/produto/${result.data.slug}`);
  redirect("/admin/produtos");
}

export async function deleteProduct(id: string) {
  if (!(await isAdminSessionValid())) throw new Error("Sessão expirada. Faça login novamente.");

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    throw new Error(
      "Não foi possível excluir: esse produto já tem pedidos vinculados."
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/produtos");
}
