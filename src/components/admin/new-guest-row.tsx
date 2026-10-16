"use client";

import { useState, useTransition, type FormEvent } from "react";
import { addGuest } from "@/actions/guest-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { maskPhoneInput, onlyDigits } from "@/lib/format";
import type { Guest } from "@/lib/guest";

export function NewGuestRow({ onAdded }: { onAdded: (guest: Guest) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const cantAdd = !name.trim() || onlyDigits(phone).length < 10 || pending;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (cantAdd) return;
    setError(null);
    startTransition(async () => {
      const result = await addGuest({ name, phone });
      if (!result.ok) return setError(result.error);
      setName("");
      setPhone("");
      onAdded(result.guest);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2.5 border-b border-line-subtle bg-card p-3.5">
      <div className="min-w-[180px] flex-[2]">
        <Input label="Novo convidado" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="min-w-[160px] flex-[1.4]">
        <Input
          label="WhatsApp"
          placeholder="(11) 9 0000-0000"
          inputMode="tel"
          autoComplete="off"
          value={phone}
          onChange={(e) => setPhone(maskPhoneInput(e.target.value))}
        />
      </div>
      <Button type="submit" variant="primary" disabled={cantAdd}>
        {pending ? "Adicionando…" : "Adicionar e enviar →"}
      </Button>
      {error && (
        <p role="alert" className="m-0 w-full font-sans text-12 text-accent">
          {error}
        </p>
      )}
    </form>
  );
}
