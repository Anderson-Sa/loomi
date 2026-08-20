"use server";

import { redirect } from "next/navigation";
import { checkAdminPassword, createAdminSession } from "@/lib/adminSession";

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password || !checkAdminPassword(password)) {
    return { error: "Senha incorreta." };
  }

  await createAdminSession();
  redirect("/admin/produtos");
}
