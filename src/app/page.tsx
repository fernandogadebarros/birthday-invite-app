import { buttonClasses } from "@/components/ui/button";
import { TopBar } from "@/components/top-bar";
import { event } from "@/lib/event";
import { formatPhone } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

// There is no public RSVP: every guest has a personal link sent by the hosts.
export default function HomePage() {
  return (
    <>
      <TopBar />
      <main className="flex flex-1 justify-center px-4 pt-8 pb-16">
        <section className="flex w-full max-w-[560px] flex-col items-start gap-3.5 self-start rounded-card border border-line bg-panel p-6">
          <span className="font-sans text-caption font-semibold tracking-greeting text-accent uppercase">convite pessoal</span>
          <h1 className="m-0 font-sans text-title leading-[1.2] font-semibold tracking-tight text-ink">Use o link que você recebeu</h1>
          <p className="m-0 font-sans text-body leading-[1.6] text-body">
            Cada convidado tem um link próprio, enviado pelo WhatsApp. Abra a mensagem com o convite da {event.celebrant.nickname} e toque no link para
            confirmar presença. Não achou? Chame a {event.contact.name} ({event.contact.relation}) · {formatPhone(event.contact.phone)}.
          </p>
          <a
            href={whatsappUrl(event.contact.phone, "")}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "secondary" })}
          >
            Falar com a {event.contact.name} ↗
          </a>
        </section>
      </main>
    </>
  );
}
