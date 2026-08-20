import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupon";

export async function POST(request: Request) {
  const { code } = (await request.json()) as { code?: string };

  const result = await validateCoupon(String(code ?? ""));
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    code: result.coupon.code,
    discountPercent: result.coupon.discountPercent,
  });
}
