import { RequestResetForm } from "./RequestResetForm";

export const metadata = { title: "Recuperar senha — Loomi" };

export default function RecuperarSenhaPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="mb-2 text-2xl font-bold">Recuperar senha</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Digite o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
      </p>
      <RequestResetForm />
    </div>
  );
}
