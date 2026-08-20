import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isCampaignActiveNow } from "@/lib/pricing";
import { DeleteCampaignButton } from "./DeleteCampaignButton";

function statusLabel(campaign: { active: boolean; startsAt: Date; endsAt: Date }) {
  if (isCampaignActiveNow(campaign)) return { text: "ativa agora", className: "bg-green-100 text-green-700" };
  if (!campaign.active) return { text: "desativada", className: "bg-neutral-100 text-neutral-500" };
  if (campaign.startsAt.getTime() > Date.now()) return { text: "agendada", className: "bg-amber-100 text-amber-700" };
  return { text: "encerrada", className: "bg-neutral-100 text-neutral-500" };
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function CampanhasAdminPage() {
  const campaigns = await prisma.campaign.findMany({
    include: { products: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campanhas</h1>
        <Link
          href="/admin/campanhas/nova"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Nova campanha
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-neutral-500">Nenhuma campanha cadastrada ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Campanha</th>
                <th className="px-4 py-3">Desconto</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3">Produtos</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {campaigns.map((campaign) => {
                const status = statusLabel(campaign);
                return (
                  <tr key={campaign.id}>
                    <td className="px-4 py-3 font-medium">{campaign.name}</td>
                    <td className="px-4 py-3 text-brand font-semibold">{campaign.discountPercent}%</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {dateFormatter.format(campaign.startsAt)} – {dateFormatter.format(campaign.endsAt)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{campaign.products.length}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/campanhas/${campaign.id}/editar`}
                          className="text-sm font-medium text-neutral-700 hover:text-brand"
                        >
                          Editar
                        </Link>
                        <DeleteCampaignButton id={campaign.id} name={campaign.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
