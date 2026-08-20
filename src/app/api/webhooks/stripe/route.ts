import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Assinatura inválida";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } },
      });

      if (order && order.status !== "paid") {
        const shipping = session.collected_information?.shipping_details;
        const customerEmail = session.customer_details?.email ?? "";
        const customerName = session.customer_details?.name ?? "";

        await prisma.$transaction([
          prisma.order.update({
            where: { id: orderId },
            data: {
              status: "paid",
              customerEmail,
              customerName,
              shippingName: shipping?.name ?? null,
              shippingLine1: shipping?.address.line1 ?? null,
              shippingLine2: shipping?.address.line2 ?? null,
              shippingCity: shipping?.address.city ?? null,
              shippingState: shipping?.address.state ?? null,
              shippingPostalCode: shipping?.address.postal_code ?? null,
              shippingCountry: shipping?.address.country ?? null,
            },
          }),
          ...order.items.map((item) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          ),
          ...(order.couponCode
            ? [
                prisma.coupon.updateMany({
                  where: { code: order.couponCode },
                  data: { usedCount: { increment: 1 } },
                }),
              ]
            : []),
        ]);

        const shippingAddress = shipping
          ? [shipping.address.line1, shipping.address.line2, shipping.address.city, shipping.address.state, shipping.address.postal_code]
              .filter(Boolean)
              .join(", ")
          : null;

        await sendOrderConfirmationEmail({
          customerEmail,
          customerName,
          orderId: order.id,
          totalCents: order.totalCents,
          shippingAddress,
          items: order.items.map((item) => ({
            name: item.product.name,
            size: item.size,
            quantity: item.quantity,
            priceCents: item.priceCents,
          })),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
