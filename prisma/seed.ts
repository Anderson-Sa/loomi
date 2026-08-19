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
      audience: "masculino",
      categoryId: camisetas.id,
    },
    {
      name: "Camiseta Oversized Preta",
      slug: "camiseta-oversized-preta",
      description: "Modelagem ampla, tecido encorpado, estampa minimalista nas costas.",
      priceCents: 6990,
      imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600",
      sizes: "P,M,G,GG",
      audience: "masculino",
      categoryId: camisetas.id,
    },
    {
      name: "Camiseta Listrada Marinho",
      slug: "camiseta-listrada-marinho",
      description: "Listras finas, gola careca, malha macia de algodão.",
      priceCents: 5990,
      imageUrl: "https://images.unsplash.com/photo-1589810635657-232948472d98?w=600",
      sizes: "PP,P,M,G,GG",
      audience: "masculino",
      categoryId: camisetas.id,
    },
    {
      name: "Camiseta Estampada Amarela",
      slug: "camiseta-estampada-amarela",
      description: "Estampa gráfica na frente, corte tradicional, 100% algodão.",
      priceCents: 5490,
      imageUrl: "https://images.unsplash.com/photo-1658569083462-0bb13d68ec66?w=600",
      sizes: "P,M,G,GG",
      audience: "masculino",
      categoryId: camisetas.id,
    },
    {
      name: "Camiseta Infantil Estampada",
      slug: "camiseta-infantil-estampada",
      description: "Malha macia, estampa lúdica, ótima para o dia a dia das crianças.",
      priceCents: 3990,
      imageUrl: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600",
      sizes: "2,4,6,8,10",
      audience: "infantil",
      categoryId: camisetas.id,
    },
    {
      name: "Calça Jeans Reta",
      slug: "calca-jeans-reta",
      description: "Jeans rígido com lavagem média, cintura alta.",
      priceCents: 14990,
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
      sizes: "36,38,40,42,44",
      audience: "feminino",
      categoryId: calcas.id,
    },
    {
      name: "Calça Moletom Jogger",
      slug: "calca-moletom-jogger",
      description: "Moletom flanelado, punho no tornozelo, bolsos laterais.",
      priceCents: 11990,
      imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600",
      sizes: "P,M,G,GG",
      audience: "feminino",
      categoryId: calcas.id,
    },
    {
      name: "Calça Alfaiataria Bege",
      slug: "calca-alfaiataria-bege",
      description: "Corte reto, tecido com leve elastano, cós com passantes.",
      priceCents: 16990,
      imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
      sizes: "36,38,40,42,44",
      audience: "feminino",
      categoryId: calcas.id,
    },
    {
      name: "Calça Jeans Skinny",
      slug: "calca-jeans-skinny",
      description: "Modelagem justa, jeans com elastano, cintura média.",
      priceCents: 13990,
      imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600",
      sizes: "36,38,40,42",
      audience: "feminino",
      categoryId: calcas.id,
    },
    {
      name: "Calça Infantil Jogger",
      slug: "calca-infantil-jogger",
      description: "Cós com elástico ajustável, tecido resistente para brincar à vontade.",
      priceCents: 4490,
      imageUrl: "https://images.unsplash.com/photo-1766918780914-5df4a5a98c44?w=600",
      sizes: "2,4,6,8,10",
      audience: "infantil",
      categoryId: calcas.id,
    },
    {
      name: "Jaqueta Corta-Vento",
      slug: "jaqueta-corta-vento",
      description: "Impermeável leve, capuz removível, ótima para o outono.",
      priceCents: 19990,
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
      sizes: "P,M,G,GG",
      audience: "masculino",
      categoryId: jaquetas.id,
    },
    {
      name: "Jaqueta Jeans",
      slug: "jaqueta-jeans",
      description: "Clássica, forro xadrez, botões metálicos.",
      priceCents: 22990,
      imageUrl: "https://images.unsplash.com/photo-1708523842501-1619478cea1f?w=600",
      sizes: "P,M,G",
      audience: "feminino",
      categoryId: jaquetas.id,
    },
    {
      name: "Jaqueta Bomber Verde",
      slug: "jaqueta-bomber-verde",
      description: "Punhos e barra em ribana, fechamento em zíper, bolsos frontais.",
      priceCents: 18990,
      imageUrl: "https://images.unsplash.com/photo-1549399239-fb3c102d3d71?w=600",
      sizes: "P,M,G,GG",
      audience: "masculino",
      categoryId: jaquetas.id,
    },
    {
      name: "Jaqueta Couro Sintético",
      slug: "jaqueta-couro-sintetico",
      description: "Caimento justo, forro interno, zíperes metálicos nos bolsos.",
      priceCents: 24990,
      imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600",
      sizes: "P,M,G",
      audience: "feminino",
      categoryId: jaquetas.id,
    },
    {
      name: "Jaqueta Infantil Corta-Vento",
      slug: "jaqueta-infantil-corta-vento",
      description: "Leve e impermeável, capuz ajustável, ideal para dias de vento.",
      priceCents: 6990,
      imageUrl: "https://images.unsplash.com/photo-1487458708741-1dcff3ede542?w=600",
      sizes: "4,6,8,10",
      audience: "infantil",
      categoryId: jaquetas.id,
    },
    {
      name: "Vestido Midi Floral",
      slug: "vestido-midi-floral",
      description: "Tecido leve estampado, manga curta, ideal para o verão.",
      priceCents: 15990,
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600",
      sizes: "PP,P,M,G",
      audience: "feminino",
      categoryId: vestidos.id,
    },
    {
      name: "Vestido Longo Liso",
      slug: "vestido-longo-liso",
      description: "Caimento fluido, decote V, tecido viscose.",
      priceCents: 17990,
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
      sizes: "P,M,G,GG",
      audience: "feminino",
      categoryId: vestidos.id,
    },
    {
      name: "Vestido Curto Xadrez",
      slug: "vestido-curto-xadrez",
      description: "Estampa xadrez, manga bufante, zíper invisível nas costas.",
      priceCents: 13990,
      imageUrl: "https://images.unsplash.com/photo-1642597549127-395fd6c7ee24?w=600",
      sizes: "PP,P,M,G",
      audience: "feminino",
      categoryId: vestidos.id,
    },
    {
      name: "Vestido Longo Vinho",
      slug: "vestido-envelope-vinho",
      description: "Caimento fluido, tecido brilhante, ideal para ocasiões especiais.",
      priceCents: 16990,
      imageUrl: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600",
      sizes: "P,M,G,GG",
      audience: "feminino",
      categoryId: vestidos.id,
    },
    {
      name: "Vestido Infantil Floral",
      slug: "vestido-infantil-floral",
      description: "Tecido macio, estampa floral delicada, perfeito para ocasiões especiais.",
      priceCents: 4990,
      imageUrl: "https://images.unsplash.com/photo-1772359392267-5b7a0eab28c7?w=600",
      sizes: "2,4,6,8",
      audience: "infantil",
      categoryId: vestidos.id,
    },
  ];

  for (const produto of produtos) {
    await prisma.product.upsert({
      where: { slug: produto.slug },
      update: produto,
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
