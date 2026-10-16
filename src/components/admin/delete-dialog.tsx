"use client";

import { useState, useTransition } from "react";
import { deleteGuest } from "@/actions/guest-actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Guest } from "@/lib/guest";

type DeleteDialogProps = {
  guest: Guest | null;
  onClose: () => void;
};

// Not in the design: composed from the Modal and Button primitives.
export function DeleteDialog({ guest, onClose }: DeleteDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function close() {
    setError(null);
    onClose();
  }

  function confirm() {
    if (!guest) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteGuest(guest.id);
      if (result.ok) close();
      else setError(result.error);
    });
  }

  return (
    <Modal
      open={Boolean(guest)}
      onClose={close}
      title="Excluir convidado"
      subtitle={guest?.name}
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirm} disabled={pending}>
            {pending ? "Excluindo…" : "Excluir"}
          </Button>
        </>
      }
    >
      <p className="m-0 font-sans text-body leading-[1.6] text-body">
        {guest?.name} sai da lista, junto com a resposta e os acompanhantes. O link do convite deixa de funcionar. Essa ação não pode ser desfeita.
      </p>
      {error && (
        <p role="alert" className="m-0 font-sans text-caption text-accent">
          {error}
        </p>
      )}
    </Modal>
  );
}
