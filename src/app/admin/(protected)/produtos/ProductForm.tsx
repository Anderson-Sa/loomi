"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slugify";
import type { ProductFormState } from "./actions";

type Category = { id: string; name: string };

type InitialData = {
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  promoPriceCents: number | null;
  sizes: string;
  audience: string;
  categoryId: string;
  stock: number;
  imageUrl: string;
  featured: boolean;
};

type Props = {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  initialData?: InitialData;
  submitLabel: string;
};

const AUDIENCE_OPTIONS = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "infantil", label: "Infantil" },
];

function centsToReais(cents: number | null | undefined) {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2);
}

export function ProductForm({ action, categories, initialData, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData));
  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl ?? null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleImageChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nome do produto
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug (URL)
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

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={initialData?.description}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Preço (R$)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={centsToReais(initialData?.priceCents)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="promoPrice" className="mb-1 block text-sm font-medium">
            Preço promocional (R$)
          </label>
          <input
            id="promoPrice"
            name="promoPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="opcional"
            defaultValue={centsToReais(initialData?.promoPriceCents)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="audience" className="mb-1 block text-sm font-medium">
            Público
          </label>
          <select
            id="audience"
            name="audience"
            required
            defaultValue={initialData?.audience ?? "feminino"}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-brand"
          >
            {AUDIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium">
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialData?.categoryId ?? categories[0]?.id}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-brand"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sizes" className="mb-1 block text-sm font-medium">
            Tamanhos (separados por vírgula)
          </label>
          <input
            id="sizes"
            name="sizes"
            required
            placeholder="PP,P,M,G,GG"
            defaultValue={initialData?.sizes}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="stock" className="mb-1 block text-sm font-medium">
            Estoque
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={initialData?.stock ?? 100}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-brand"
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Imagem</span>
        <div className="flex items-start gap-4">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element -- prévia local pode ser blob: URL, incompatível com o otimizador do next/image
            <img
              src={preview}
              alt="Prévia"
              className="h-24 w-24 shrink-0 rounded-md bg-neutral-100 object-cover"
            />
          )}
          <div className="flex-1 space-y-2">
            <input
              type="file"
              name="imageFile"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => handleImageChange(e.target.files)}
              className="block w-full text-sm"
            />
            <p className="text-xs text-neutral-500">ou cole a URL de uma imagem já hospedada</p>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://..."
              defaultValue={initialData?.imageUrl?.startsWith("/uploads/") ? "" : initialData?.imageUrl}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initialData?.featured}
          className="h-4 w-4 accent-brand"
        />
        Mostrar nos destaques da home
      </label>

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
