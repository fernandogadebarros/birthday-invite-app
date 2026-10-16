type StepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
};

export function Stepper({ value, min, max, onChange, label }: StepperProps) {
  const buttonClass =
    "size-8 cursor-pointer rounded-full border-0 bg-transparent font-sans text-lead font-medium text-secondary hover:bg-hover disabled:cursor-not-allowed disabled:opacity-45";
  return (
    <div role="group" aria-label={label} className="flex h-10 w-max items-center gap-1.5 rounded-full border border-line bg-panel px-1">
      <button type="button" aria-label="Diminuir" className={buttonClass} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <span aria-live="polite" className="min-w-7 text-center font-sans text-body-lg font-semibold text-ink">
        {value}
      </span>
      <button type="button" aria-label="Aumentar" className={buttonClass} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}
