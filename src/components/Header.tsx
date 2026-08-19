"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          Loomi
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:opacity-70">
            Vitrine
          </Link>
          <Link href="/carrinho" className="relative hover:opacity-70">
            Carrinho
            {totalQuantity > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
