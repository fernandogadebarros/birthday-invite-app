import { event, formatDayMonth, formatHour, formatShortDate } from "@/lib/event";
import { InviteHero } from "@/components/invite/invite-hero";

function InfoCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1 bg-panel px-3.5 py-3">
      <span className="label-caps">{label}</span>
      <span className={`font-sans text-14 font-medium ${highlight ? "text-gold" : "text-ink"}`}>{value}</span>
    </div>
  );
}

export function InviteCard({ greeting }: { greeting: string }) {
  return (
    <section className="self-start overflow-hidden rounded-card border border-line bg-card">
      <InviteHero />
      <div className="flex flex-col gap-3.5 px-6 pt-6 pb-[26px]">
        <span className="font-sans text-12 font-semibold tracking-greeting text-accent uppercase">{greeting}</span>
        <h1 className="m-0 font-sans text-34 leading-[1.1] font-semibold tracking-tight text-balance text-ink">{event.copy.title}</h1>
        <p className="m-0 font-sans text-14 leading-[1.6] text-pretty text-body">{event.copy.description}</p>
        <div className="mt-1.5 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-px overflow-hidden rounded-panel border border-line-subtle bg-line-subtle">
          <InfoCell label="Data" value={formatShortDate(event.startsAt)} />
          <InfoCell label="Hora" value={formatHour(event.startsAt)} />
          <InfoCell label="Confirme até" value={formatDayMonth(event.rsvpDeadline)} highlight />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-panel border border-line-subtle bg-panel px-3.5 py-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="label-caps">Local</span>
            <span className="font-sans text-14 font-medium text-ink">{event.venue.name}</span>
          </div>
          <a href={event.venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-sans text-12 font-medium whitespace-nowrap">
            ver mapa ↗
          </a>
        </div>
      </div>
    </section>
  );
}
