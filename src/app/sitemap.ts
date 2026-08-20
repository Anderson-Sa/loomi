import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/politica-de-privacidade`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/termos-de-uso`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/trocas-e-devolucoes`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const produtos = await prisma.product.findMany({
    select: { slug: true, createdAt: true },
  });

  const productRoutes: MetadataRoute.Sitemap = produtos.map((produto) => ({
    url: `${siteUrl}/produto/${produto.slug}`,
    lastModified: produto.createdAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
