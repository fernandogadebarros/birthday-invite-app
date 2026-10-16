"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRsvpClosed } from "@/lib/event";
import type { PublicGuest } from "@/lib/guest";
import { PUBLIC_GUEST_COLUMNS } from "@/lib/guest";
import { createGuestCode } from "@/lib/guest-code";
import { rsvpSchema, type RsvpInput } from "@/lib/rsvp-schema";
import { createServiceClient } from "@/lib/supabase/service-client";

export type RsvpResult = { ok: true; guest: PublicGuest } | { ok: false; error: string };

const UNIQUE_VIOLATION = "23505";

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  if (isRsvpClosed()) return { ok: false, error: "As confirmações foram encerradas." };

  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const { code, name, status, companionsCount, companionsNames } = parsed.data;
  const answer = {
    status,
    companions_count: companionsCount,
    companions_names: companionsNames,
    responded_at: new Date().toISOString(),
  };
  const supabase = createServiceClient();

  // Personal link: only the answer fields change (the name stays as the admin registered it).
  if (code) {
    const { data, error } = await supabase
      .from("guests")
      .update(answer)
      .eq("code", code)
      .select(PUBLIC_GUEST_COLUMNS)
      .maybeSingle();
    if (error) return { ok: false, error: "Não foi possível salvar. Tente de novo." };
    if (!data) return { ok: false, error: "Convite não encontrado." };
    revalidatePath("/admin");
    return { ok: true, guest: data as PublicGuest };
  }

  // Generic link: register a new guest and move them to their own link,
  // so they can change the answer later.
  for (let attempt = 0; attempt < 3; attempt++) {
    const newCode = createGuestCode(name);
    const { error } = await supabase.from("guests").insert({ ...answer, code: newCode, name, source: "generic" });
    if (!error) {
      revalidatePath("/admin");
      redirect(`/invite/${newCode}`);
    }
    if (error.code !== UNIQUE_VIOLATION) break;
  }
  return { ok: false, error: "Não foi possível salvar. Tente de novo." };
}
