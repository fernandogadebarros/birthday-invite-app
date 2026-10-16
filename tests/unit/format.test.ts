import { describe, expect, it } from "vitest";
import { firstName, formatPhone, formatRelative, maskPhoneInput, parseNames, pluralizePeople } from "@/lib/format";

describe("format", () => {
  it("formats phones like the design", () => {
    expect(formatPhone("11987650001")).toBe("(11) 98765-0001");
    expect(formatPhone("1132650001")).toBe("(11) 3265-0001");
    expect(maskPhoneInput("11987650001")).toBe("(11) 98765-0001");
    expect(maskPhoneInput("119")).toBe("(11) 9");
  });

  it("formats relative times", () => {
    const now = new Date("2026-10-15T12:00:00Z");
    expect(formatRelative("2026-10-15T11:59:40Z", now)).toBe("agora");
    expect(formatRelative("2026-10-15T09:00:00Z", now)).toBe("há 3h");
    expect(formatRelative("2026-10-14T10:00:00Z", now)).toBe("ontem");
    expect(formatRelative("2026-10-13T10:00:00Z", now)).toBe("há 2d");
  });

  it("parses names and words", () => {
    expect(parseNames(" Luiza \n\nTheo Moreira\n ")).toEqual(["Luiza", "Theo Moreira"]);
    expect(firstName("  Marina Costa ")).toBe("Marina");
    expect(pluralizePeople(1)).toBe("1 pessoa");
    expect(pluralizePeople(3)).toBe("3 pessoas");
  });
});
