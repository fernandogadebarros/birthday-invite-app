import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const TONES = {
  accent: "text-accent",
  amber: "text-gold",
  neutral: "text-secondary",
} as const;

export function Tag({ tone = "neutral", children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return <span className={cn("rounded-xs bg-selected px-[7px] py-0.5 font-sans text-micro", TONES[tone])}>{children}</span>;
}
