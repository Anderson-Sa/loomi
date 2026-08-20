"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminSessionValid } from "@/lib/adminSession";

export async function markAsShipped(orderId: string) {
  if (!(await isAdminSessionValid())) throw new Error("Sessão expirada. Faça login novamente.");

  await prisma.order.update({
    where: { id: orderId },
    data: { shippedAt: new Date() },
  });

  revalidatePath("/admin/pedidos");
}
