"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateGuestName } from "@/actions/guest-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { Guest } from "@/lib/guest";

type EditGuestDialogProps = {
  guest: Guest | null;
  onClose: () => void;
};

// Not in the design: composed from the Modal, Input and Button primitives.
export function EditGuestDialog({ guest, onClose }: EditGuestDialogProps) {
  // Remount per guest so the field always starts from the saved name.
  return guest ? (
    <EditForm key={guest.id} guest={guest} onClose={onClose} />
  ) : (
    <Modal open={false} onClose={onClose} title="Editar convidado" footer={null}>
      {null}
    </Modal>
  );
}

function EditForm({ guest, onClose }: { guest: Guest; onClose: () => void }) {
  const [name, setName] = useState(guest.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const canSave = name.trim() !== "" && name.trim() !== guest.name && !pending;

  function save(e?: FormEvent) {
    e?.preventDefault();
    if (!canSave) return;
    setError(null);
    startTransition(async () => {
      const result = await updateGuestName(guest.id, name);
      if (result.ok) onClose();
      else setError(result.error);
    });
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Editar convidado"
      subtitle={guest.name}
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
      <form onSubmit={save} className="flex flex-col gap-2">
        <Input label="Nome" value={name} maxLength={120} autoFocus onChange={(e) => setName(e.target.value)} />
        <p className="m-0 font-sans text-caption text-muted">O link do convite continua o mesmo.</p>
      </form>
      {error && (
        <p role="alert" className="m-0 font-sans text-caption text-accent">
          {error}
        </p>
      )}
    </Modal>
  );
}
