import { cn } from "@/lib/cn";

/** 20×20 visual checkbox; the clickable row around it owns the a11y role. */
export function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-px flex size-5 flex-none items-center justify-center rounded-xs border font-sans text-caption font-bold text-white transition-all duration-150",
        checked ? "border-accent bg-accent" : "border-line-strong bg-transparent",
      )}
    >
      {checked ? "✓" : ""}
    </span>
  );
}
