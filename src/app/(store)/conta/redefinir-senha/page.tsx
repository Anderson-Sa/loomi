import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = { title: "Redefinir senha — Loomi" };

export default async function RedefinirSenhaPage({
  searchParams,
}: PageProps<"/conta/redefinir-senha">) {
  const { token } = await searchParams;
  const tokenValue = typeof token === "string" ? token : "";

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">Redefinir senha</h1>
      {tokenValue ? (
        <ResetPasswordForm token={tokenValue} />
      ) : (
        <p className="text-sm text-red-600">
          Link inválido.{" "}
          <Link href="/conta/recuperar-senha" className="text-brand hover:underline">
            Solicite um novo
          </Link>
          .
        </p>
      )}
    </div>
  );
}
