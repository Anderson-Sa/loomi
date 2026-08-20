import { prisma } from "@/lib/prisma";

export async function validateCoupon(rawCode: string) {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { error: "Informe um código de cupom." } as const;

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) return { error: "Cupom não encontrado." } as const;
  if (!coupon.active) return { error: "Esse cupom não está mais ativo." } as const;
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { error: "Esse cupom expirou." } as const;
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { error: "Esse cupom já atingiu o limite de usos." } as const;
  }

  return { coupon } as const;
}
