import Image from "next/image";
import Link from "next/link";
import { formatInstallments, formatPriceCents } from "@/lib/format";
import { getEffectivePriceCents } from "@/lib/pricing";

type Campaign = {
  name: string;
  discountPercent: number;
  active: boolean;
  startsAt: Date;
  endsAt: Date;
} | null;

type Props = {
  slug: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  promoPriceCents?: number | null;
  campaign?: Campaign;
};

export function ProductCard({
  slug,
  name,
  imageUrl,
  priceCents,
  promoPriceCents = null,
  campaign = null,
}: Props) {
  const effectivePriceCents = getEffectivePriceCents({ priceCents, promoPriceCents, campaign });
  const onSale = effectivePriceCents < priceCents;

  return (
    <Link href={`/produto/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 shadow-sm transition-shadow group-hover:shadow-lg">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {onSale && (
          <span className="absolute left-2 top-2 rounded bg-brand px-2 py-1 text-xs font-bold text-white">
            {campaign?.name ?? "OFERTA"}
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm text-neutral-800">{name}</h3>
        <p className="mt-1 flex items-baseline gap-2">
          {onSale && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPriceCents(priceCents)}
            </span>
          )}
          <span className="text-lg font-bold text-brand">
            {formatPriceCents(effectivePriceCents)}
          </span>
        </p>
        <p className="text-xs text-neutral-500">{formatInstallments(effectivePriceCents)}</p>
      </div>
    </Link>
  );
}
