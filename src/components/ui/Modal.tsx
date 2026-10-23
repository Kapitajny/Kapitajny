"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Okno modalne oparte na natywnym <dialog>: pułapka fokusu, zamykanie klawiszem Esc,
 * blokada tła i przywrócenie fokusu zapewnia przeglądarka.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    // Zamknięcie przy ukryciu/odmontowaniu (np. nawigacja z zachowaniem stanu w <Activity>).
    return () => dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className={className}
      onCancel={(event) => {
        event.preventDefault();
        onCloseRef.current();
      }}
      onClick={(event) => {
        // Kliknięcie w tło (poza zawartością okna) zamyka okno.
        if (event.target === event.currentTarget) onCloseRef.current();
      }}
    >
      {children}
    </dialog>
  );
}
