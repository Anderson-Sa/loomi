import { Resend } from "resend";
import { formatPriceCents } from "@/lib/format";

type OrderConfirmationItem = {
  name: string;
  size: string;
  quantity: number;
  priceCents: number;
};

type OrderConfirmationData = {
  customerEmail: string;
  customerName: string;
  orderId: string;
  totalCents: number;
  items: OrderConfirmationItem[];
  shippingAddress: string | null;
};

export async function sendOrderConfirmationEmail(order: OrderConfirmationData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !order.customerEmail) return;

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "Loomi <onboarding@resend.dev>";

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;">${item.quantity}x ${item.name} (${item.size})</td>
          <td style="padding:8px 0;text-align:right;">${formatPriceCents(item.priceCents * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#171717;">
      <h1 style="color:#e30613;">Pedido confirmado!</h1>
      <p>Olá${order.customerName ? `, ${order.customerName}` : ""}! Recebemos o pagamento do seu pedido na Loomi.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${itemsHtml}
        <tr style="border-top:1px solid #e5e5e5;">
          <td style="padding:8px 0;font-weight:bold;">Total</td>
          <td style="padding:8px 0;text-align:right;font-weight:bold;">${formatPriceCents(order.totalCents)}</td>
        </tr>
      </table>
      ${
        order.shippingAddress
          ? `<p style="margin-top:16px;"><strong>Entregar em:</strong><br />${order.shippingAddress}</p>`
          : ""
      }
      <p style="margin-top:24px;font-size:12px;color:#737373;">Pedido #${order.orderId}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: order.customerEmail,
      subject: "Seu pedido na Loomi foi confirmado",
      html,
    });
  } catch (error) {
    console.error("Falha ao enviar e-mail de confirmação:", error);
  }
}

export async function sendPasswordResetEmail(params: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  // Sempre loga a URL no servidor: garante que o link funciona mesmo sem
  // RESEND_API_KEY configurado (útil em dev e como plano B).
  console.log(`[recuperar-senha] Link para ${params.email}: ${params.resetUrl}`);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL || "Loomi <onboarding@resend.dev>";

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#171717;">
      <h1 style="color:#e30613;">Redefinir sua senha</h1>
      <p>Olá${params.name ? `, ${params.name}` : ""}! Recebemos um pedido para redefinir a senha da sua conta na Loomi.</p>
      <p style="margin-top:16px;">
        <a href="${params.resetUrl}" style="display:inline-block;background:#e30613;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
          Redefinir senha
        </a>
      </p>
      <p style="margin-top:16px;font-size:12px;color:#737373;">
        Esse link expira em 1 hora. Se você não pediu essa alteração, pode ignorar este e-mail.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to: params.email,
      subject: "Redefinir sua senha — Loomi",
      html,
    });
  } catch (error) {
    console.error("Falha ao enviar e-mail de recuperação de senha:", error);
  }
}
