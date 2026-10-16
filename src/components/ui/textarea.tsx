import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: ReactNode;
};

export function Textarea({ label, hint, className, id, ...rest }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={textareaId} className="label-caps">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "resize-y rounded-card border border-line px-3.5 py-3 font-sans text-ink outline-none focus:border-line-strong",
          className,
        )}
        {...rest}
      />
      {hint}
    </div>
  );
}
