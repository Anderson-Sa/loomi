"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "../actions";

export function RequestResetForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.success) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
        Se esse e-mail estiver cadastrado, enviamos um link de recuperação. Confira sua caixa de
        entrada (e o spam).
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar link de recuperação"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        <Link href="/conta/login" className="text-brand hover:underline">
          Voltar para o login
        </Link>
      </p>
    </form>
  );
}
