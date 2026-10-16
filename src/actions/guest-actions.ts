"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Guest } from "@/lib/guest";
import { createGuestCode } from "@/lib/guest-code";
import { newGuestSchema } from "@/lib/rsvp-schema";
import { createSessionClient, getAdminEmail } from "@/lib/supabase/session-client";

export type AddGuestResult = { ok: true; guest: Guest } | { ok: false; error: string };

const UNIQUE_VIOLATION = "23505";

// Server Actions are public endpoints: every action re-checks the admin session.
async function requireAdmin() {
  const email = await getAdminEmail();
  if (!email) throw new Error("Unauthorized");
  return createSessionClient();
}

export async function addGuest(input: { name: string; phone: string }): Promise<AddGuestResult> {
  const supabase = await requireAdmin();
  const parsed = newGuestSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("guests")
      .insert({ name: parsed.data.name, phone: parsed.data.phone, code: createGuestCode(parsed.data.name) })
      .select("*")
      .single();
    if (!error) {
      revalidatePath("/admin");
      return { ok: true, guest: data as Guest };
    }
    if (error.code !== UNIQUE_VIOLATION) break;
  }
  return { ok: false, error: "Não foi possível adicionar o convidado." };
}

export type DeleteGuestResult = { ok: true } | { ok: false; error: string };

export async function deleteGuest(id: string): Promise<DeleteGuestResult> {
  const supabase = await requireAdmin();
  if (!z.uuid().safeParse(id).success) return { ok: false, error: "Convidado inválido." };

  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (error) return { ok: false, error: "Não foi possível excluir o convidado." };
  revalidatePath("/admin");
  return { ok: true };
}

export async function markSent(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const supabase = await requireAdmin();
  await supabase.from("guests").update({ sent_at: new Date().toISOString() }).in("id", ids);
  revalidatePath("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
