import { prisma } from "@/lib/prisma";
import { getCustomerIdFromSession } from "@/lib/customerSession";

export async function getCurrentCustomer() {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) return null;

  return prisma.customer.findUnique({
    where: { id: customerId },
    select: { id: true, name: true, email: true },
  });
}
