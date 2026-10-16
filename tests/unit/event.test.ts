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
  isRsvpClosed,
  ogDescription,
  ogTitle,
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
    expect(ogDescription()).toBe("Sáb, 07 nov · 12h · confirme sua presença");
  });

  it("builds the default WhatsApp message from the config", () => {
    expect(defaultInviteMessage()).toBe(
      "Oi, {nome}! A Manu vai fazer 1 aninho no dia 07/11, às 12h, no Clube do Jaraguá, e a gente quer muito você lá. Confirma sua presença até 31/10 por aqui:",
    );
  });
});

describe("deadline", () => {
  it("closes only after the end of the deadline day in São Paulo", () => {
    expect(isRsvpClosed(new Date("2026-10-31T23:00:00-03:00"))).toBe(false);
    expect(isRsvpClosed(new Date("2026-11-01T00:00:01-03:00"))).toBe(true);
  });

  it("counts calendar days left", () => {
    expect(daysUntilDeadline(new Date("2026-10-13T10:00:00-03:00"))).toBe(18);
    expect(deadlineCountdownLabel(new Date("2026-10-13T10:00:00-03:00"))).toBe("faltam 18 dias");
    expect(deadlineCountdownLabel(new Date("2026-10-30T22:00:00-03:00"))).toBe("falta 1 dia");
    expect(deadlineCountdownLabel(new Date("2026-10-31T09:00:00-03:00"))).toBe("último dia");
    expect(deadlineCountdownLabel(new Date("2026-11-02T09:00:00-03:00"))).toBe("encerrado");
  });
});
