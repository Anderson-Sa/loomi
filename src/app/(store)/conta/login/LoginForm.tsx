"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "../actions";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirectTo} />

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

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium">
            Senha
          </label>
          <Link href="/conta/recuperar-senha" className="text-xs text-brand hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        Não tem conta?{" "}
        <Link
          href={`/conta/cadastro?redirect=${encodeURIComponent(redirectTo)}`}
          className="text-brand hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
