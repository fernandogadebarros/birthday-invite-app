import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { formatPhone } from "@/lib/format";
import type { Guest } from "@/lib/guest";
import { guestActivityLabel } from "@/lib/guest-stats";

const GRID = "grid grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)_minmax(0,1.6fr)_150px] gap-3";

const STATUS = {
  yes: { tone: "accent", label: "● vai" },
  pending: { tone: "amber", label: "○ pendente" },
  no: { tone: "neutral", label: "× não vai" },
} as const;

function companionsLabel(guest: Guest): string {
  if (guest.status !== "yes") return "—";
  if (!guest.companions_count) return "só o convidado";
  return `+${guest.companions_count} ${guest.companions_count > 1 ? "pessoas" : "pessoa"}`;
}

function sendButton(guest: Guest) {
  if (guest.status !== "pending") return { label: "Reenviar", variant: "secondary" as const };
  if (guest.sent_at) return { label: "Lembrar ↗", variant: "secondary" as const };
  return { label: "Enviar ↗", variant: "primary" as const };
}

type GuestTableProps = {
  guests: Guest[];
  now: Date;
  onSend: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
};

export function GuestTable({ guests, now, onSend, onDelete }: GuestTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className={`${GRID} border-b border-line-subtle px-4 py-2.5 label-caps`}>
          <span>Convidado</span>
          <span>Status</span>
          <span>Acompanhantes</span>
          <span className="text-right">Convite</span>
        </div>
        {guests.map((guest) => {
          const status = STATUS[guest.status];
          const button = sendButton(guest);
          return (
            <div key={guest.id} className={`${GRID} items-center border-b border-line-subtle px-4 py-3 hover:bg-hover`}>
              <div className="flex min-w-0 flex-col gap-[3px]">
                <span className="truncate font-sans text-body font-medium text-ink">{guest.name}</span>
                <span className="font-sans text-micro text-muted">{guest.phone ? formatPhone(guest.phone) : "—"}</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <Tag tone={status.tone}>{status.label}</Tag>
                <span className="font-sans text-micro text-faint">{guestActivityLabel(guest, now)}</span>
              </div>
              <div className="flex min-w-0 flex-col gap-[3px]">
                <span className="font-sans text-small font-medium text-body">{companionsLabel(guest)}</span>
                {guest.status === "yes" && guest.companions_names.length > 0 && (
                  <span className="truncate font-sans text-micro text-muted">{guest.companions_names.join(", ")}</span>
                )}
              </div>
              <div className="flex items-center justify-end gap-1.5">
                {guest.phone && (
                  <Button size="sm" variant={button.variant} onClick={() => onSend(guest)}>
                    {button.label}
                  </Button>
                )}
                <button
                  type="button"
                  aria-label={`Excluir ${guest.name}`}
                  title="Excluir convidado"
                  onClick={() => onDelete(guest)}
                  className="size-8 flex-none cursor-pointer rounded-full border-0 bg-transparent font-sans text-lead text-muted hover:bg-hover hover:text-accent"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
        {guests.length === 0 && <div className="p-8 text-center font-sans text-caption text-muted">nenhum convidado neste filtro</div>}
      </div>
    </div>
  );
}
