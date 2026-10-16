"use server";

import { revalidatePath } from "next/cache";
import { eventSettingsSchema, type EventSettingsFields } from "@/lib/event-settings";
import { createSessionClient, getAdminEmail } from "@/lib/supabase/session-client";

export type UpdateEventResult = { ok: true } | { ok: false; error: string };

export async function updateEventSettings(input: EventSettingsFields): Promise<UpdateEventResult> {
  // Server Actions are public endpoints: re-check the admin session.
  if (!(await getAdminEmail())) throw new Error("Unauthorized");

  const parsed = eventSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const { startsAt, rsvpDeadline, venue } = parsed.data;
  const supabase = await createSessionClient();
  const { error } = await supabase.from("event_settings").upsert({
    id: 1,
    starts_at: startsAt,
    rsvp_deadline: rsvpDeadline,
    venue,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: "Não foi possível salvar os dados do evento." };

  revalidatePath("/admin");
  return { ok: true };
}
