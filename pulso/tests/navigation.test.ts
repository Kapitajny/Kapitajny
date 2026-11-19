// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getIntent, installPageNavigation } from "@/lib/contact-intent";

let uninstall: () => void = () => {};
let scrollTo: ReturnType<typeof vi.fn>;
let scrollIntoView: ReturnType<typeof vi.fn>;
let replaceState: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  document.body.innerHTML = `
    <header><nav style="height:64px"></nav></header>
    <a id="cta" href="#kontakt" data-services="meta,google">Umów konsultację</a>
    <a id="pkg" href="#kontakt" data-package="growth">Wybieram pakiet</a>
    <a id="offer" href="#uslugi">Poznaj naszą ofertę</a>
    <a id="missing" href="#nie-ma">Brak celu</a>
    <a id="external" href="https://example.com">Zewnętrzny</a>
    <section id="uslugi"><h2>Usługi</h2></section>
    <section id="kontakt"><form id="kontakt-formularz"><input data-autofocus /></form></section>`;
  scrollTo = vi.fn();
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  scrollIntoView = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoView as unknown as typeof Element.prototype.scrollIntoView;
  replaceState = vi.spyOn(window.history, "replaceState");
  window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
  window.history.pushState(null, "", "/");
  uninstall = installPageNavigation();
});

afterEach(() => {
  uninstall();
  vi.restoreAllMocks();
});

const click = (id: string) => {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
  document.getElementById(id)!.dispatchEvent(ev);
  return ev;
};

describe("nawigacja w obrębie strony", () => {
  it("link do sekcji przewija tylko własny dokument i nie zmienia adresu", () => {
    const ev = click("offer");
    expect(ev.defaultPrevented).toBe(true);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(window.location.hash).toBe("");
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("przycisk kontaktowy przewija do formularza, przekazuje usługi i ustawia fokus", async () => {
    const before = getIntent().nonce;
    const ev = click("cta");
    expect(ev.defaultPrevented).toBe(true);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(getIntent().nonce).toBe(before + 1);
    expect(getIntent().services).toEqual(["meta", "google"]);
    await new Promise((r) => requestAnimationFrame(r));
    expect(document.activeElement?.hasAttribute("data-autofocus")).toBe(true);
    expect(window.location.hash).toBe("");
  });

  it("„Wybieram pakiet” przekazuje pakiet", () => {
    click("pkg");
    expect(getIntent().package).toBe("growth");
  });

  it("nie przechwytuje linków bez celu na stronie ani linków zewnętrznych", () => {
    expect(click("missing").defaultPrevented).toBe(false);
    const ext = click("external");
    expect(ext.defaultPrevented).toBe(false);
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
