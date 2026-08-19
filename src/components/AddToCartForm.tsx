"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  sizes: string[];
};

export function AddToCartForm({
  productId,
  slug,
  name,
  imageUrl,
  priceCents,
  sizes,
}: Props) {
  const [size, setSize] = useState(sizes[0] ?? "");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAdd() {
    addItem({ productId, slug, name, imageUrl, priceCents, size });
    setAdded(true);
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Tamanho</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSize(s);
              setAdded(false);
            }}
            className={`rounded-md border px-4 py-2 text-sm transition-colors ${
              size === s
                ? "border-brand bg-brand text-white"
                : "border-neutral-300 hover:border-brand"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Adicionar ao carrinho
        </button>
        {added && (
          <button
            type="button"
            onClick={() => router.push("/carrinho")}
            className="rounded-md border border-brand px-6 py-3 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white"
          >
            Ver carrinho
          </button>
        )}
      </div>
      {added && (
        <p className="mt-3 text-sm text-neutral-600">
          Adicionado ao carrinho ({size}).
        </p>
      )}
    </div>
  );
}
