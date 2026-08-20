import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { AUDIENCES } from "@/lib/audience";
import { isCampaignActiveNow } from "@/lib/pricing";

export default async function HomePage() {
  const produtos = await prisma.product.findMany({
    include: { campaign: true },
    orderBy: { name: "asc" },
  });

  const activeCampaigns = new Map<string, (typeof produtos)[number]["campaign"]>();
  for (const produto of produtos) {
    if (produto.campaign && isCampaignActiveNow(produto.campaign) && !activeCampaigns.has(produto.campaign.id)) {
      activeCampaigns.set(produto.campaign.id, produto.campaign);
    }
  }
  const campaignBanner = [...activeCampaigns.values()][0];

  const produtosPorPublico = AUDIENCES.map((audience) => ({
    ...audience,
    produtos: produtos.filter((produto) => produto.audience === audience.slug),
  }));

  const destaques = produtos.filter((produto) => produto.featured);

  return (
    <div>
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-4 px-6 py-5 text-sm font-medium text-neutral-800 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6 shrink-0 text-brand">
              <rect x="1" y="6" width="15" height="11" rx="1" />
              <path d="M16 10h4l3 3v4h-7z" />
              <circle cx="6" cy="19" r="1.5" />
              <circle cx="18.5" cy="19" r="1.5" />
            </svg>
            <span>Pagamento seguro via Stripe</span>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6 shrink-0 text-brand">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <span>Em até 3x sem juros</span>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6 shrink-0 text-brand">
              <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
            </svg>
            <span>Novidades toda semana</span>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6 shrink-0 text-brand">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              <path d="m9 20 2 2 4-4" />
            </svg>
            <span>Compra rápida, sem cadastro</span>
          </div>
        </div>
      </section>

      {campaignBanner && (
        <section className="bg-black py-3 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-wide">
            {campaignBanner.name} — {campaignBanner.discountPercent}% off em peças selecionadas
          </p>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <a
              key={audience.slug}
              href={`#${audience.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={audience.imageUrl}
                alt={audience.name}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-2xl font-bold lowercase text-white">
                  {audience.name}
                </p>
                <span className="text-sm text-white/80 underline-offset-2 group-hover:underline">
                  confira
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {destaques.length > 0 && <FeaturedCarousel items={destaques} />}

      <div className="mx-auto max-w-6xl px-6 py-12">
        {produtosPorPublico.map((audience) => (
          <section key={audience.slug} id={audience.slug} className="mb-16 scroll-mt-32">
            <div className="mb-5 flex items-baseline justify-between border-b-2 border-black pb-3">
              <h2 className="text-xl font-bold uppercase tracking-wide">
                {audience.name}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {audience.produtos.map((produto) => (
                <ProductCard
                  key={produto.id}
                  slug={produto.slug}
                  name={produto.name}
                  imageUrl={produto.imageUrl}
                  priceCents={produto.priceCents}
                  promoPriceCents={produto.promoPriceCents}
                  campaign={produto.campaign}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
