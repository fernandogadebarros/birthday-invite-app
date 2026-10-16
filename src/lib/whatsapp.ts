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

/** Click-to-chat link; `phone` is digits with DDD and without +55. */
export function whatsappUrl(phone: string, text: string): string {
  return `https://wa.me/55${phone}?text=${encodeURIComponent(text)}`;
}
