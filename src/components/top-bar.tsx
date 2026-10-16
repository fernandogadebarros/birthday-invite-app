import type { ReactNode } from "react";
import { event } from "@/lib/event";

export function TopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-[5] flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-line-subtle bg-top-bar px-5 py-2.5">
      <div className="flex items-center gap-2.5 font-sans text-16 font-semibold text-white">
        <span aria-hidden className="flex items-center gap-0.5">
          <span className="size-3 rounded-full bg-ink shadow-ring-top-bar" />
          <span className="size-4 rounded-full bg-accent shadow-ring-top-bar" />
          <span className="size-3 rounded-full bg-ink shadow-ring-top-bar" />
        </span>
        <span>
          {event.copy.brand}
          <span className="text-pink-soft">
            {" "}· {event.celebrant.age} {event.celebrant.age === 1 ? "ano" : "anos"}
          </span>
        </span>
      </div>
      {children && <div className="flex flex-wrap items-center justify-end gap-4">{children}</div>}
    </header>
  );
}
