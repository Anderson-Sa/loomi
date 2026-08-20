import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminSessionValid } from "@/lib/adminSession";
import { logout } from "./actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAdminSessionValid();
  if (!authenticated) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-300 bg-white px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-xl font-extrabold text-brand">
            Loomi Admin
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium text-neutral-700">
            <Link href="/admin" className="hover:text-brand">
              Início
            </Link>
            <Link href="/admin/financeiro" className="hover:text-brand">
              Financeiro
            </Link>
            <Link href="/admin/produtos" className="hover:text-brand">
              Produtos
            </Link>
            <Link href="/admin/campanhas" className="hover:text-brand">
              Campanhas
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-neutral-500 hover:text-brand">
            Ver loja
          </Link>
          <form action={logout}>
            <button type="submit" className="font-medium text-neutral-700 hover:text-brand">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
