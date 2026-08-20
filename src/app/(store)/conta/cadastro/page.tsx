import { SignupForm } from "./SignupForm";

export const metadata = { title: "Criar conta — Loomi" };

export default async function CadastroPage({
  searchParams,
}: PageProps<"/conta/cadastro">) {
  const { redirect } = await searchParams;
  const redirectTo = typeof redirect === "string" ? redirect : "/conta";

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">Criar conta</h1>
      <SignupForm redirectTo={redirectTo} />
    </div>
  );
}
