import { describe, expect, it } from "vitest";
import { defaultEventSettings } from "@/lib/event";
import { eventSettingsSchema, toFields } from "@/lib/event-settings";

describe("event settings fields", () => {
  it("shows the saved instants in São Paulo time", () => {
    expect(toFields(defaultEventSettings)).toEqual({
      date: "2026-11-07",
      time: "12:00",
      deadlineDate: "2026-10-31",
      venue: "Jaraguá Clube Campestre",
      spot: "Quiosque da Amizade",
    });
    // Same instant stored as UTC by Postgres.
    expect(toFields({ ...defaultEventSettings, startsAt: "2026-11-07T15:00:00+00:00" }).time).toBe("12:00");
  });

  it("turns the form values into instants, deadline at the end of the day", () => {
    const parsed = eventSettingsSchema.parse({ date: "2026-12-05", time: "15:30", deadlineDate: "2026-11-30", venue: "  Salão Azul  ", spot: " Mesa 3 " });
    expect(parsed).toEqual({
      startsAt: "2026-12-05T15:30:00-03:00",
      rsvpDeadline: "2026-11-30T23:59:59-03:00",
      venue: "Salão Azul",
      spot: "Mesa 3",
    });
  });

  it("rejects invalid values", () => {
    const base = { date: "2026-12-05", time: "15:30", deadlineDate: "2026-11-30", venue: "Salão", spot: "Mesa 3" };
    expect(eventSettingsSchema.safeParse({ ...base, venue: "  " }).success).toBe(false);
    expect(eventSettingsSchema.safeParse({ ...base, spot: " " }).success).toBe(false);
    expect(eventSettingsSchema.safeParse({ ...base, time: "25:00" }).success).toBe(false);
    expect(eventSettingsSchema.safeParse({ ...base, date: "" }).success).toBe(false);
    expect(eventSettingsSchema.safeParse({ ...base, deadlineDate: "2026-12-06" }).success).toBe(false);
  });
});
