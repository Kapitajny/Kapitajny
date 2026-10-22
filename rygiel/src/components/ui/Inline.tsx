import Link from "next/link";
import { Fragment } from "react";
import { isAllowedHref, isInternalHref, parseInline } from "@/lib/inline-markup";
import { typeset } from "@/lib/typography";

/** Renderuje tekst z prostym formatowaniem (linki, pogrubienia, kod) jako elementy Reacta. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((token, index) => {
        switch (token.type) {
          case "strong":
            return <strong key={index}>{typeset(token.value)}</strong>;
          case "code":
            return <code key={index}>{token.value}</code>;
          case "link":
            if (!isAllowedHref(token.href)) return <span key={index}>{typeset(token.value)}</span>;
            return isInternalHref(token.href) ? (
              <Link key={index} href={token.href} className="text-link">
                {typeset(token.value)}
              </Link>
            ) : (
              <a key={index} href={token.href} className="text-link" rel="noopener noreferrer" target="_blank">
                {typeset(token.value)}
                <span className="visually-hidden"> (otwiera się w&nbsp;nowej karcie)</span>
              </a>
            );
          default:
            return <Fragment key={index}>{typeset(token.value)}</Fragment>;
        }
      })}
    </>
  );
}
