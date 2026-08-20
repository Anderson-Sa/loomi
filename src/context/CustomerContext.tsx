"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Customer = { id: string; name: string; email: string };

const CustomerContext = createContext<Customer | null>(null);

export function CustomerProvider({
  customer,
  children,
}: {
  customer: Customer | null;
  children: ReactNode;
}) {
  return <CustomerContext.Provider value={customer}>{children}</CustomerContext.Provider>;
}

export function useCustomer() {
  return useContext(CustomerContext);
}
