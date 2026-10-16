import Image from "next/image";
import type { ReactNode } from "react";
import { ageLabel, event } from "@/lib/event";

export function TopBar({ children }: { children?: ReactNode }) {
  const { age } = event.celebrant;
  return (
    <header className="sticky top-0 z-[5] flex min-h-16 flex-col items-center justify-center gap-2.5 border-b border-line-subtle bg-top-bar px-5 py-2.5 sm:grid sm:grid-cols-[1fr_auto_1fr]">
      <div className="flex items-center gap-3 font-sans text-lead font-semibold text-white sm:col-start-2">
        <Image
          src="/images/minni-logo.png"
          alt=""
          width={456}
          height={480}
          priority
          className="h-10 w-auto"
        />
        <span>
          {event.copy.brand}
          <span className="text-hero">
            {" "}· {age} {ageLabel(age)}
          </span>
        </span>
      </div>
      {children && (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:col-start-3 sm:row-start-1 sm:justify-end">
          {children}
        </div>
      )}
    </header>
  );
}
