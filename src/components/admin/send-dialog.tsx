"use client";

import { useState, useTransition } from "react";
import { markSent } from "@/actions/guest-actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ogDescription, ogTitle } from "@/lib/event";
import { firstName, formatPhone } from "@/lib/format";
import type { Guest } from "@/lib/guest";
import { fillMessage, inviteText, inviteUrl, whatsappUrl } from "@/lib/whatsapp";

export type SendTarget = { kind: "single" | "bulk"; guests: Guest[] };

type SendDialogProps = {
  target: SendTarget | null;
  message: string;
  onMessageChange: (message: string) => void;
  onClose: () => void;
  baseUrl: string;
};

export function SendDialog({ target, message, onMessageChange, onClose, baseUrl }: SendDialogProps) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const guests = target?.guests ?? [];
  const current = guests[Math.min(index, guests.length - 1)];
  const bulk = target?.kind === "bulk";
  const link = current ? inviteUrl(current.code, baseUrl) : "";
  const host = new URL(baseUrl).host;

  function close() {
    setIndex(0);
    setCopied(false);
    onClose();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard can be blocked (http, permissions); the label still confirms the attempt like the prototype.
    }
    setCopied(true);
  }

  function send() {
    if (!current?.phone) return;
    // One window.open per click: browsers block several popups at once.
    window.open(whatsappUrl(current.phone, inviteText(message, current.name, link)), "_blank", "noopener,noreferrer");
    startTransition(() => markSent([current.id]));
    if (bulk && index < guests.length - 1) {
      setIndex(index + 1);
      setCopied(false);
    } else {
      close();
    }
  }

  const title = bulk ? "Lembrar pendentes" : `Enviar convite para ${current ? firstName(current.name) : ""}`;
  const subtitle = bulk
    ? `${guests.length} ${guests.length === 1 ? "convidado" : "convidados"} sem resposta · abre um chat por vez`
    : current?.phone
      ? `${formatPhone(current.phone)} · whatsapp`
      : undefined;
  const cta = !bulk
    ? "Abrir no WhatsApp →"
    : index === 0
      ? `Abrir chat (1/${guests.length}) →`
      : `Próximo (${index + 1}/${guests.length}) →`;

  return (
    <Modal
      open={Boolean(target && current)}
      onClose={close}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <Button variant="ghost" onClick={copyLink}>
            {copied ? "Copiado ✓" : "Copiar link"}
          </Button>
          <Button variant="primary" onClick={send}>
            {cta}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="invite-message" className="label-caps">
          Mensagem
        </label>
        <textarea
          id="invite-message"
          rows={4}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="resize-y rounded-card border border-line bg-card px-3.5 py-3 font-sans text-13 leading-[1.6] text-ink outline-none focus:border-line-strong"
        />
        <span className="font-sans text-11 text-muted">{"{nome}"} vira o nome de cada convidado · o link já vai personalizado</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="label-caps">Prévia no whatsapp</span>
        <div className="flex justify-end rounded-panel bg-page p-3.5">
          <div className="flex max-w-[300px] flex-col gap-2 rounded-[12px_12px_4px_12px] bg-bubble px-1 pt-1 pb-2">
            <div className="overflow-hidden rounded-[8px] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/opengraph-image" alt="" className="block aspect-[1200/630] w-full object-cover" />
              <div className="flex flex-col gap-0.5 px-2.5 py-2">
                <span className="font-sans text-12 font-semibold text-ink">{ogTitle()}</span>
                <span className="font-sans text-11 text-secondary">{ogDescription()}</span>
                <span className="font-sans text-[10px] text-muted">{host}</span>
              </div>
            </div>
            <span className="px-2 font-sans text-13 leading-[1.5] whitespace-pre-wrap text-ink">
              {fillMessage(message, current?.name ?? "")}
            </span>
            <span className="px-2 font-sans text-12 break-all text-success">{link}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
