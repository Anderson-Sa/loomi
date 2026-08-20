"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminSessionValid } from "@/lib/adminSession";
import { slugify } from "@/lib/slugify";

export type CampaignFormState = { error?: string } | undefined;

function parseDateInput(value: FormDataEntryValue | null, endOfDay: boolean) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const date = new Date(`${raw}T${endOfDay ? "23:59:59" : "00:00:00"}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildCampaignData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const discountPercent = Number(formData.get("discountPercent"));
  const startsAt = parseDateInput(formData.get("startsAt"), false);
  const endsAt = parseDateInput(formData.get("endsAt"), true);

  if (!name) return { error: "Informe o nome da campanha." } as const;
  if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent >= 100) {
    return { error: "Informe um desconto entre 1% e 99%." } as const;
  }
  if (!startsAt || !endsAt) return { error: "Informe o período da campanha." } as const;
  if (endsAt < startsAt) return { error: "A data final não pode ser antes da inicial." } as const;

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);
  if (!slug) return { error: "Não foi possível gerar um slug válido." } as const;

  const productIds = formData.getAll("productIds").map(String);

  return {
    data: {
      name,
      slug,
      discountPercent: Math.round(discountPercent),
      startsAt,
      endsAt,
      active: formData.get("active") === "on",
    },
    productIds,
  } as const;
}

export async function createCampaign(
  _prevState: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const result = buildCampaignData(formData);
  if ("error" in result) return { error: result.error };

  const existing = await prisma.campaign.findUnique({ where: { slug: result.data.slug } });
  if (existing) return { error: "Já existe uma campanha com esse nome." };

  const campaign = await prisma.campaign.create({ data: result.data });
  if (result.productIds.length > 0) {
    await prisma.product.updateMany({
      where: { id: { in: result.productIds } },
      data: { campaignId: campaign.id },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/campanhas");
  redirect("/admin/campanhas");
}

export async function updateCampaign(
  id: string,
  _prevState: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  if (!(await isAdminSessionValid())) return { error: "Sessão expirada. Faça login novamente." };

  const current = await prisma.campaign.findUnique({ where: { id } });
  if (!current) return { error: "Campanha não encontrada." };

  const result = buildCampaignData(formData);
  if ("error" in result) return { error: result.error };

  if (result.data.slug !== current.slug) {
    const existing = await prisma.campaign.findUnique({ where: { slug: result.data.slug } });
    if (existing) return { error: "Já existe uma campanha com esse nome." };
  }

  await prisma.campaign.update({ where: { id }, data: result.data });

  await prisma.product.updateMany({
    where: { campaignId: id, id: { notIn: result.productIds } },
    data: { campaignId: null },
  });
  if (result.productIds.length > 0) {
    await prisma.product.updateMany({
      where: { id: { in: result.productIds } },
      data: { campaignId: id },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/campanhas");
  redirect("/admin/campanhas");
}

export async function deleteCampaign(id: string) {
  if (!(await isAdminSessionValid())) throw new Error("Sessão expirada. Faça login novamente.");

  await prisma.product.updateMany({ where: { campaignId: id }, data: { campaignId: null } });
  await prisma.campaign.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/campanhas");
}
