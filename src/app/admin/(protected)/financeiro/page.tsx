import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/format";
import { RevenueChart } from "./RevenueChart";

const MONTH_LABEL = new Intl.DateTimeFormat("pt-BR", { month: "short" });
const DATE_LABEL = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [paidOrders, monthOrders, recentOrders, topItems] = await Promise.all([
    prisma.order.findMany({
      where: { status: "paid" },
      select: { totalCents: true, createdAt: true },
    }),
    prisma.order.aggregate({
      where: { status: "paid", createdAt: { gte: startOfMonth(now) } },
      _sum: { totalCents: true },
      _count: true,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { order: { status: "paid" } },
      _sum: { quantity: true, priceCents: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const totalRevenueCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);
  const totalPaidOrders = paidOrders.length;
  const monthRevenueCents = monthOrders._sum.totalCents ?? 0;
  const monthPaidOrders = monthOrders._count;
  const avgTicketCents = totalPaidOrders > 0 ? Math.round(totalRevenueCents / totalPaidOrders) : 0;

  const monthBuckets: { label: string; totalCents: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const bucketDate = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
    const bucketTotal = paidOrders
      .filter(
        (o) =>
          o.createdAt.getFullYear() === bucketDate.getFullYear() &&
          o.createdAt.getMonth() === bucketDate.getMonth()
      )
      .reduce((sum, o) => sum + o.totalCents, 0);
    monthBuckets.push({ label: MONTH_LABEL.format(bucketDate), totalCents: bucketTotal });
  }

  const productIds = topItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const productNameById = new Map(products.map((p) => [p.id, p.name]));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Financeiro</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Faturamento total</p>
          <p className="mt-1 text-2xl font-bold">{formatPriceCents(totalRevenueCents)}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Faturamento no mês</p>
          <p className="mt-1 text-2xl font-bold">{formatPriceCents(monthRevenueCents)}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Pedidos pagos no mês</p>
          <p className="mt-1 text-2xl font-bold">{monthPaidOrders}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Ticket médio</p>
          <p className="mt-1 text-2xl font-bold">{formatPriceCents(avgTicketCents)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Faturamento por mês
        </h2>
        {totalRevenueCents === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-400">
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <RevenueChart points={monthBuckets} />
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Produtos mais vendidos
          </h2>
          {topItems.length === 0 ? (
            <p className="text-sm text-neutral-400">Sem vendas registradas ainda.</p>
          ) : (
            <ul className="space-y-3">
              {topItems.map((item) => (
                <li key={item.productId} className="flex items-center justify-between text-sm">
                  <span>{productNameById.get(item.productId) ?? "Produto removido"}</span>
                  <span className="text-neutral-500">
                    {item._sum.quantity} un · {formatPriceCents(item._sum.priceCents ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Pedidos recentes
          </h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-400">Nenhum pedido ainda.</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p>{order.customerName || order.customerEmail || "Cliente"}</p>
                    <p className="text-xs text-neutral-400">{DATE_LABEL.format(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPriceCents(order.totalCents)}</p>
                    <p
                      className={`text-xs ${
                        order.status === "paid" ? "text-green-600" : "text-neutral-400"
                      }`}
                    >
                      {order.status === "paid" ? "pago" : "pendente"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Quer ver ou editar os produtos?{" "}
        <Link href="/admin/produtos" className="text-brand hover:underline">
          Ir para Produtos
        </Link>
      </p>
    </div>
  );
}
