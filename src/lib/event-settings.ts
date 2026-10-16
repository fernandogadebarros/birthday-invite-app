import { z } from "zod";
import { dateParts, type EventSettings } from "@/lib/event";

// Brazil has no daylight saving time, so a fixed offset is safe.
const OFFSET = "-03:00";
const pad = (n: number) => String(n).padStart(2, "0");

export type EventSettingsFields = {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  deadlineDate: string; // YYYY-MM-DD, answers are accepted until the end of this day
  venue: string;
  spot: string;
};

export function toFields(settings: EventSettings): EventSettingsFields {
  const start = dateParts(settings.startsAt);
  const deadline = dateParts(settings.rsvpDeadline);
  return {
    date: `${start.year}-${pad(start.month + 1)}-${pad(start.day)}`,
    time: `${pad(start.hour)}:${pad(start.minute)}`,
    deadlineDate: `${deadline.year}-${pad(deadline.month + 1)}-${pad(deadline.day)}`,
    venue: settings.venue,
    spot: settings.spot,
  };
}

export const eventSettingsSchema = z
  .object({
    date: z.iso.date("Informe a data da festa."),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Informe o horário."),
    deadlineDate: z.iso.date("Informe até quando confirmar."),
    venue: z.string().trim().min(1, "Informe o local.").max(200),
    spot: z.string().trim().min(1, "Informe onde será a festa.").max(100),
  })
  .refine((f) => f.deadlineDate <= f.date, {
    message: "O prazo para confirmar deve ser até o dia da festa.",
    path: ["deadlineDate"],
  })
  .transform(
    (f): EventSettings => ({
      startsAt: `${f.date}T${f.time}:00${OFFSET}`,
      rsvpDeadline: `${f.deadlineDate}T23:59:59${OFFSET}`,
      venue: f.venue,
      spot: f.spot,
    }),
  );
