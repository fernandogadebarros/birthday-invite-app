import { firstName } from "@/lib/format";

export function fillMessage(template: string, guestName: string): string {
  return template.replace(/\{nome\}/g, firstName(guestName));
}

export function inviteUrl(code: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}/invite/${code}`;
}

export function inviteText(template: string, guestName: string, url: string): string {
  return `${fillMessage(template, guestName)} ${url}`;
}

/** Click-to-chat link; `phone` is digits with country code and DDD (55 + DDD + number). */
export function whatsappUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
