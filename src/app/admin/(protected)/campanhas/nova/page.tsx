import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CampaignForm } from "../CampaignForm";
import { createCampaign } from "../actions";

export default async function NovaCampanhaPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, campaignId: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <Link href="/admin/campanhas" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Nova campanha</h1>
      <CampaignForm action={createCampaign} products={products} submitLabel="Criar campanha" />
    </div>
  );
}
