"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { AUDIENCES } from "@/lib/audience";

export function Header() {
  const { totalQuantity } = useCart();
  const customer = useCustomer();

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="bg-black py-1.5 text-center text-xs font-medium tracking-wide text-white">
        Novidades toda semana na Loomi
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-brand"
        >
          Loomi
        </Link>

        <form action="/busca" className="hidden flex-1 sm:block">
          <input
            type="search"
            name="q"
            placeholder="Buscar produtos, categorias..."
            className="w-full rounded-full border border-neutral-300 bg-surface-muted px-4 py-2 text-sm outline-none focus:border-brand"
          />
        </form>

        <nav className="ml-auto flex items-center gap-5 text-sm">
          <Link
            href={customer ? "/conta" : "/conta/login"}
            className="hidden items-center gap-1.5 font-medium hover:text-brand sm:flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{customer ? customer.name.split(" ")[0] : "Entrar"}</span>
          </Link>
          <Link
            href="/carrinho"
            className="relative flex items-center gap-1.5 font-medium hover:text-brand"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="hidden md:inline">Carrinho</span>
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <div className="border-t border-neutral-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-center gap-6 overflow-x-auto px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
          <Link href="/" className="shrink-0 text-neutral-800 hover:text-brand">
            Vitrine
          </Link>
          {AUDIENCES.map((audience) => (
            <Link
              key={audience.slug}
              href={`/#${audience.slug}`}
              className="shrink-0 text-neutral-800 hover:text-brand"
            >
              {audience.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
