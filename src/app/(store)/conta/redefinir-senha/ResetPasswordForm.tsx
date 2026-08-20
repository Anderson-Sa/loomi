"use client";

import { useActionState } from "react";
import { resetPassword } from "../actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Nova senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoFocus
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
        <p className="mt-1 text-xs text-neutral-500">Mínimo de 8 caracteres.</p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || !token}
        className="w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
