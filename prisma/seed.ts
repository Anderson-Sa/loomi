import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categorias = await Promise.all([
    prisma.category.upsert({
      where: { slug: "camisetas" },
      update: {},
      create: { name: "Camisetas", slug: "camisetas" },
    }),
    prisma.category.upsert({
      where: { slug: "calcas" },
      update: {},
      create: { name: "Calças", slug: "calcas" },
    }),
    prisma.category.upsert({
      where: { slug: "jaquetas" },
      update: {},
      create: { name: "Jaquetas", slug: "jaquetas" },
    }),
    prisma.category.upsert({
      where: { slug: "vestidos" },
      update: {},
      create: { name: "Vestidos", slug: "vestidos" },
    }),
  ]);

  const [camisetas, calcas, jaquetas, vestidos] = categorias;

  const produtos = [
    {
      name: "Camiseta Básica Branca",
      slug: "camiseta-basica-branca",
      description: "Camiseta 100% algodão, corte reto, ideal para o dia a dia.",
      priceCents: 4990,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
      sizes: "PP,P,M,G,GG",
      categoryId: camisetas.id,
    },
    {
      name: "Camiseta Oversized Preta",
      slug: "camiseta-oversized-preta",
      description: "Modelagem ampla, tecido encorpado, estampa minimalista nas costas.",
      priceCents: 6990,
      imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",
      sizes: "P,M,G,GG",
      categoryId: camisetas.id,
    },
    {
      name: "Calça Jeans Reta",
      slug: "calca-jeans-reta",
      description: "Jeans rígido com lavagem média, cintura alta.",
      priceCents: 14990,
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
      sizes: "36,38,40,42,44",
      categoryId: calcas.id,
    },
    {
      name: "Calça Moletom Jogger",
      slug: "calca-moletom-jogger",
      description: "Moletom flanelado, punho no tornozelo, bolsos laterais.",
      priceCents: 11990,
      imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600",
      sizes: "P,M,G,GG",
      categoryId: calcas.id,
    },
    {
      name: "Jaqueta Corta-Vento",
      slug: "jaqueta-corta-vento",
      description: "Impermeável leve, capuz removível, ótima para o outono.",
      priceCents: 19990,
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
      sizes: "P,M,G,GG",
      categoryId: jaquetas.id,
    },
    {
      name: "Jaqueta Jeans",
      slug: "jaqueta-jeans",
      description: "Clássica, forro xadrez, botões metálicos.",
      priceCents: 22990,
      imageUrl: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=600",
      sizes: "P,M,G",
      categoryId: jaquetas.id,
    },
    {
      name: "Vestido Midi Floral",
      slug: "vestido-midi-floral",
      description: "Tecido leve estampado, manga curta, ideal para o verão.",
      priceCents: 15990,
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
      sizes: "PP,P,M,G",
      categoryId: vestidos.id,
    },
    {
      name: "Vestido Longo Liso",
      slug: "vestido-longo-liso",
      description: "Caimento fluido, decote V, tecido viscose.",
      priceCents: 17990,
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600",
      sizes: "P,M,G,GG",
      categoryId: vestidos.id,
    },
  ];

  for (const produto of produtos) {
    await prisma.product.upsert({
      where: { slug: produto.slug },
      update: {},
      create: produto,
    });
  }

  console.log(`Seed concluído: ${categorias.length} categorias, ${produtos.length} produtos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
