import type { Metadata } from "next";
import { TopBar } from "@/components/top-bar";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = { title: "Entrar · lista de presença" };

export default function LoginPage() {
  return (
    <>
      <TopBar />
      <main className="flex flex-1 justify-center px-4 pt-8 pb-16">
        <LoginForm />
      </main>
    </>
  );
}
