"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Cloudflare Turnstile — opcjonalna weryfikacja antyspamowa (bez obrazkowych CAPTCHA).
 * Ładowana tylko, gdy ustawiono NEXT_PUBLIC_TURNSTILE_SITE_KEY i TURNSTILE_SECRET_KEY.
 */
export function Turnstile({ siteKey, language, onToken }: { siteKey: string; language: string; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(() => typeof window !== "undefined" && !!window.turnstile);

  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const id = window.turnstile.render(container.current, {
      sitekey: siteKey,
      theme: "light",
      language,
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => window.turnstile?.remove(id);
  }, [ready, siteKey, language, onToken]);

  return (
    <div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} />
      <div ref={container} className="min-h-[65px]" />
    </div>
  );
}
