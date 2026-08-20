import Link from "next/link";
import { AUDIENCES } from "@/lib/audience";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-surface-muted">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              Públicos
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              {AUDIENCES.map((audience) => (
                <li key={audience.slug}>
                  <Link href={`/#${audience.slug}`} className="hover:text-brand">
                    {audience.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              Minha conta
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/carrinho" className="hover:text-brand">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-brand">
                  Vitrine
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              Institucional
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/trocas-e-devolucoes" className="hover:text-brand">
                  Trocas e devoluções
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-brand">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-brand">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">
              Fique por dentro
            </h3>
            <p className="mb-3 text-sm text-neutral-600">
              Receba novidades e lançamentos por e-mail.
            </p>
            <form className="flex max-w-sm gap-2">
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-300 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Loomi. Todos os direitos reservados.</p>
          <p>Pagamento processado com segurança via Stripe.</p>
        </div>
      </div>
    </footer>
  );
}
