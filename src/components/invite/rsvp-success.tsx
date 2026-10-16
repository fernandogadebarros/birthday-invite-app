import { Button } from "@/components/ui/button";
import { formatHour, formatLongDate, formatNumericDayMonth, type EventSettings } from "@/lib/event";
import { firstName, pluralizePeople } from "@/lib/format";
import type { PublicGuest } from "@/lib/guest";

type RsvpSuccessProps = {
  guest: PublicGuest;
  canEdit: boolean;
  onEdit: () => void;
  settings: EventSettings;
};

export function RsvpSuccess({ guest, canEdit, onEdit, settings }: RsvpSuccessProps) {
  const first = firstName(guest.name);
  const going = guest.status === "yes";
  const total = 1 + guest.companions_count;
  const deadline = formatNumericDayMonth(settings.rsvpDeadline);

  const title = going ? `Tudo certo, ${first}. Te vemos lá!` : `Obrigado por avisar, ${first}.`;
  const body = going
    ? `Confirmamos ${pluralizePeople(total)} para ${formatLongDate(settings.startsAt)}, às ${formatHour(settings.startsAt)}, em ${settings.venue}.` +
      (canEdit ? ` Você pode alterar a resposta até ${deadline} por este mesmo link.` : "")
    : "Sua resposta foi registrada." + (canEdit ? ` Se mudar de ideia, é só voltar neste link até ${deadline}.` : "");

  return (
    <section
      aria-live="polite"
      className="flex flex-col gap-3.5 rounded-card border border-line bg-panel px-6 py-7 shadow-ring-accent"
    >
      <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-accent font-sans text-lead font-semibold text-white">
        ✓
      </span>
      <h2 className="m-0 font-sans text-title leading-[1.2] font-semibold tracking-tight text-ink">{title}</h2>
      <p className="m-0 font-sans text-body leading-[1.6] text-body">{body}</p>
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <Button variant="secondary" onClick={onEdit}>
            Alterar resposta
          </Button>
        )}
      </div>
    </section>
  );
}
