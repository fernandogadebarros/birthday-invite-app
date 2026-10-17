import { describe, expect, it } from "vitest";
import {
  daysUntilDeadline,
  deadlineCountdownLabel,
  defaultInviteMessage,
  formatCompactDate,
  formatDayMonth,
  formatHour,
  formatLongDate,
  formatNumericDayMonth,
  formatShortDate,
  formatWeekdayDate,
  inviteWhen,
  isRsvpClosed,
  mapsUrl,
  ogDescription,
  ogTitle,
  defaultEventSettings,
} from "@/lib/event";

describe("event formatting", () => {
  it("matches the strings used in the design", () => {
    expect(formatShortDate("2026-11-07T12:00:00-03:00")).toBe("Sáb, 07 nov");
    expect(formatHour("2026-11-07T12:00:00-03:00")).toBe("12h");
    expect(formatDayMonth("2026-10-31T23:59:59-03:00")).toBe("31 out");
    expect(formatNumericDayMonth("2026-11-07T12:00:00-03:00")).toBe("07/11");
    expect(formatLongDate("2026-11-07T12:00:00-03:00")).toBe("sábado, 07 de novembro");
    expect(formatCompactDate("2026-11-07T12:00:00-03:00")).toBe("sáb 07 nov");
    expect(ogTitle()).toBe("A Manuela faz 1 aninho!");
    expect(ogDescription(defaultEventSettings)).toBe("Sáb, 07 nov · 12h · confirme sua presença");
  });

  it("builds the default WhatsApp message from the config", () => {
    expect(defaultInviteMessage(defaultEventSettings)).toBe(
      [
        "Olá, {nome}!",
        "",
        "A Manu vai fazer 1 aninho e queremos te convidar para comemorar esse dia especial com a gente! 💕🐭",
        "",
        "🗓️ Dia: 07/nov (sábado)",
        "🕐 Hora: 12h",
        "📍 Onde: Jaraguá Clube Campestre - Quiosque da Amizade",
        "",
        "Endereço: Av. Dr. Felipe Pinel, 2008 - Pirituba, São Paulo - SP, 02939-000",
        "",
        "Confirme sua presença:",
      ].join("\n"),
    );
  });
});

describe("event settings", () => {
  it("builds the map link from the venue text", () => {
    expect(mapsUrl("Clube do Jaraguá, Rua A 10")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Clube%20do%20Jaragu%C3%A1%2C%20Rua%20A%2010",
    );
  });

  it("uses the edited details in the messages", () => {
    const settings = { startsAt: "2026-12-05T15:30:00-03:00", rsvpDeadline: "2026-11-30T23:59:59-03:00", venue: "Salão Azul, Rua B 20", spot: "Mesa 3" };
    expect(ogDescription(settings)).toBe("Sáb, 05 dez · 15h30 · confirme sua presença");
    expect(defaultInviteMessage(settings)).toContain("🗓️ Dia: 05/dez (sábado)\n🕐 Hora: 15h30\n📍 Onde: Salão Azul, Rua B 20 - Mesa 3");
    expect(formatWeekdayDate(settings.startsAt)).toBe("Sábado, 05 dez");
    expect(inviteWhen(settings)).toBe("dia 05/12 (sábado) às 15h30");
  });
});

describe("deadline", () => {
  it("closes only after the end of the deadline day in São Paulo", () => {
    expect(isRsvpClosed(defaultEventSettings.rsvpDeadline, new Date("2026-10-31T23:00:00-03:00"))).toBe(false);
    expect(isRsvpClosed(defaultEventSettings.rsvpDeadline, new Date("2026-11-01T00:00:01-03:00"))).toBe(true);
  });

  it("counts calendar days left", () => {
    expect(daysUntilDeadline(defaultEventSettings.rsvpDeadline, new Date("2026-10-13T10:00:00-03:00"))).toBe(18);
    expect(deadlineCountdownLabel(defaultEventSettings.rsvpDeadline, new Date("2026-10-13T10:00:00-03:00"))).toBe("faltam 18 dias");
    expect(deadlineCountdownLabel(defaultEventSettings.rsvpDeadline, new Date("2026-10-30T22:00:00-03:00"))).toBe("falta 1 dia");
    expect(deadlineCountdownLabel(defaultEventSettings.rsvpDeadline, new Date("2026-10-31T09:00:00-03:00"))).toBe("último dia");
    expect(deadlineCountdownLabel(defaultEventSettings.rsvpDeadline, new Date("2026-11-02T09:00:00-03:00"))).toBe("encerrado");
  });
});
