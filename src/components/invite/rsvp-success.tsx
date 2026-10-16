import { Button, buttonClasses } from "@/components/ui/button";
import { event, formatHour, formatLongDate, formatNumericDayMonth } from "@/lib/event";
import { firstName, pluralizePeople } from "@/lib/format";
import type { PublicGuest } from "@/lib/guest";

type RsvpSuccessProps = {
  guest: PublicGuest;
  canEdit: boolean;
  onEdit: () => void;
};

export function RsvpSuccess({ guest, canEdit, onEdit }: RsvpSuccessProps) {
  const first = firstName(guest.name);
  const going = guest.status === "yes";
  const total = 1 + guest.companions_count;
  const deadline = formatNumericDayMonth(event.rsvpDeadline);

  const title = going ? `Tudo certo, ${first}. Te vemos lá!` : `Obrigado por avisar, ${first}.`;
  const body = going
    ? `Confirmamos ${pluralizePeople(total)} para ${formatLongDate(event.startsAt)}, às ${formatHour(event.startsAt)}, no ${event.venue.name}.` +
      (canEdit ? ` Você pode alterar a resposta até ${deadline} por este mesmo link.` : "")
    : "Sua resposta foi registrada." + (canEdit ? ` Se mudar de ideia, é só voltar neste link até ${deadline}.` : "");

  return (
    <section
      aria-live="polite"
      className="flex flex-col gap-3.5 self-start rounded-card border border-line bg-panel px-6 py-7 shadow-ring-accent"
    >
      <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-accent font-sans text-16 font-semibold text-white">
        ✓
      </span>
      <h2 className="m-0 font-sans text-22 leading-[1.2] font-semibold tracking-tight text-ink">{title}</h2>
      <p className="m-0 font-sans text-14 leading-[1.6] text-body">{body}</p>
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <Button variant="secondary" onClick={onEdit}>
            Alterar resposta
          </Button>
        )}
        {going && (
          <a href="/calendar.ics" download className={buttonClasses({ variant: "ghost" })}>
            Adicionar à agenda
          </a>
        )}
      </div>
    </section>
  );
}
