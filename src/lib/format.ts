export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** "5511987650001" -> "(55) 11 98765-0001" (stored with country code, 12-13 digits) */
export function formatPhone(phone: string): string {
  const d = onlyDigits(phone);
  if (d.length < 12) return phone;
  return `(${d.slice(0, 2)}) ${d.slice(2, 4)} ${d.slice(4, d.length - 4)}-${d.slice(-4)}`;
}

/** Progressive mask while typing: "(55) 11 98765-0001". The country code is always 55. */
export function maskPhoneInput(value: string): string {
  let d = onlyDigits(value);
  if (d.startsWith("55")) d = d.slice(2);
  d = `55${d.slice(0, 11)}`;
  if (d.length <= 2) return "(55) ";
  if (d.length <= 4) return `(55) ${d.slice(2)}`;
  if (d.length <= 8) return `(55) ${d.slice(2, 4)} ${d.slice(4)}`;
  return `(55) ${d.slice(2, 4)} ${d.slice(4, d.length - 4)}-${d.slice(-4)}`;
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

// Anything people use to separate names: line breaks, punctuation, symbols, a spaced
// dash ("Ana - Bia"), two or more spaces in a row or the words "e"/"ou". A single space
// ("Ana Clara") and a dash inside a name ("Ana-Clara") are kept.
const NAME_SEPARATORS = /[\n\r,;:|/\\&+*#•·]+|[ \t]{2,}|\s[-–—]+\s|\s+(?:e|ou)\s+/i;
const EDGE_NON_LETTERS = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;

/** Splits the companions textarea into clean names, whatever the separator. */
export function parseNames(text: string): string[] {
  return text
    .split(NAME_SEPARATORS)
    .map((n) => n.replace(EDGE_NON_LETTERS, "").trim())
    .filter(Boolean);
}
