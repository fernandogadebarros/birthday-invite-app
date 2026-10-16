// Unambiguous alphabet (no 0/o, 1/l/i) so codes are easy to read aloud.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function slugFirstName(name: string): string {
  const first = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)[0]
    ?.replace(/[^a-z]/g, "");
  return first || "convidado";
}

export function randomSuffix(length = 4): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** "Júlia Pires" -> "julia-k7q2". Random suffix keeps links non-guessable. */
export function createGuestCode(name: string): string {
  return `${slugFirstName(name)}-${randomSuffix()}`;
}
