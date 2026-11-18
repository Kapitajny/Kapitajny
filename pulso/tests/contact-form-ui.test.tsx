// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Konfiguracja formularza podmieniana w każdym teście (endpoint ustawiony lub nie).
const cfg = vi.hoisted(() => ({ endpoint: null as string | null }));
vi.mock("@/config/site", async (orig) => {
  const real = await orig<typeof import("@/config/site")>();
  return {
    ...real,
    contactForm: {
      get endpoint() {
        return cfg.endpoint;
      },
      accessKey: null,
    },
  };
});

import { ContactForm } from "@/components/form/ContactForm";
import { setIntent } from "@/lib/contact-intent";

beforeEach(() => {
  cfg.endpoint = null;
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function fillToSummary(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByText("Meta Ads"));
  await user.click(screen.getByRole("button", { name: /Dalej/ }));
  await user.click(screen.getByText("Pozyskanie klientów"));
  await user.click(screen.getByRole("button", { name: /Dalej/ }));
  await user.click(screen.getByText("Jeszcze nie wiem"));
  await user.click(screen.getByRole("button", { name: /Dalej/ }));
  await user.type(screen.getByLabelText("Nazwa firmy"), "Testowa");
  await user.type(screen.getByLabelText("Branża"), "usługi");
  await user.click(screen.getByRole("button", { name: /Dalej/ }));
  await user.type(screen.getByLabelText("Imię"), "Ola");
  await user.type(screen.getByLabelText("Adres e-mail"), "ola@testowa.pl");
  await user.type(screen.getByLabelText("Numer telefonu"), "600100200");
  await user.click(screen.getByRole("button", { name: /Dalej/ }));
  await user.click(screen.getByRole("checkbox", { name: /Wyrażam zgodę/ }));
}

describe("ContactForm (DOM)", () => {
  it("bez endpointu: nie udaje wysyłki i nie woła sieci", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillToSummary(user);
    await user.click(screen.getByRole("button", { name: /Wyślij zgłoszenie/ }));
    expect(screen.getByText(/nie zostało wysłane/)).toBeTruthy();
    expect(screen.queryByText(/Zgłoszenie dotarło/)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("wybór z CTA w trakcie wysyłania nie odblokowuje przycisku (brak podwójnych zgłoszeń)", async () => {
    cfg.endpoint = "https://example.test/form";
    const fetchMock = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillToSummary(user);
    await user.click(screen.getByRole("button", { name: /Wyślij zgłoszenie/ }));
    act(() => setIntent({ package: "start" }));
    const btn = screen.getByRole("button", { name: /Wysyłanie/ }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    await user.click(btn);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("wybór z CTA po wysłaniu otwiera nowy formularz z tym wyborem", async () => {
    cfg.endpoint = "https://example.test/form";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillToSummary(user);
    await user.click(screen.getByRole("button", { name: /Wyślij zgłoszenie/ }));
    await screen.findByText(/Zgłoszenie dotarło/);
    act(() => setIntent({ services: ["tiktok"] }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /Gdzie chcesz się reklamować/ })).toBeTruthy());
    expect((screen.getByRole("checkbox", { name: /TikTok Ads/ }) as HTMLInputElement).checked).toBe(true);
  });

  it("krok 6 i ekran sukcesu mają element do ustawienia fokusu po kliknięciu CTA", async () => {
    cfg.endpoint = "https://example.test/form";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);
    await fillToSummary(user);
    expect(container.querySelector("[data-autofocus]")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: /Wyślij zgłoszenie/ }));
    await screen.findByText(/Zgłoszenie dotarło/);
    expect(container.querySelector("[data-autofocus]")).not.toBeNull();
  });

  it("odrzucenie przez serwer ma inny komunikat niż błąd sieci", async () => {
    cfg.endpoint = "https://example.test/form";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillToSummary(user);
    await user.click(screen.getByRole("button", { name: /Wyślij zgłoszenie/ }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toMatch(/połączenie/);
    expect(alert.textContent).toMatch(/odrzucił/);

    cleanup();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ContactForm />);
    await fillToSummary(user);
    await user.click(screen.getByRole("button", { name: /Wyślij zgłoszenie/ }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/połączenie/);
  });

  it("pole-pułapka: wypełnione przez bota nie wywołuje wysyłki", async () => {
    cfg.endpoint = "https://example.test/form";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);
    const trap = container.querySelector<HTMLInputElement>('input[name="website2"]');
    expect(trap).not.toBeNull();
    await fillToSummary(user);
    await user.type(trap!, "spam");
    await user.click(screen.getByRole("button", { name: /Wyślij zgłoszenie/ }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
