import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteCouponButton } from "./DeleteCouponButton";

const DATE_LABEL = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

function statusFor(coupon: {
  active: boolean;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
}) {
  if (!coupon.active) return { text: "inativo", className: "bg-neutral-100 text-neutral-500" };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { text: "expirado", className: "bg-neutral-100 text-neutral-500" };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { text: "esgotado", className: "bg-neutral-100 text-neutral-500" };
  }
  return { text: "ativo", className: "bg-green-100 text-green-700" };
}

export default async function CuponsAdminPage() {
  const cupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cupons</h1>
        <Link
          href="/admin/cupons/novo"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Novo cupom
        </Link>
      </div>

      {cupons.length === 0 ? (
        <p className="text-neutral-500">Nenhum cupom cadastrado ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Desconto</th>
                <th className="px-4 py-3">Usos</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {cupons.map((cupom) => {
                const status = statusFor(cupom);
                return (
                  <tr key={cupom.id}>
                    <td className="px-4 py-3 font-mono font-medium">{cupom.code}</td>
                    <td className="px-4 py-3 font-semibold text-brand">{cupom.discountPercent}%</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {cupom.usedCount}
                      {cupom.maxUses !== null ? ` / ${cupom.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {cupom.expiresAt ? DATE_LABEL.format(cupom.expiresAt) : "sem validade"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/cupons/${cupom.id}/editar`}
                          className="text-sm font-medium text-neutral-700 hover:text-brand"
                        >
                          Editar
                        </Link>
                        <DeleteCouponButton id={cupom.id} code={cupom.code} />
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
