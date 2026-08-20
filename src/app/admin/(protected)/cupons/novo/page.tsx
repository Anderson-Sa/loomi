import Link from "next/link";
import { CouponForm } from "../CouponForm";
import { createCoupon } from "../actions";

export default function NovoCupomPage() {
  return (
    <div>
      <Link href="/admin/cupons" className="text-sm text-neutral-500 hover:text-brand">
        ← Voltar
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold">Novo cupom</h1>
      <CouponForm action={createCoupon} submitLabel="Criar cupom" />
    </div>
  );
}
