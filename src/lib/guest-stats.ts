import { formatRelative } from "@/lib/format";
import type { Guest } from "@/lib/guest";

export function computeStats(guests: Pick<Guest, "status" | "companions_count">[]) {
  const yes = guests.filter((g) => g.status === "yes");
  const companions = yes.reduce((sum, g) => sum + g.companions_count, 0);
  return {
    people: yes.length + companions,
    yes: yes.length,
    companions,
    pending: guests.filter((g) => g.status === "pending").length,
    no: guests.filter((g) => g.status === "no").length,
  };
}

/** Secondary line under the status tag: "há 3h", "enviado há 2d", "não enviado". */
export function guestActivityLabel(guest: Pick<Guest, "status" | "sent_at" | "responded_at" | "source">, now = new Date()): string {
  if (guest.status !== "pending" && guest.responded_at) {
    const when = formatRelative(guest.responded_at, now);
    return guest.source === "generic" ? `via link · ${when}` : when;
  }
  if (guest.sent_at) return `enviado ${formatRelative(guest.sent_at, now)}`;
  return "não enviado";
}
