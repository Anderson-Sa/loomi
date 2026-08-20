import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CampaignForm } from "../../CampaignForm";
import { updateCampaign } from "../../actions";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function EditarCampanhaPage({
  params,
}: PageProps<"/admin/campanhas/[id]/editar">) {
  const { id } = await params;

  const [campaign, products] = await Promise.all([
    prisma.campaign.findUnique({ where: { id }, include: { products: true } }),
    prisma.product.findMany({
      select: { id: true, name: true, campaignId: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!campaign) notFound();

  const boundUpdate = updateCampaign.bind(null, campaign.id);

  return (
    <div>
      <Link href="/admin/campanhas" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Editar campanha</h1>
      <CampaignForm
        action={boundUpdate}
        products={products}
        submitLabel="Salvar alterações"
        initialData={{
          name: campaign.name,
          slug: campaign.slug,
          discountPercent: campaign.discountPercent,
          startsAt: toDateInputValue(campaign.startsAt),
          endsAt: toDateInputValue(campaign.endsAt),
          active: campaign.active,
          selectedProductIds: campaign.products.map((p) => p.id),
        }}
      />
    </div>
  );
}
