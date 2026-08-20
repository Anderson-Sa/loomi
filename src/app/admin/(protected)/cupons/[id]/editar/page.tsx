import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CouponForm } from "../../CouponForm";
import { updateCoupon } from "../../actions";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function EditarCupomPage({
  params,
}: PageProps<"/admin/cupons/[id]/editar">) {
  const { id } = await params;

  const cupom = await prisma.coupon.findUnique({ where: { id } });
  if (!cupom) notFound();

  const boundUpdate = updateCoupon.bind(null, cupom.id);

  return (
    <div>
      <Link href="/admin/cupons" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Editar cupom</h1>
      <CouponForm
        action={boundUpdate}
        submitLabel="Salvar alterações"
        initialData={{
          code: cupom.code,
          discountPercent: cupom.discountPercent,
          maxUses: cupom.maxUses,
          expiresAt: cupom.expiresAt ? toDateInputValue(cupom.expiresAt) : null,
          active: cupom.active,
        }}
      />
    </div>
  );
}
