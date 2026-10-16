"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateEventSettings } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { mapsUrl, type EventSettings } from "@/lib/event";
import { toFields, type EventSettingsFields } from "@/lib/event-settings";

type EventDialogProps = {
  open: boolean;
  settings: EventSettings;
  onClose: () => void;
};

// Not in the design: composed from the Modal, Input and Button primitives.
export function EventDialog({ open, settings, onClose }: EventDialogProps) {
  // Remount on each open so the fields always start from the saved values.
  return open ? (
    <EventForm settings={settings} onClose={onClose} />
  ) : (
    <Modal open={false} onClose={onClose} title="Editar evento" footer={null}>
      {null}
    </Modal>
  );
}

function EventForm({
  settings,
  onClose,
}: {
  settings: EventSettings;
  onClose: () => void;
}) {
  const [fields, setFields] = useState<EventSettingsFields>(() =>
    toFields(settings),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const set =
    (key: keyof EventSettingsFields) => (e: { target: { value: string } }) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  function save(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateEventSettings(fields);
      if (result.ok) onClose();
      else setError(result.error);
    });
  }

  const canSave =
    fields.date &&
    fields.time &&
    fields.deadlineDate &&
    fields.venue.trim() &&
    !pending;

  return (
    <Modal
      open
      onClose={onClose}
      title="Editar evento"
      subtitle="Atualiza o convite, a mensagem e a prévia do WhatsApp"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => save()} disabled={!canSave}>
            {pending ? "Salvando…" : "Salvar"}
          </Button>
        </>
      }
    >
      <form onSubmit={save} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Data"
            type="date"
            required
            value={fields.date}
            onChange={set("date")}
          />
          <Input
            label="Hora"
            type="time"
            required
            value={fields.time}
            onChange={set("time")}
          />
        </div>
        <Input
          label="Confirme até"
          type="date"
          required
          max={fields.date || undefined}
          value={fields.deadlineDate}
          onChange={set("deadlineDate")}
        />
        <div className="flex flex-col gap-2">
          <Input
            label="Local"
            placeholder="Nome e endereço do local"
            required
            value={fields.venue}
            onChange={set("venue")}
          />
          <span className="font-sans text-micro text-muted">
            O link &quot;ver mapa&quot; do convite é criado a partir deste
            texto.{" "}
            {fields.venue.trim() && (
              <a
                href={mapsUrl(fields.venue)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Testar no mapa ↗
              </a>
            )}
          </span>
        </div>
        {error && (
          <p role="alert" className="m-0 font-sans text-caption text-accent">
            {error}
          </p>
        )}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
