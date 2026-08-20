import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/format";
import { isCampaignActiveNow } from "@/lib/pricing";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default async function AdminHomePage() {
  const now = new Date();

  const [monthRevenue, productCount, campaigns, lowStockCount] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "paid", createdAt: { gte: startOfMonth(now) } },
      _sum: { totalCents: true },
    }),
    prisma.product.count(),
    prisma.campaign.findMany({
      select: { active: true, startsAt: true, endsAt: true },
    }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
  ]);

  const activeCampaignCount = campaigns.filter((c) => isCampaignActiveNow(c)).length;

  const cards = [
    {
      href: "/admin/financeiro",
      title: "Financeiro",
      description: "Faturamento, pedidos e produtos mais vendidos.",
      stat: formatPriceCents(monthRevenue._sum.totalCents ?? 0),
      statLabel: "faturados este mês",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
          <path d="M3 3v18h18" />
          <path d="M7 15l4-5 3 3 5-7" />
        </svg>
      ),
    },
    {
      href: "/admin/produtos",
      title: "Produtos",
      description: "Cadastre roupas, edite preços, fotos e estoque.",
      stat: String(productCount),
      statLabel: "produtos cadastrados",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
          <path d="M20 8l-8-5-8 5v8l8 5 8-5V8z" />
          <path d="M4 8l8 5 8-5M12 13v8" />
        </svg>
      ),
    },
    {
      href: "/admin/campanhas",
      title: "Campanhas",
      description: "Crie promoções com desconto e período automático.",
      stat: String(activeCampaignCount),
      statLabel: activeCampaignCount === 1 ? "campanha ativa agora" : "campanhas ativas agora",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
          <path d="M20.59 13.41 11 3.83 3.83 11l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" />
          <circle cx="7.5" cy="7.5" r="1.25" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Olá! 👋</h1>
      <p className="mt-1 text-neutral-500">Aqui está um resumo rápido da sua loja.</p>

      {lowStockCount > 0 && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {lowStockCount} produto{lowStockCount === 1 ? "" : "s"} com estoque baixo (5 unidades ou menos).{" "}
          <Link href="/admin/produtos" className="font-medium underline">
            Ver produtos
          </Link>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
              {card.icon}
            </div>
            <h2 className="mt-4 text-lg font-bold group-hover:text-brand">{card.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{card.description}</p>
            <p className="mt-4 text-xl font-bold">{card.stat}</p>
            <p className="text-xs text-neutral-400">{card.statLabel}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/produtos/novo"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Novo produto
        </Link>
        <Link
          href="/admin/campanhas/nova"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-brand hover:text-brand"
        >
          + Nova campanha
        </Link>
      </div>
    </div>
  );
}
