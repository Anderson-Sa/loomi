import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

type CartItemInput = {
  productId: string;
  size: string;
  quantity: number;
};

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe não está configurado. Adicione STRIPE_SECRET_KEY no .env para ativar o checkout.",
      },
      { status: 500 }
    );
  }

  const { items } = (await request.json()) as { items: CartItemInput[] };

  if (!items?.length) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const productIds = items.map((i) => i.productId);
  const produtos = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const lineItems = items.map((item) => {
    const produto = produtos.find((p) => p.id === item.productId);
    if (!produto) throw new Error("Produto não encontrado");
    return { produto, size: item.size, quantity: item.quantity };
  });

  const totalCents = lineItems.reduce(
    (sum, i) => sum + i.produto.priceCents * i.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      customerName: "",
      customerEmail: "",
      totalCents,
      status: "pending",
      items: {
        create: lineItems.map((i) => ({
          productId: i.produto.id,
          size: i.size,
          quantity: i.quantity,
          priceCents: i.produto.priceCents,
        })),
      },
    },
  });

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "brl",
        unit_amount: i.produto.priceCents,
        product_data: {
          name: `${i.produto.name} (${i.size})`,
          images: [i.produto.imageUrl],
        },
      },
    })),
    success_url: `${origin}/sucesso?order=${order.id}`,
    cancel_url: `${origin}/carrinho`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
