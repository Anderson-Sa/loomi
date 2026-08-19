"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPriceCents } from "@/lib/format";

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao iniciar checkout");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Seu carrinho está vazio</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white"
        >
          Ver vitrine
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold">Carrinho</h1>

      <ul className="divide-y divide-neutral-200">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}`} className="flex gap-4 py-6">
            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-neutral-100">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-500">Tamanho: {item.size}</p>
                </div>
                <p className="font-medium">
                  {formatPriceCents(item.priceCents * item.quantity)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-md border border-neutral-300">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity - 1)
                    }
                  >
                    −
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-sm text-neutral-500 underline hover:text-black"
                >
                  Remover
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
        <span className="text-lg font-medium">Total</span>
        <span className="text-lg font-semibold">{formatPriceCents(totalCents)}</span>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Redirecionando..." : "Finalizar compra"}
      </button>
    </div>
  );
}
