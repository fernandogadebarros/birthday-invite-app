import "server-only";
import { defaultEventSettings, type EventSettings } from "@/lib/event";
import { createServiceClient } from "@/lib/supabase/service-client";

/** Current party details; falls back to the defaults until the hosts save something. */
export async function getEventSettings(): Promise<EventSettings> {
  const { data, error } = await createServiceClient()
    .from("event_settings")
    .select("starts_at, rsvp_deadline, venue")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return defaultEventSettings;
  return { startsAt: data.starts_at, rsvpDeadline: data.rsvp_deadline, venue: data.venue };
}
