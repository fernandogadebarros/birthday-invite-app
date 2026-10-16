import { describe, expect, it } from "vitest";
import { createGuestCode, slugFirstName } from "@/lib/guest-code";
import { computeStats, guestActivityLabel } from "@/lib/guest-stats";
import { fillMessage, inviteText, inviteUrl, whatsappUrl } from "@/lib/whatsapp";
import { rsvpSchema, newGuestSchema } from "@/lib/rsvp-schema";

describe("guest code", () => {
  it("slugs the first name without accents", () => {
    expect(slugFirstName("Júlia e família Pires")).toBe("julia");
    expect(slugFirstName("  ")).toBe("convidado");
    expect(createGuestCode("Marina Costa")).toMatch(/^marina-[a-z2-9]{4}$/);
  });
});

describe("whatsapp", () => {
  it("fills the template and encodes the link", () => {
    const url = inviteUrl("marina-k7q2", "https://manu1.rsvp.app/");
    expect(url).toBe("https://manu1.rsvp.app/invite/marina-k7q2");
    const text = inviteText("Oi, {nome}! Confirma:", "Marina Costa", url);
    expect(text).toBe("Oi, Marina! Confirma: https://manu1.rsvp.app/invite/marina-k7q2");
    expect(fillMessage("{nome} e {nome}", "Ana")).toBe("Ana e Ana");
    expect(whatsappUrl("11987650001", "Oi & tchau")).toBe("https://wa.me/5511987650001?text=Oi%20%26%20tchau");
  });
});

describe("stats", () => {
  it("counts people as confirmed guests + companions", () => {
    const stats = computeStats([
      { status: "yes", companions_count: 2 },
      { status: "yes", companions_count: 0 },
      { status: "yes", companions_count: 3 },
      { status: "no", companions_count: 0 },
      { status: "pending", companions_count: 0 },
    ]);
    expect(stats).toEqual({ people: 8, yes: 3, companions: 5, pending: 1, no: 1 });
  });

  it("labels guest activity", () => {
    const now = new Date("2026-10-15T12:00:00Z");
    expect(guestActivityLabel({ status: "pending", sent_at: null, responded_at: null, source: "invite" }, now)).toBe("não enviado");
    expect(guestActivityLabel({ status: "pending", sent_at: "2026-10-13T10:00:00Z", responded_at: null, source: "invite" }, now)).toBe("enviado há 2d");
    expect(guestActivityLabel({ status: "yes", sent_at: null, responded_at: "2026-10-15T09:00:00Z", source: "invite" }, now)).toBe("há 3h");
  });
});

describe("rsvp schema", () => {
  const base = { name: "Marina", status: "yes" as const, companionsCount: 2, companionsNames: ["Ana"] };

  it("accepts up to the declared number of names", () => {
    expect(rsvpSchema.safeParse(base).success).toBe(true);
    expect(rsvpSchema.safeParse({ ...base, companionsNames: ["A", "B", "C"] }).success).toBe(false);
  });

  it("rejects empty names and more than 5 companions", () => {
    expect(rsvpSchema.safeParse({ ...base, name: "  " }).success).toBe(false);
    expect(rsvpSchema.safeParse({ ...base, companionsCount: 6 }).success).toBe(false);
  });

  it("drops companions when not going", () => {
    const parsed = rsvpSchema.parse({ ...base, status: "no" });
    expect(parsed.companionsCount).toBe(0);
    expect(parsed.companionsNames).toEqual([]);
  });

  it("normalizes new guest phones", () => {
    expect(newGuestSchema.parse({ name: "Ana", phone: "(11) 98765-0001" }).phone).toBe("11987650001");
    expect(newGuestSchema.safeParse({ name: "Ana", phone: "1234" }).success).toBe(false);
  });
});
