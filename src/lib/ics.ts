import { event, ogTitle } from "@/lib/event";

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildEventIcs(now: Date = new Date()): string {
  const start = new Date(event.startsAt);
  const end = new Date(start.getTime() + event.durationHours * 3_600_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//festa-da-manu//rsvp//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${toIcsDate(start)}-${event.celebrant.name.toLowerCase()}@${event.domain}`,
    `DTSTAMP:${toIcsDate(now)}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(ogTitle())}`,
    `LOCATION:${escapeText(event.venue.address)}`,
    `DESCRIPTION:${escapeText(`Aniversário de ${event.celebrant.age} ano da ${event.celebrant.name}. ${event.venue.mapsUrl}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
