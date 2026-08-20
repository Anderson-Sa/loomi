"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { formatPriceCents } from "@/lib/format";

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();
  const customer = useCustomer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(
    null
  );

  const discountCents = appliedCoupon
    ? Math.round((totalCents * appliedCoupon.discountPercent) / 100)
    : 0;
  const finalTotalCents = totalCents - discountCents;

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cupom inválido");
      setAppliedCoupon({ code: data.code, discountPercent: data.discountPercent });
    } catch (e) {
      setAppliedCoupon(null);
      setCouponError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, couponCode: appliedCoupon?.code }),
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
          className="mt-6 inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
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
                <p className="font-bold text-brand">
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

      <div className="mt-8 border-t border-neutral-200 pt-6">
        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm">
            <span className="text-green-700">
              Cupom <strong>{appliedCoupon.code}</strong> aplicado ({appliedCoupon.discountPercent}% off)
            </span>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-neutral-500 underline hover:text-black"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Código do cupom"
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm uppercase outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponInput.trim()}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand disabled:opacity-50"
            >
              {couponLoading ? "Aplicando..." : "Aplicar"}
            </button>
          </div>
        )}
        {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
      </div>

      <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>Subtotal</span>
          <span>{formatPriceCents(totalCents)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex items-center justify-between text-sm text-green-700">
            <span>Desconto ({appliedCoupon.discountPercent}%)</span>
            <span>−{formatPriceCents(discountCents)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-medium">Total</span>
          <span className="text-xl font-bold text-brand">{formatPriceCents(finalTotalCents)}</span>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {customer ? (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? "Redirecionando..." : "Finalizar compra"}
        </button>
      ) : (
        <div className="mt-6 rounded-md border border-neutral-200 bg-surface-muted p-4 text-center">
          <p className="text-sm text-neutral-600">
            Entre na sua conta para finalizar a compra.
          </p>
          <Link
            href="/conta/login?redirect=/carrinho"
            className="mt-3 inline-block w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Entrar e finalizar compra
          </Link>
        </div>
      )}
    </div>
  );
}
