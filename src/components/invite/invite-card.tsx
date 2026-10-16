import { event, formatDayMonth, formatHour, formatShortDate, mapsUrl, type EventSettings } from "@/lib/event";
import { InviteVideo } from "@/components/invite/invite-video";

function InfoCell({ label, value, highlight, className }: { label: string; value: string; highlight?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 bg-panel px-3.5 py-3 ${className ?? ""}`}>
      <span className="label-caps">{label}</span>
      <span className={`font-sans text-body font-medium ${highlight ? "text-gold" : "text-ink"}`}>{value}</span>
    </div>
  );
}

export function InviteCard({ greeting, settings }: { greeting: string; settings: EventSettings }) {
  return (
    <section className="overflow-hidden rounded-card border border-line bg-card">
      <InviteVideo />
      <div className="flex flex-col gap-3.5 px-6 pt-6 pb-[26px]">
        <span className="font-sans text-caption font-semibold tracking-greeting text-accent uppercase">{greeting}</span>
        <h1 className="m-0 font-sans text-display leading-[1.1] font-semibold tracking-tight text-balance text-ink">{event.copy.title}</h1>
        <p className="m-0 font-sans text-body leading-[1.6] text-pretty text-body">{event.copy.description}</p>
        <div className="mt-1.5 grid grid-cols-2 gap-px min-[460px]:grid-cols-3 overflow-hidden rounded-panel border border-line-subtle bg-line-subtle">
          <InfoCell label="Data" value={formatShortDate(settings.startsAt)} />
          <InfoCell label="Hora" value={formatHour(settings.startsAt)} />
          <InfoCell label="Confirme até" value={formatDayMonth(settings.rsvpDeadline)} highlight className="col-span-2 min-[460px]:col-span-1" />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-panel border border-line-subtle bg-panel px-3.5 py-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="label-caps">Local</span>
            <span className="font-sans text-body font-medium text-ink">{settings.venue}</span>
          </div>
          <a href={mapsUrl(settings.venue)} target="_blank" rel="noopener noreferrer" className="font-sans text-caption font-medium whitespace-nowrap">
            ver mapa ↗
          </a>
        </div>
      </div>
    </section>
  );
}
