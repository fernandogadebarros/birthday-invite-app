// Fixed facts and copy about the party. The details the hosts edit in the admin
// area (date, time, RSVP deadline, venue) live in the database; `defaultEventSettings`
// is only the starting value used before anything is saved.
export type EventSettings = {
  /** ISO instant with offset, e.g. 2026-11-07T12:00:00-03:00 */
  startsAt: string;
  /** Last moment guests can answer */
  rsvpDeadline: string;
  /** Free text: place name and/or address; also drives the map link */
  venue: string;
  spot: string;
};

export const defaultEventSettings: EventSettings = {
  startsAt: "2026-11-07T12:00:00-03:00",
  rsvpDeadline: "2026-10-31T23:59:59-03:00",
  venue: "Jaraguá Clube Campestre",
  spot: "Quiosque da Amizade",
};

export const event = {
  celebrant: {
    name: "Manuela",
    nickname: "Manu",
    age: 1,
  },
  timeZone: "America/Sao_Paulo",
  contact: {
    name: "Veronica",
    relation: "mãe da Manu",
    // Only digits, with DDD, without +55.
    phone: "11985798777",
  },
  // Placeholder domain shown in the WhatsApp preview; the real link uses NEXT_PUBLIC_SITE_URL.
  domain: "manu1.rsvp.app",
  maxCompanions: 5,
  copy: {
    brand: "Festa da Manu",
    title: "Venha comemorar com a gente!",
    confirmRequest: "Por favor, confirme sua presença para nos ajudar com a organização.",
    missYou: "a Manu vai sentir sua falta",
  },
} as const;

const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const WEEKDAYS_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

type DateParts = { year: number; month: number; day: number; weekday: number; hour: number; minute: number };

// Calendar parts of an instant in the event's time zone.
export function dateParts(iso: string | Date, timeZone: string = event.timeZone): DateParts {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    year: Number(get("year")),
    month: Number(get("month")) - 1,
    day: Number(get("day")),
    weekday: weekdays.indexOf(get("weekday")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "12h" or "12h30" */
export function formatHour(iso: string): string {
  const { hour, minute } = dateParts(iso);
  return minute ? `${hour}h${pad(minute)}` : `${hour}h`;
}

/** "Sáb, 07 nov" */
export function formatShortDate(iso: string): string {
  const p = dateParts(iso);
  return `${capitalize(WEEKDAYS_SHORT[p.weekday])}, ${pad(p.day)} ${MONTHS_SHORT[p.month]}`;
}

/** "Sábado, 07 nov" */
export function formatWeekdayDate(iso: string): string {
  const p = dateParts(iso);
  return `${capitalize(WEEKDAYS[p.weekday])}, ${pad(p.day)} ${MONTHS_SHORT[p.month]}`;
}

/** "31 out" */
export function formatDayMonth(iso: string): string {
  const p = dateParts(iso);
  return `${pad(p.day)} ${MONTHS_SHORT[p.month]}`;
}

/** "07/11" */
export function formatNumericDayMonth(iso: string): string {
  const p = dateParts(iso);
  return `${pad(p.day)}/${pad(p.month + 1)}`;
}

/** "sábado, 07 de novembro" */
export function formatLongDate(iso: string): string {
  const p = dateParts(iso);
  return `${WEEKDAYS[p.weekday]}, ${pad(p.day)} de ${MONTHS[p.month]}`;
}

/** "sáb 07 nov" */
export function formatCompactDate(iso: string): string {
  const p = dateParts(iso);
  return `${WEEKDAYS_SHORT[p.weekday]} ${pad(p.day)} ${MONTHS_SHORT[p.month]}`;
}

export function ageLabel(age: number = event.celebrant.age): string {
  return age === 1 ? "aninho" : "aninhos";
}

/** Google Maps search for whatever the hosts typed in the venue field. */
export function mapsUrl(venue: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.trim())}`;
}

export function isRsvpClosed(deadline: string, now: Date = new Date()): boolean {
  return now.getTime() > new Date(deadline).getTime();
}

/** Whole calendar days from `now` until the deadline day (0 on the deadline day). */
export function daysUntilDeadline(deadline: string, now: Date = new Date()): number {
  const toDayNumber = (d: Date) => {
    const p = dateParts(d);
    return Date.UTC(p.year, p.month, p.day) / 86_400_000;
  };
  return Math.max(0, toDayNumber(new Date(deadline)) - toDayNumber(now));
}

/** "faltam 18 dias" / "último dia" / "encerrado" */
export function deadlineCountdownLabel(deadline: string, now: Date = new Date()): string {
  if (isRsvpClosed(deadline, now)) return "encerrado";
  const days = daysUntilDeadline(deadline, now);
  if (days === 0) return "último dia";
  return days === 1 ? "falta 1 dia" : `faltam ${days} dias`;
}

/** Street address shown in the WhatsApp message. */
const VENUE_ADDRESS = "Av. Dr. Felipe Pinel, 2008 - Pirituba, São Paulo - SP, 02939-000";

/** Default WhatsApp message; `{nome}` becomes each guest's first name and the invite link is appended after it. */
export function defaultInviteMessage(settings: EventSettings): string {
  const { nickname, age } = event.celebrant;
  const weekday = WEEKDAYS[dateParts(settings.startsAt).weekday];
  const where = settings.spot ? `${settings.venue} - ${settings.spot}` : settings.venue;
  return [
    "Olá, {nome}!",
    "",
    `A ${nickname} vai fazer ${age} ${ageLabel(age)} e queremos te convidar para comemorar esse dia especial com a gente! 💕🐭`,
    "",
    `🗓️ Dia: ${formatDayMonth(settings.startsAt).replace(" ", "/")} (${weekday})`,
    `🕐 Hora: ${formatHour(settings.startsAt)}`,
    `📍 Onde: ${where}`,
    "",
    `Endereço: ${VENUE_ADDRESS}`,
    "",
    "Confirme sua presença:",
  ].join("\n");
}

/** Venue and moment highlighted in the invite card paragraph, e.g. "07/11 (sábado) às 12h". */
export function inviteWhen(settings: EventSettings): string {
  const weekday = WEEKDAYS[dateParts(settings.startsAt).weekday];
  return `dia ${formatNumericDayMonth(settings.startsAt)} (${weekday}) às ${formatHour(settings.startsAt)}`;
}

export function ogTitle(): string {
  const { name, age } = event.celebrant;
  return `A ${name} faz ${age} ${ageLabel(age)}!`;
}

export function ogDescription(settings: EventSettings): string {
  return `${formatShortDate(settings.startsAt)} · ${formatHour(settings.startsAt)} · confirme sua presença`;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
