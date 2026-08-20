"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "../actions";

export function SignupForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signup, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          autoFocus
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
        <p className="mt-1 text-xs text-neutral-500">Mínimo de 8 caracteres.</p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        Já tem conta?{" "}
        <Link
          href={`/conta/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-brand hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
