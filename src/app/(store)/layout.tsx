import { CartProvider } from "@/context/CartContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/customer";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCurrentCustomer();

  return (
    <CustomerProvider customer={customer}>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CartProvider>
    </CustomerProvider>
  );
}
