import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    coupon: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { validateCoupon } from "./coupon";

const findUnique = vi.mocked(prisma.coupon.findUnique);

function baseCoupon() {
  return {
    id: "coupon_1",
    code: "PROMO10",
    discountPercent: 10,
    maxUses: null,
    usedCount: 0,
    expiresAt: null,
    active: true,
    createdAt: new Date(),
  };
}

describe("validateCoupon", () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it("rejeita código vazio sem consultar o banco", async () => {
    const result = await validateCoupon("   ");
    expect(result).toEqual({ error: "Informe um código de cupom." });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("normaliza o código para maiúsculas e sem espaços na busca", async () => {
    findUnique.mockResolvedValue(baseCoupon());
    await validateCoupon("  promo10 ");
    expect(findUnique).toHaveBeenCalledWith({ where: { code: "PROMO10" } });
  });

  it("rejeita cupom inexistente", async () => {
    findUnique.mockResolvedValue(null);
    const result = await validateCoupon("NAOEXISTE");
    expect(result).toEqual({ error: "Cupom não encontrado." });
  });

  it("rejeita cupom inativo", async () => {
    findUnique.mockResolvedValue({ ...baseCoupon(), active: false });
    const result = await validateCoupon("PROMO10");
    expect(result).toEqual({ error: "Esse cupom não está mais ativo." });
  });

  it("rejeita cupom expirado", async () => {
    findUnique.mockResolvedValue({
      ...baseCoupon(),
      expiresAt: new Date(Date.now() - 1000),
    });
    const result = await validateCoupon("PROMO10");
    expect(result).toEqual({ error: "Esse cupom expirou." });
  });

  it("aceita cupom com data de expiração futura", async () => {
    const coupon = { ...baseCoupon(), expiresAt: new Date(Date.now() + 1000) };
    findUnique.mockResolvedValue(coupon);
    const result = await validateCoupon("PROMO10");
    expect(result).toEqual({ coupon });
  });

  it("rejeita cupom que atingiu o limite de usos", async () => {
    findUnique.mockResolvedValue({ ...baseCoupon(), maxUses: 5, usedCount: 5 });
    const result = await validateCoupon("PROMO10");
    expect(result).toEqual({ error: "Esse cupom já atingiu o limite de usos." });
  });

  it("aceita cupom com usos restantes", async () => {
    const coupon = { ...baseCoupon(), maxUses: 5, usedCount: 4 };
    findUnique.mockResolvedValue(coupon);
    const result = await validateCoupon("PROMO10");
    expect(result).toEqual({ coupon });
  });
});
