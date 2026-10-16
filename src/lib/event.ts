// Single source of truth for the party. Everything shown to guests and admins
// (dates, place, copy, WhatsApp message) is derived from this object.
export const event = {
  celebrant: {
    name: "Manuela",
    nickname: "Manu",
    age: 1,
  },
  startsAt: "2026-11-07T12:00:00-03:00",
  durationHours: 4,
  rsvpDeadline: "2026-10-31T23:59:59-03:00",
  timeZone: "America/Sao_Paulo",
  venue: {
    name: "Clube do Jaraguá",
    // TODO: endereço completo ainda a confirmar.
    address: "Clube do Jaraguá",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Clube+do+Jaragu%C3%A1",
  },
  contact: {
    name: "Carol",
    relation: "mãe da Manu",
    // Placeholder: only digits, with DDD, without +55.
    phone: "11988880000",
  },
  // Placeholder domain shown in the WhatsApp preview; the real link uses NEXT_PUBLIC_SITE_URL.
  domain: "manu1.rsvp.app",
  maxCompanions: 5,
  copy: {
    brand: "festa da manu",
    title: "Venha comemorar comigo!",
    description:
      "Vamos comemorar o primeiro ano da Manu com um almoço no clube, bolo, brincadeiras e as pessoas que ela mais ama. Confirme até o prazo pra gente acertar o buffet e as lembrancinhas.",
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

export function isRsvpClosed(now: Date = new Date(), deadline: string = event.rsvpDeadline): boolean {
  return now.getTime() > new Date(deadline).getTime();
}

/** Whole calendar days from `now` until the deadline day (0 on the deadline day). */
export function daysUntilDeadline(now: Date = new Date(), deadline: string = event.rsvpDeadline): number {
  const toDayNumber = (d: Date) => {
    const p = dateParts(d);
    return Date.UTC(p.year, p.month, p.day) / 86_400_000;
  };
  return Math.max(0, toDayNumber(new Date(deadline)) - toDayNumber(now));
}

/** "faltam 18 dias" / "último dia" / "encerrado" */
export function deadlineCountdownLabel(now: Date = new Date()): string {
  if (isRsvpClosed(now)) return "encerrado";
  const days = daysUntilDeadline(now);
  if (days === 0) return "último dia";
  return days === 1 ? "falta 1 dia" : `faltam ${days} dias`;
}

/** Default WhatsApp message; `{nome}` becomes each guest's first name. */
export function defaultInviteMessage(): string {
  const { nickname, age } = event.celebrant;
  return (
    `Oi, {nome}! A ${nickname} vai fazer ${age} ${ageLabel(age)} no dia ${formatNumericDayMonth(event.startsAt)}, ` +
    `às ${formatHour(event.startsAt)}, no ${event.venue.name}, e a gente quer muito você lá. ` +
    `Confirma sua presença até ${formatNumericDayMonth(event.rsvpDeadline)} por aqui:`
  );
}

export function ogTitle(): string {
  const { name, age } = event.celebrant;
  return `A ${name} faz ${age} ${ageLabel(age)}!`;
}

export function ogDescription(): string {
  return `${formatShortDate(event.startsAt)} · ${formatHour(event.startsAt)} · confirme sua presença`;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
