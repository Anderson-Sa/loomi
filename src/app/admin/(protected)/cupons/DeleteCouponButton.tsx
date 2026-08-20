"use client";

import { useState, useTransition } from "react";
import { deleteCoupon } from "./actions";

export function DeleteCouponButton({ id, code }: { id: string; code: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm(`Excluir o cupom "${code}"?`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteCoupon(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao excluir.");
      }
    });
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        {pending ? "Excluindo..." : "Excluir"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
