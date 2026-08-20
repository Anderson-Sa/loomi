import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "customer_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret) {
    throw new Error("CUSTOMER_SESSION_SECRET não está configurado no .env");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function buildToken(customerId: string, expiresAt: number) {
  const payload = `${customerId}.${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function parseToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [customerId, expiresAtRaw, signature] = parts;

  const payload = `${customerId}.${expiresAtRaw}`;
  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  return { customerId };
}

export async function createCustomerSession(customerId: string) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = buildToken(customerId, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function destroyCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCustomerIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return parseToken(token)?.customerId ?? null;
}
