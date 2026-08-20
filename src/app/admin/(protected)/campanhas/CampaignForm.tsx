"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slugify";
import type { CampaignFormState } from "./actions";

type ProductOption = { id: string; name: string; campaignId: string | null };

type InitialData = {
  name: string;
  slug: string;
  discountPercent: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
  selectedProductIds: string[];
};

type Props = {
  action: (state: CampaignFormState, formData: FormData) => Promise<CampaignFormState>;
  products: ProductOption[];
  initialData?: InitialData;
  submitLabel: string;
};

export function CampaignForm({ action, products, initialData, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData));
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialData?.selectedProductIds ?? [])
  );

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function toggleProduct(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nome da campanha
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Black Friday"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="discountPercent" className="mb-1 block text-sm font-medium">
            Desconto (%)
          </label>
          <input
            id="discountPercent"
            name="discountPercent"
            type="number"
            min="1"
            max="99"
            required
            defaultValue={initialData?.discountPercent}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="startsAt" className="mb-1 block text-sm font-medium">
            Início
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="date"
            required
            defaultValue={initialData?.startsAt}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="endsAt" className="mb-1 block text-sm font-medium">
            Fim
          </label>
          <input
            id="endsAt"
            name="endsAt"
            type="date"
            required
            defaultValue={initialData?.endsAt}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initialData?.active ?? true}
          className="h-4 w-4 accent-brand"
        />
        Campanha ativa
      </label>

      <div>
        <span className="mb-2 block text-sm font-medium">
          Produtos participantes ({selected.size} selecionado{selected.size === 1 ? "" : "s"})
        </span>
        <div className="max-h-72 overflow-y-auto rounded-md border border-neutral-300">
          {products.map((product) => {
            const inOtherCampaign = product.campaignId && !selected.has(product.id) && !initialData?.selectedProductIds.includes(product.id);
            return (
              <label
                key={product.id}
                className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2 text-sm last:border-b-0 hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  name="productIds"
                  value={product.id}
                  checked={selected.has(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  className="h-4 w-4 accent-brand"
                />
                {product.name}
                {inOtherCampaign && (
                  <span className="text-xs text-neutral-400">(já está em outra campanha)</span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
