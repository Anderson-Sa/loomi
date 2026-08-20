import { describe, expect, it } from "vitest";
import { getEffectivePriceCents, isCampaignActiveNow } from "./pricing";

describe("isCampaignActiveNow", () => {
  it("retorna false quando não há campanha", () => {
    expect(isCampaignActiveNow(null)).toBe(false);
  });

  it("retorna false quando a campanha está inativa", () => {
    expect(
      isCampaignActiveNow({
        active: false,
        startsAt: new Date(Date.now() - 1000),
        endsAt: new Date(Date.now() + 1000),
      })
    ).toBe(false);
  });

  it("retorna false antes do início da campanha", () => {
    expect(
      isCampaignActiveNow({
        active: true,
        startsAt: new Date(Date.now() + 60_000),
        endsAt: new Date(Date.now() + 120_000),
      })
    ).toBe(false);
  });

  it("retorna false depois do fim da campanha", () => {
    expect(
      isCampaignActiveNow({
        active: true,
        startsAt: new Date(Date.now() - 120_000),
        endsAt: new Date(Date.now() - 60_000),
      })
    ).toBe(false);
  });

  it("retorna true dentro da janela ativa", () => {
    expect(
      isCampaignActiveNow({
        active: true,
        startsAt: new Date(Date.now() - 60_000),
        endsAt: new Date(Date.now() + 60_000),
      })
    ).toBe(true);
  });
});

describe("getEffectivePriceCents", () => {
  it("usa o preço cheio quando não há promoção nem campanha", () => {
    expect(getEffectivePriceCents({ priceCents: 10_000 })).toBe(10_000);
  });

  it("usa o preço promocional quando definido e não há campanha ativa", () => {
    expect(getEffectivePriceCents({ priceCents: 10_000, promoPriceCents: 8_000 })).toBe(8_000);
  });

  it("prioriza a campanha ativa sobre o preço promocional", () => {
    const price = getEffectivePriceCents({
      priceCents: 10_000,
      promoPriceCents: 9_000,
      campaign: {
        active: true,
        startsAt: new Date(Date.now() - 60_000),
        endsAt: new Date(Date.now() + 60_000),
        discountPercent: 20,
      },
    });
    expect(price).toBe(8_000);
  });

  it("ignora campanha fora da janela e cai no preço promocional", () => {
    const price = getEffectivePriceCents({
      priceCents: 10_000,
      promoPriceCents: 9_000,
      campaign: {
        active: true,
        startsAt: new Date(Date.now() - 120_000),
        endsAt: new Date(Date.now() - 60_000),
        discountPercent: 50,
      },
    });
    expect(price).toBe(9_000);
  });

  it("arredonda o desconto da campanha para o centavo mais próximo", () => {
    const price = getEffectivePriceCents({
      priceCents: 999,
      campaign: {
        active: true,
        startsAt: new Date(Date.now() - 60_000),
        endsAt: new Date(Date.now() + 60_000),
        discountPercent: 33,
      },
    });
    expect(price).toBe(Math.round(999 * 0.67));
  });
});
