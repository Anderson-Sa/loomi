import Image from "next/image";
import Link from "next/link";
import { formatPriceCents } from "@/lib/format";

type Props = {
  slug: string;
  name: string;
  imageUrl: string;
  priceCents: number;
};

export function ProductCard({ slug, name, imageUrl, priceCents }: Props) {
  return (
    <Link href={`/produto/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-sm font-medium">{name}</h3>
        <span className="text-sm text-neutral-600">
          {formatPriceCents(priceCents)}
        </span>
      </div>
    </Link>
  );
}
