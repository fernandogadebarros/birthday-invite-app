"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Guest } from "@/lib/guest";

type CompanionsDialogProps = {
  guest: Guest | null;
  onClose: () => void;
};

// Not in the design: the table row only fits a truncated line, so the full list lives here.
export function CompanionsDialog({ guest, onClose }: CompanionsDialogProps) {
  return (
    <Modal
      open={Boolean(guest)}
      onClose={onClose}
      title="Acompanhantes"
      subtitle={guest?.name}
      footer={
        <Button variant="ghost" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {guest?.companions_names.map((name, i) => (
          <li key={`${i}-${name}`} className="break-words font-sans text-body text-ink">
            {name}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
