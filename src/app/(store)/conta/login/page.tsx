import { LoginForm } from "./LoginForm";

export const metadata = { title: "Entrar — Loomi" };

export default async function LoginPage({
  searchParams,
}: PageProps<"/conta/login">) {
  const { redirect } = await searchParams;
  const redirectTo = typeof redirect === "string" ? redirect : "/conta";

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="mb-6 text-2xl font-bold">Entrar</h1>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
