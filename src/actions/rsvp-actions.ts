"use server";

import { revalidatePath } from "next/cache";
import { getEventSettings } from "@/lib/data/event-settings";
import { isRsvpClosed } from "@/lib/event";
import type { PublicGuest } from "@/lib/guest";
import { PUBLIC_GUEST_COLUMNS } from "@/lib/guest";
import { rsvpSchema, type RsvpInput } from "@/lib/rsvp-schema";
import { createServiceClient } from "@/lib/supabase/service-client";

export type RsvpResult = { ok: true; guest: PublicGuest } | { ok: false; error: string };

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  if (isRsvpClosed((await getEventSettings()).rsvpDeadline)) return { ok: false, error: "As confirmações foram encerradas." };

  const parsed = rsvpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const { code, status, companionsCount, companionsNames } = parsed.data;

  // Only the answer fields change; the name stays as the admin registered it.
  const { data, error } = await createServiceClient()
    .from("guests")
    .update({
      status,
      companions_count: companionsCount,
      companions_names: companionsNames,
      responded_at: new Date().toISOString(),
    })
    .eq("code", code)
    .select(PUBLIC_GUEST_COLUMNS)
    .maybeSingle();
  if (error) return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  if (!data) return { ok: false, error: "Convite não encontrado." };

  revalidatePath("/admin");
  return { ok: true, guest: data as PublicGuest };
}
