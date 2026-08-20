"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SucessoPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Pedido confirmado!</h1>
      <p className="mt-3 text-neutral-600">
        Obrigado por comprar na Loomi. Você vai receber a confirmação por e-mail.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Voltar à vitrine
      </Link>
    </div>
  );
}
