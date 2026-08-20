"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createCustomerSession, destroyCustomerSession } from "@/lib/customerSession";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, formatRetryAfter, getClientIp } from "@/lib/rateLimit";

export type AuthFormState = { error?: string } | undefined;
export type RequestResetState = { error?: string; success?: boolean } | undefined;

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

function safeRedirectPath(raw: FormDataEntryValue | null) {
  const path = String(raw ?? "");
  if (path.startsWith("/") && !path.startsWith("//")) return path;
  return "/conta";
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirectPath(formData.get("redirect"));

  if (!name) return { error: "Informe seu nome." };
  if (!email.includes("@")) return { error: "Informe um e-mail válido." };
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) return { error: "Já existe uma conta com esse e-mail." };

  const passwordHash = await hashPassword(password);
  const customer = await prisma.customer.create({ data: { name, email, passwordHash } });

  await createCustomerSession(customer.id);
  redirect(redirectTo);
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirectPath(formData.get("redirect"));

  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`customer-login:${ip}:${email}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
  if (!rateLimit.allowed) {
    return {
      error: `Muitas tentativas. Tente novamente em ${formatRetryAfter(rateLimit.retryAfterSeconds)}.`,
    };
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return { error: "E-mail ou senha incorretos." };
  }

  await createCustomerSession(customer.id);
  redirect(redirectTo);
}

export async function logout() {
  await destroyCustomerSession();
  redirect("/");
}

export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "Informe um e-mail válido." };

  const customer = await prisma.customer.findUnique({ where: { email } });

  // Sempre retorna sucesso, exista ou não a conta — evita expor quais e-mails
  // estão cadastrados.
  if (customer) {
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { resetToken, resetTokenExpiresAt },
    });

    const origin = await getOrigin();
    await sendPasswordResetEmail({
      email: customer.email,
      name: customer.name,
      resetUrl: `${origin}/conta/redefinir-senha?token=${resetToken}`,
    });
  }

  return { success: true };
}

export async function resetPassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!token) return { error: "Link inválido." };
  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };

  const customer = await prisma.customer.findUnique({ where: { resetToken: token } });
  if (!customer || !customer.resetTokenExpiresAt || customer.resetTokenExpiresAt < new Date()) {
    return { error: "Esse link expirou ou já foi usado. Solicite um novo." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
  });

  await createCustomerSession(customer.id);
  redirect("/conta");
}
