import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
};

export function Input({ label, icon, className, id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="label-caps">
          {label}
        </label>
      )}
      <span className="flex h-10 items-center gap-2.5 rounded-full border border-line bg-panel px-3.5 focus-within:border-line-strong">
        {icon && (
          <span aria-hidden className="text-muted">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent font-sans text-small text-ink outline-none focus-visible:outline-none",
            className,
          )}
          {...rest}
        />
      </span>
    </div>
  );
}
