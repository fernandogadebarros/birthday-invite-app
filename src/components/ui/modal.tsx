"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
};

export function Modal({ open, onClose, title, subtitle, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100vh-40px)] w-[calc(100%-40px)] max-w-[460px] overflow-auto rounded-modal border border-line bg-panel p-0 text-body shadow-modal backdrop:bg-scrim"
    >
      {open && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-line-subtle px-5 py-[18px]">
            <div className="flex flex-col gap-1">
              <span className="font-sans text-18 font-semibold text-ink">{title}</span>
              {subtitle && <span className="font-sans text-12 text-muted">{subtitle}</span>}
            </div>
            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              className="size-8 cursor-pointer rounded-sm border-0 bg-transparent font-sans text-18 text-muted hover:bg-hover"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-4 px-5 py-[18px]">{children}</div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-line-subtle px-5 py-3.5">{footer}</div>
        </div>
      )}
    </dialog>
  );
}
