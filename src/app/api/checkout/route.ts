import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getEffectivePriceCents } from "@/lib/pricing";
import { validateCoupon } from "@/lib/coupon";
import { getCurrentCustomer } from "@/lib/customer";

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

  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json(
      { error: "Você precisa entrar na sua conta para finalizar a compra." },
      { status: 401 }
    );
  }

  const { items, couponCode } = (await request.json()) as {
    items: CartItemInput[];
    couponCode?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  let discountPercent = 0;
  if (couponCode?.trim()) {
    const result = await validateCoupon(couponCode);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    discountPercent = result.coupon.discountPercent;
  }

  const productIds = items.map((i) => i.productId);
  const produtos = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { campaign: true },
  });

  const lineItems = items.map((item) => {
    const produto = produtos.find((p) => p.id === item.productId);
    if (!produto) throw new Error("Produto não encontrado");
    const basePriceCents = getEffectivePriceCents(produto);
    const priceCents = discountPercent
      ? Math.round(basePriceCents * (1 - discountPercent / 100))
      : basePriceCents;
    return { produto, size: item.size, quantity: item.quantity, priceCents };
  });

  const semEstoque = lineItems.filter((i) => i.quantity > i.produto.stock);
  if (semEstoque.length > 0) {
    return NextResponse.json(
      {
        error: `Estoque insuficiente para: ${semEstoque
          .map((i) => `${i.produto.name} (disponível: ${i.produto.stock})`)
          .join(", ")}`,
      },
      { status: 400 }
    );
  }

  const totalCents = lineItems.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
  const discountCents = discountPercent
    ? lineItems.reduce((sum, i) => {
        const original = getEffectivePriceCents(i.produto);
        return sum + (original - i.priceCents) * i.quantity;
      }, 0)
    : 0;

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      totalCents,
      status: "pending",
      couponCode: discountPercent ? couponCode!.trim().toUpperCase() : null,
      discountCents,
      items: {
        create: lineItems.map((i) => ({
          productId: i.produto.id,
          size: i.size,
          quantity: i.quantity,
          priceCents: i.priceCents,
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
        unit_amount: i.priceCents,
        product_data: {
          name: `${i.produto.name} (${i.size})`,
          images: [i.produto.imageUrl],
        },
      },
    })),
    shipping_address_collection: { allowed_countries: ["BR"] },
    customer_email: customer.email,
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
