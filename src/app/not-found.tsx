import { TopBar } from "@/components/top-bar";
import { event } from "@/lib/event";
import { formatPhone } from "@/lib/format";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <main className="flex flex-1 justify-center px-4 pt-8 pb-16">
        <section className="flex w-full max-w-[560px] flex-col gap-3.5 self-start rounded-card border border-line bg-panel p-6">
          <span className="font-sans text-12 font-semibold tracking-greeting text-accent uppercase">link não encontrado</span>
          <h1 className="m-0 font-sans text-22 leading-[1.2] font-semibold tracking-tight text-ink">Não achamos esse convite</h1>
          <p className="m-0 font-sans text-14 leading-[1.6] text-body">
            Confira se o link que você recebeu no WhatsApp está completo. Se o problema continuar, chame a {event.contact.name} ·{" "}
            {formatPhone(event.contact.phone)}.
          </p>
        </section>
      </main>
    </>
  );
}
