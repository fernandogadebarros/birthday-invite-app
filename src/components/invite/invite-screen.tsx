"use client";

import { useState } from "react";
import { InviteCard } from "@/components/invite/invite-card";
import { RsvpClosed } from "@/components/invite/rsvp-closed";
import { RsvpForm } from "@/components/invite/rsvp-form";
import { RsvpSuccess } from "@/components/invite/rsvp-success";
import type { EventSettings } from "@/lib/event";
import { firstName } from "@/lib/format";
import type { PublicGuest } from "@/lib/guest";

type InviteScreenProps = {
  guest: PublicGuest;
  closed: boolean;
  settings: EventSettings;
};

export function InviteScreen({ guest: initialGuest, closed, settings }: InviteScreenProps) {
  const [guest, setGuest] = useState(initialGuest);
  const [editing, setEditing] = useState(initialGuest.status === "pending");

  const greeting = `Oi, ${firstName(guest.name)} — você está convidado(a)`;
  const responded = guest.status !== "pending";

  let panel;
  if (responded && (!editing || closed)) {
    panel = <RsvpSuccess guest={guest} canEdit={!closed} onEdit={() => setEditing(true)} settings={settings} />;
  } else if (closed) {
    panel = <RsvpClosed settings={settings} />;
  } else {
    panel = (
      <RsvpForm
        code={guest.code}
        name={guest.name}
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
          <InviteCard greeting={greeting} settings={settings} />
          {panel}
        </div>
      </div>
    </main>
  );
}
