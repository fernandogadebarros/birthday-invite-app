"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";

// Not in the design: composed from the design-system primitives.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await createBrowserSupabase().auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setPending(false);
      setError("Email ou senha incorretos.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[420px] flex-col gap-5 self-start rounded-card border border-line bg-panel p-6">
      <div className="flex flex-col gap-1">
        <h1 className="m-0 font-sans text-title leading-[1.2] font-semibold tracking-tight text-ink">Lista de presença</h1>
        <span className="font-sans text-caption text-muted">área dos pais · entre com seu email e senha</span>
      </div>
      <Input label="Email" type="email" required autoComplete="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Senha" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle pt-[18px]">
        <span role={error ? "alert" : undefined} className="font-sans text-caption text-accent">
          {error}
        </span>
        <Button type="submit" variant="primary" disabled={!email.trim() || !password || pending}>
          {pending ? "Entrando…" : "Entrar →"}
        </Button>
      </div>
    </form>
  );
}
