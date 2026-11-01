import { type ReactNode, ViewTransition } from "react";

/** Każda strona wchodzi i wychodzi spokojnym przenikaniem; nagłówek pozostaje nieruchomy. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
