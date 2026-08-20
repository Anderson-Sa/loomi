"use client";

import { useTransition } from "react";
import { markAsShipped } from "./actions";

export function MarkShippedButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => markAsShipped(orderId))}
      className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-brand hover:text-brand disabled:opacity-50"
    >
      {pending ? "Marcando..." : "Marcar como enviado"}
    </button>
  );
}
