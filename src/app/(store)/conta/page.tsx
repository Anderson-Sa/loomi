import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer";
import { formatPriceCents } from "@/lib/format";
import { logout } from "./actions";

const DATE_LABEL = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const metadata = { title: "Minha conta — Loomi" };

export default async function ContaPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/conta/login?redirect=/conta");

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minha conta</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {customer.name} — {customer.email}
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-neutral-600 underline hover:text-black"
          >
            Sair
          </button>
        </form>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Meus pedidos</h2>

      {orders.length === 0 ? (
        <p className="text-sm text-neutral-500">Você ainda não fez nenhum pedido.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-neutral-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-neutral-400">
                  Pedido de {DATE_LABEL.format(order.createdAt)}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {order.status === "paid" ? "pago" : "pendente"}
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-neutral-600">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.product.name} ({item.size})
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="text-sm text-neutral-500">
                  {order.shippedAt ? "Enviado" : order.status === "paid" ? "Em preparação" : "Aguardando pagamento"}
                </span>
                <p className="font-bold">{formatPriceCents(order.totalCents)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
