import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3.5",
  md: "h-10 px-[18px]",
  lg: "h-11 px-[18px]",
};

const VARIANTS: Record<Variant, string> = {
  primary: "border-transparent bg-accent font-semibold text-white enabled:hover:bg-accent-pressed",
  secondary: "border-line bg-transparent text-secondary hover:bg-hover",
  ghost: "border-transparent bg-transparent text-secondary hover:bg-hover",
};

export function buttonClasses({ variant = "primary", size = "md" }: { variant?: Variant; size?: Size } = {}) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border",
    "font-sans text-small font-medium transition-[filter,background-color] duration-150",
    "disabled:cursor-not-allowed disabled:opacity-45",
    SIZES[size],
    VARIANTS[variant],
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

export function Button({ variant, size, icon, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size }), className)} {...rest}>
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </button>
  );
}
