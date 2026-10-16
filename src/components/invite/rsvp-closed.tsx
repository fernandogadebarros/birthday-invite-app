import { buttonClasses } from "@/components/ui/button";
import { event, formatDayMonth, formatNumericDayMonth, type EventSettings } from "@/lib/event";
import { whatsappUrl } from "@/lib/whatsapp";

// Not in the design: composed from existing tokens (deadline pill + form card).
export function RsvpClosed({ settings }: { settings: EventSettings }) {
  return (
    <section className="flex flex-col items-start gap-3.5 rounded-card border border-line bg-panel p-6">
      <span className="flex h-10 items-center rounded-full border border-deadline-border bg-deadline-bg px-3.5 font-sans text-caption font-medium text-gold">
        prazo de confirmação · {formatDayMonth(settings.rsvpDeadline)} · encerrado
      </span>
      <h2 className="m-0 font-sans text-title leading-[1.2] font-semibold tracking-tight text-ink">Confirmações encerradas</h2>
      <p className="m-0 font-sans text-body leading-[1.6] text-body">
        O prazo para confirmar presença terminou em {formatNumericDayMonth(settings.rsvpDeadline)}. Se precisar falar com a gente, chame a{" "}
        {event.contact.name} no WhatsApp.
      </p>
      <a
        href={whatsappUrl(event.contact.phone, "")}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses({ variant: "secondary" })}
      >
        Falar com a {event.contact.name} ↗
      </a>
    </section>
  );
}
