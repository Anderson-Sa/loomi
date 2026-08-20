"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/lib/slugify";
import type { CategoryFormState } from "./actions";

type InitialData = { name: string; slug: string };

type Props = {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  initialData?: InitialData;
  submitLabel: string;
};

export function CategoryForm({ action, initialData, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData));

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <form action={formAction} className="max-w-md space-y-5">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nome da categoria
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Camisetas"
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
