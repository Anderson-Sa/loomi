"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminSessionValid } from "@/lib/adminSession";

export type CouponFormState = { error?: string } | undefined;

function buildCouponData(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const discountPercent = Number(formData.get("discountPercent"));
  const maxUsesRaw = String(formData.get("maxUses") ?? "").trim();
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();

  if (!code) return { error: "Informe o código do cupom." } as const;
  if (!/^[A-Z0-9-]+$/.test(code)) {
    return { error: "O código só pode ter letras, números e hífen." } as const;
  }
  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent >= 100) {
    return { error: "Informe um desconto entre 1% e 99%." } as const;
  }

  const maxUses = maxUsesRaw ? Math.trunc(Number(maxUsesRaw)) : null;
  if (maxUsesRaw && (!Number.isFinite(maxUses) || (maxUses ?? 0) <= 0)) {
    return { error: "Limite de usos inválido." } as const;
  }

  const expiresAt = expiresAtRaw ? new Date(`${expiresAtRaw}T23:59:59`) : null;
  if (expiresAtRaw && Number.isNaN(expiresAt?.getTime())) {
    return { error: "Data de validade inválida." } as const;
  }

  return {
    data: {
      code,
      discountPercent: Math.round(discountPercent),
      maxUses,
      expiresAt,
      active: formData.get("active") === "on",
    },
  } as const;
}

export async function createCoupon(
  _prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const result = buildCouponData(formData);
  if ("error" in result) return { error: result.error };

  const existing = await prisma.coupon.findUnique({ where: { code: result.data.code } });
  if (existing) return { error: "Já existe um cupom com esse código." };

  await prisma.coupon.create({ data: result.data });

  revalidatePath("/admin/cupons");
  redirect("/admin/cupons");
}

export async function updateCoupon(
  id: string,
  _prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const current = await prisma.coupon.findUnique({ where: { id } });
  if (!current) return { error: "Cupom não encontrado." };

  const result = buildCouponData(formData);
  if ("error" in result) return { error: result.error };

  if (result.data.code !== current.code) {
    const existing = await prisma.coupon.findUnique({ where: { code: result.data.code } });
    if (existing) return { error: "Já existe um cupom com esse código." };
  }

  await prisma.coupon.update({ where: { id }, data: result.data });

  revalidatePath("/admin/cupons");
  redirect("/admin/cupons");
}

export async function deleteCoupon(id: string) {
  if (!(await isAdminSessionValid())) throw new Error("Sessão expirada. Faça login novamente.");

  await prisma.coupon.delete({ where: { id } });

  revalidatePath("/admin/cupons");
}
