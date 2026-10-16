import { z } from "zod";
import { event } from "@/lib/event";

export const rsvpSchema = z
  .object({
    code: z.string().trim().min(1).max(64),
    status: z.enum(["yes", "no"]),
    companionsCount: z.number().int().min(0).max(event.maxCompanions),
    companionsNames: z.array(z.string().trim().min(1).max(120)).max(event.maxCompanions),
  })
  .transform((data) =>
    data.status === "no" ? { ...data, companionsCount: 0, companionsNames: [] } : data,
  )
  .refine((data) => data.companionsNames.length === data.companionsCount, {
    message: "Informe o nome de cada acompanhante.",
    path: ["companionsNames"],
  });

export type RsvpInput = z.input<typeof rsvpSchema>;
export type Rsvp = z.output<typeof rsvpSchema>;

export const newGuestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{10,11}$/, "WhatsApp com DDD")),
});
