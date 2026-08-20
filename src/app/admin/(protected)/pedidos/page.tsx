import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/format";
import { MarkShippedButton } from "./MarkShippedButton";

const DATE_LABEL = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatAddress(order: {
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
}) {
  if (!order.shippingLine1) return null;
  const parts = [
    order.shippingLine1,
    order.shippingLine2,
    order.shippingCity && order.shippingState
      ? `${order.shippingCity}/${order.shippingState}`
      : order.shippingCity,
    order.shippingPostalCode,
  ].filter(Boolean);
  return parts.join(", ");
}

export default async function PedidosAdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-neutral-500">Nenhum pedido ainda.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const address = formatAddress(order);
            return (
              <div key={order.id} className="rounded-lg border border-neutral-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {order.customerName || order.customerEmail || "Cliente"}
                    </p>
                    <p className="text-xs text-neutral-400">{DATE_LABEL.format(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {order.status === "paid" ? "pago" : "pendente"}
                    </span>
                    {order.status === "paid" &&
                      (order.shippedAt ? (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          enviado em {DATE_LABEL.format(order.shippedAt)}
                        </span>
                      ) : (
                        <MarkShippedButton orderId={order.id} />
                      ))}
                  </div>
                </div>

                <ul className="mt-3 space-y-1 text-sm text-neutral-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.product.name} ({item.size}) —{" "}
                      {formatPriceCents(item.priceCents * item.quantity)}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                  <p className="text-sm text-neutral-500">
                    {address ? (
                      <>
                        <span className="font-medium text-neutral-700">Entregar em: </span>
                        {address}
                      </>
                    ) : (
                      "Endereço ainda não informado"
                    )}
                  </p>
                  <p className="font-bold">{formatPriceCents(order.totalCents)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
