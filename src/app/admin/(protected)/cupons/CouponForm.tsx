"use client";

import { useActionState } from "react";
import type { CouponFormState } from "./actions";

type InitialData = {
  code: string;
  discountPercent: number;
  maxUses: number | null;
  expiresAt: string | null;
  active: boolean;
};

type Props = {
  action: (state: CouponFormState, formData: FormData) => Promise<CouponFormState>;
  initialData?: InitialData;
  submitLabel: string;
};

export function CouponForm({ action, initialData, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-md space-y-5">
      <div>
        <label htmlFor="code" className="mb-1 block text-sm font-medium">
          Código do cupom
        </label>
        <input
          id="code"
          name="code"
          required
          placeholder="BEMVINDO10"
          defaultValue={initialData?.code}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono uppercase outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="discountPercent" className="mb-1 block text-sm font-medium">
          Desconto (%)
        </label>
        <input
          id="discountPercent"
          name="discountPercent"
          type="number"
          min="1"
          max="99"
          required
          defaultValue={initialData?.discountPercent}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="maxUses" className="mb-1 block text-sm font-medium">
            Limite de usos
          </label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            min="1"
            placeholder="ilimitado"
            defaultValue={initialData?.maxUses ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="expiresAt" className="mb-1 block text-sm font-medium">
            Validade
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="date"
            defaultValue={initialData?.expiresAt ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initialData?.active ?? true}
          className="h-4 w-4 accent-brand"
        />
        Cupom ativo
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
