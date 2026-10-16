"use client";

import { useState } from "react";
import { InviteCard } from "@/components/invite/invite-card";
import { RsvpClosed } from "@/components/invite/rsvp-closed";
import { RsvpForm } from "@/components/invite/rsvp-form";
import { RsvpSuccess } from "@/components/invite/rsvp-success";
import { event } from "@/lib/event";
import { firstName, formatPhone } from "@/lib/format";
import type { PublicGuest } from "@/lib/guest";
import { whatsappUrl } from "@/lib/whatsapp";

type InviteScreenProps = {
  guest: PublicGuest | null;
  closed: boolean;
};

export function InviteScreen({ guest: initialGuest, closed }: InviteScreenProps) {
  const [guest, setGuest] = useState(initialGuest);
  const [name, setName] = useState(initialGuest?.name ?? "");
  const [editing, setEditing] = useState(initialGuest?.status === "pending" || !initialGuest);

  const first = firstName(name);
  const greeting = first ? `Oi, ${first} — você está convidado(a)` : "Você está convidado(a)";
  const responded = guest && guest.status !== "pending";

  let panel;
  if (responded && (!editing || closed)) {
    panel = <RsvpSuccess guest={guest} canEdit={!closed} onEdit={() => setEditing(true)} />;
  } else if (closed) {
    panel = <RsvpClosed />;
  } else {
    panel = (
      <RsvpForm
        code={guest?.code}
        name={name}
        onNameChange={setName}
        initial={guest}
        onSaved={(saved) => {
          setGuest(saved);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-7 px-4 pt-8 pb-16">
      <div className="flex w-full max-w-[560px] flex-col min-[960px]:max-w-[1080px]">
        <div className="flex flex-col gap-4 min-[960px]:grid min-[960px]:grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] min-[960px]:items-start min-[960px]:gap-6">
          <InviteCard greeting={greeting} />
          {panel}
        </div>
        <a
          href={whatsappUrl(event.contact.phone, "")}
          target="_blank"
          rel="noopener noreferrer"
          className="pt-0.5 font-sans text-11 text-faint hover:text-muted"
        >
          dúvidas? chame a {event.contact.name} ({event.contact.relation}) no whatsapp · {formatPhone(event.contact.phone)}
        </a>
      </div>
    </main>
  );
}
