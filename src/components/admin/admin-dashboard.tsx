"use client";

import { useMemo, useState } from "react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EventDialog } from "@/components/admin/event-dialog";
import { GuestTable } from "@/components/admin/guest-table";
import { NewGuestRow } from "@/components/admin/new-guest-row";
import { SendDialog, type SendTarget } from "@/components/admin/send-dialog";
import { StatsCards } from "@/components/admin/stats-cards";
import { useGuestsRealtime } from "@/components/admin/use-guests-realtime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import {
  defaultInviteMessage,
  deadlineCountdownLabel,
  event,
  type EventSettings,
  formatCompactDate,
  formatDayMonth,
  formatHour,
} from "@/lib/event";
import type { Guest, GuestStatus } from "@/lib/guest";
import { computeStats } from "@/lib/guest-stats";

const FILTERS = [
  { value: "all", label: "Todos" },
  { value: "yes", label: "Confirmados" },
  { value: "pending", label: "Pendentes" },
  { value: "no", label: "Não vão" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

type AdminDashboardProps = {
  guests: Guest[];
  nowIso: string;
  baseUrl: string;
  settings: EventSettings;
};

export function AdminDashboard({ guests, nowIso, baseUrl, settings }: AdminDashboardProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  // Until the hosts edit the text, it follows the event details.
  const [customMessage, setMessage] = useState<string | null>(null);
  const message = customMessage ?? defaultInviteMessage(settings);
  const [editingEvent, setEditingEvent] = useState(false);
  const [target, setTarget] = useState<SendTarget | null>(null);
  const [deleting, setDeleting] = useState<Guest | null>(null);
  useGuestsRealtime();

  const now = useMemo(() => new Date(nowIso), [nowIso]);
  const stats = computeStats(guests);
  const pendingWithPhone = guests.filter((g) => g.status === "pending" && g.phone);

  const q = query.trim().toLowerCase();
  const rows = guests.filter(
    (g) => (filter === "all" || g.status === (filter as GuestStatus)) && (!q || g.name.toLowerCase().includes(q)),
  );

  const eventLine = `${event.celebrant.name} · ${event.celebrant.age} ano · ${formatCompactDate(settings.startsAt)}, ${formatHour(settings.startsAt)} · ${settings.venue}`;

  return (
    <main className="flex flex-1 justify-center px-5 pt-7 pb-16">
      <div className="flex w-full max-w-[1080px] flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="label-caps">{eventLine}</span>
            <h1 className="m-0 font-sans text-heading leading-[1.2] font-semibold tracking-tight text-ink">Lista de presença</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex h-10 items-center gap-2 rounded-full border border-deadline-border bg-deadline-bg px-3.5 font-sans text-caption font-medium text-gold">
              prazo de confirmação · {formatDayMonth(settings.rsvpDeadline)} · {deadlineCountdownLabel(settings.rsvpDeadline, now)}
            </div>
            <Button variant="secondary" onClick={() => setEditingEvent(true)}>
              Editar evento
            </Button>
            <Button
              variant="secondary"
              icon="↗"
              disabled={pendingWithPhone.length === 0}
              onClick={() => setTarget({ kind: "bulk", guests: pendingWithPhone })}
            >
              Lembrar pendentes ({stats.pending})
            </Button>
          </div>
        </div>

        <StatsCards stats={stats} />

        <div className="overflow-hidden rounded-panel border border-line bg-panel">
          <div className="flex flex-col gap-3 border-b border-line-subtle px-3.5 py-3">
            <Segmented fullWidth label="Filtrar convidados" options={FILTERS} value={filter} onChange={setFilter} />
            <div className="w-full">
              <Input icon="⌕" aria-label="Buscar convidado" placeholder="buscar convidado" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <NewGuestRow onAdded={(guest) => setTarget({ kind: "single", guests: [guest] })} />
          <GuestTable
            guests={rows}
            now={now}
            onSend={(guest) => setTarget({ kind: "single", guests: [guest] })}
            onPreview={(guest) => setTarget({ kind: "preview", guests: [guest] })}
            onDelete={setDeleting}
          />
        </div>
      </div>

      <EventDialog open={editingEvent} settings={settings} onClose={() => setEditingEvent(false)} />
      <DeleteDialog guest={deleting} onClose={() => setDeleting(null)} />
      <SendDialog
        target={target}
        message={message}
        onMessageChange={setMessage}
        onClose={() => setTarget(null)}
        baseUrl={baseUrl}
        settings={settings}
      />
    </main>
  );
}
