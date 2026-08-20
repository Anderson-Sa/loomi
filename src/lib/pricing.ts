type CampaignWindow = {
  active: boolean;
  startsAt: Date;
  endsAt: Date;
};

type CampaignInfo = (CampaignWindow & { discountPercent: number }) | null;

type PricedProduct = {
  priceCents: number;
  promoPriceCents?: number | null;
  campaign?: CampaignInfo;
};

export function isCampaignActiveNow(campaign: CampaignWindow | null) {
  if (!campaign || !campaign.active) return false;
  const now = Date.now();
  return now >= campaign.startsAt.getTime() && now <= campaign.endsAt.getTime();
}

export function getEffectivePriceCents(product: PricedProduct) {
  if (isCampaignActiveNow(product.campaign ?? null)) {
    const campaign = product.campaign!;
    return Math.round(product.priceCents * (1 - campaign.discountPercent / 100));
  }
  return product.promoPriceCents ?? product.priceCents;
}
