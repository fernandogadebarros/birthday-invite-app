"use client";

import { useState, useTransition } from "react";
import { submitRsvp } from "@/actions/rsvp-actions";
import { Button } from "@/components/ui/button";
import { CheckboxMark } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Stepper } from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { event } from "@/lib/event";
import { parseNames, pluralizePeople } from "@/lib/format";
import type { PublicGuest } from "@/lib/guest";

const RSVP_OPTIONS = [
  { value: "yes", label: "Vou" },
  { value: "no", label: "Não vou" },
] as const;

type RsvpFormProps = {
  code: string;
  name: string;
  initial: PublicGuest;
  onSaved: (guest: PublicGuest) => void;
};

export function RsvpForm({ code, name, initial, onSaved }: RsvpFormProps) {
  const [status, setStatus] = useState<"yes" | "no">(initial?.status === "no" ? "no" : "yes");
  const [hasCompanions, setHasCompanions] = useState((initial?.companions_count ?? 0) > 0);
  const [count, setCount] = useState(Math.max(1, initial?.companions_count ?? 1));
  const [namesText, setNamesText] = useState((initial?.companions_names ?? []).join("\n"));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const going = status === "yes";
  const withCompanions = going && hasCompanions;
  const names = parseNames(namesText);
  const total = 1 + (withCompanions ? count : 0);
  const missingNames = withCompanions ? count - names.length : 0;
  const namesMismatch = missingNames !== 0;
  const cantSubmit = namesMismatch || pending;

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await submitRsvp({
        code,
        status,
        companionsCount: withCompanions ? count : 0,
        companionsNames: withCompanions ? names : [],
      });
      if (result.ok) onSaved(result.guest);
      else setError(result.error);
    });
  }

  return (
    <section className="flex flex-col gap-5 rounded-card border border-line bg-panel p-6">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 font-sans text-title leading-[1.2] font-semibold tracking-tight text-ink">Confirmar presença</h2>
        <span className="font-sans text-caption text-muted">leva menos de um minuto</span>
      </div>

      <Input
        label="Seu nome"
        placeholder="Nome e sobrenome"
        autoComplete="name"
        value={name}
        readOnly
      />

      <div className="flex flex-col gap-2">
        <span className="label-caps">Você vai?</span>
        <Segmented label="Você vai?" options={RSVP_OPTIONS} value={status} onChange={setStatus} />
      </div>

      {going && (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            role="checkbox"
            aria-checked={hasCompanions}
            onClick={() => setHasCompanions((v) => !v)}
            className="flex cursor-pointer items-start gap-3 rounded-panel border border-line-subtle bg-card p-3.5 text-left select-none hover:bg-hover"
          >
            <CheckboxMark checked={hasCompanions} />
            <span className="flex flex-col gap-0.5">
              <span className="font-sans text-body font-medium text-ink">Vou levar acompanhantes</span>
              <span className="font-sans text-caption text-muted">parentes ou dependentes · até {event.maxCompanions}</span>
            </span>
          </button>

          {hasCompanions && (
            <div className="ml-2.5 flex flex-col gap-4 border-l border-dashed border-line-strong pl-3.5">
              <div className="flex flex-col gap-2">
                <span className="label-caps">Quantas pessoas vão com você</span>
                <Stepper label="Quantas pessoas vão com você" value={count} min={1} max={event.maxCompanions} onChange={setCount} />
              </div>
              <Textarea
                label="Nomes dos acompanhantes"
                rows={3}
                placeholder="Separe os nomes por linha, vírgula, hífen ou /"
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
                className="min-h-[88px] bg-panel text-body leading-[1.6]"
                hint={
                  <span
                    className={cn(
                      "font-sans text-micro",
                      !namesMismatch ? "text-success" : names.length > 0 ? "text-accent" : "text-muted",
                    )}
                  >
                    {names.length} de {count} nomes informados
                    {missingNames > 0 && names.length > 0 && ` · faltam ${missingNames}`}
                    {missingNames < 0 && ` · tem ${-missingNames} a mais, ajuste a quantidade ou remova`}
                  </span>
                }
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle pt-[18px]">
        <span className="font-sans text-caption text-muted">{going ? `${pluralizePeople(total)} no total` : event.copy.missYou}</span>
        <Button variant="primary" size="lg" disabled={cantSubmit} onClick={submit}>
          {pending ? "Enviando…" : going ? "Confirmar presença →" : "Enviar resposta →"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="m-0 font-sans text-caption text-accent">
          {error}
        </p>
      )}
    </section>
  );
}
