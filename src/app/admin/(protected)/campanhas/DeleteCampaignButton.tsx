"use client";

import { useState, useTransition } from "react";
import { deleteCampaign } from "./actions";

export function DeleteCampaignButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm(`Excluir a campanha "${name}"? Os produtos voltam ao preço normal.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteCampaign(id);
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
