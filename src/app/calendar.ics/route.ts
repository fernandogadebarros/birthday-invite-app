import { buildEventIcs } from "@/lib/ics";

export function GET() {
  return new Response(buildEventIcs(new Date("2026-01-01T00:00:00Z")), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="aniversario-manuela.ics"',
    },
  });
}
