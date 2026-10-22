import { describe, expect, it } from "vitest";
import { escapeHtml } from "@/lib/contact/escape";
import { isAllowedHref, parseInline } from "@/lib/inline-markup";
import { serializeJsonLd } from "@/lib/json-ld";
import { typeset, typesetDeep } from "@/lib/typography";

describe("typeset", () => {
  it("wiąże jednoliterowe spójniki z następnym słowem", () => {
    expect(typeset("Kopie i odtwarzanie w firmie a w domu")).toBe("Kopie i odtwarzanie w firmie a w domu");
  });

  it("nie rozdziela półpauzy od poprzedniego słowa", () => {
    expect(typeset("RPO – utrata danych")).toBe("RPO – utrata danych");
  });

  it("przetwarza zagnieżdżone struktury bez zmiany kluczy", () => {
    expect(typesetDeep({ "a b": ["w domu", 3] })).toEqual({ "a b": ["w domu", 3] });
  });
});

describe("parseInline", () => {
  it("rozpoznaje linki, pogrubienia i kod", () => {
    expect(parseInline("Zobacz [usługi](/uslugi), **ważne** i `-all`.")).toEqual([
      { type: "text", value: "Zobacz " },
      { type: "link", value: "usługi", href: "/uslugi" },
      { type: "text", value: ", " },
      { type: "strong", value: "ważne" },
      { type: "text", value: " i " },
      { type: "code", value: "-all" },
      { type: "text", value: "." },
    ]);
  });

  it("traktuje HTML jako zwykły tekst", () => {
    expect(parseInline("<img src=x onerror=alert(1)>")).toEqual([{ type: "text", value: "<img src=x onerror=alert(1)>" }]);
  });

  it("dopuszcza tylko linki wewnętrzne i https", () => {
    expect(isAllowedHref("/kontakt")).toBe(true);
    expect(isAllowedHref("https://incydent.cert.pl")).toBe(true);
    expect(isAllowedHref("javascript:alert(1)")).toBe(false);
    expect(isAllowedHref("//evil.example")).toBe(false);
  });
});

describe("escapowanie", () => {
  it("escapuje znaki HTML", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });

  it("JSON-LD nie może zamknąć znacznika script", () => {
    const serialized = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual({ name: "</script><script>alert(1)</script>" });
  });
});
