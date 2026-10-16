export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** "11987650001" -> "(11) 98765-0001" */
export function formatPhone(phone: string): string {
  const d = onlyDigits(phone);
  if (d.length < 10) return phone;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

/** Progressive mask while typing: "(11) 9 8765-0001" style without forcing the 9. */
export function maskPhoneInput(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

export function pluralizePeople(n: number): string {
  return `${n} ${n === 1 ? "pessoa" : "pessoas"}`;
}

/** "agora", "há 5min", "há 3h", "ontem", "há 2d" */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ontem";
  return `há ${days}d`;
}

/** Splits the companions textarea (one name per line) into clean names. */
export function parseNames(text: string): string[] {
  return text
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);
}
