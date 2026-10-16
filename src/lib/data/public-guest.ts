import "server-only";
import type { PublicGuest } from "@/lib/guest";
import { PUBLIC_GUEST_COLUMNS } from "@/lib/guest";
import { createServiceClient } from "@/lib/supabase/service-client";

const CODE_PATTERN = /^[a-z]+-[a-z0-9]{3,8}$/;

export async function getPublicGuest(code: string): Promise<PublicGuest | null> {
  if (!CODE_PATTERN.test(code)) return null;
  const { data, error } = await createServiceClient()
    .from("guests")
    .select(PUBLIC_GUEST_COLUMNS)
    .eq("code", code)
    .maybeSingle();
  if (error) throw error;
  return data as PublicGuest | null;
}
