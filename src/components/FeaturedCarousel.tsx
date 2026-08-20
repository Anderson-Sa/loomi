"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPriceCents } from "@/lib/format";
import { getEffectivePriceCents } from "@/lib/pricing";

type Item = {
  slug: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  promoPriceCents?: number | null;
  campaign?: {
    discountPercent: number;
    active: boolean;
    startsAt: Date;
    endsAt: Date;
  } | null;
};

export function FeaturedCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.children[0]?.clientWidth ?? 1;
    const index = Math.round(track.scrollLeft / slideWidth);
    setActive(Math.max(0, Math.min(items.length - 1, index)));
  }

  return (
    <section className="bg-neutral-950 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-5 text-2xl font-bold text-white">Destaques da semana</h2>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const effectivePriceCents = getEffectivePriceCents(item);
            const onSale = effectivePriceCents < item.priceCents;
            return (
              <Link
                key={item.slug}
                href={`/produto/${item.slug}`}
                className="group relative block h-[420px] w-[85%] shrink-0 snap-start overflow-hidden rounded-lg sm:w-[calc((100%-24px)/3)]"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 85vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xl font-bold lowercase text-white">{item.name}</p>
                  <span className="mt-3 inline-flex items-center gap-2 rounded border border-white/40 bg-black/60 px-3 py-1.5 text-sm font-semibold text-white">
                    {onSale && (
                      <span className="text-white/50 line-through">
                        {formatPriceCents(item.priceCents)}
                      </span>
                    )}
                    {formatPriceCents(effectivePriceCents)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scrollToIndex(Math.min(items.length - 1, active + 1))}
          className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white sm:flex"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            aria-label={`Ir para ${item.name}`}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === active ? "w-6 bg-brand" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
