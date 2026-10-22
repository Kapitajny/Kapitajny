"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/site";
import { isActivePath } from "./nav-state";

type NavLinksProps = {
  items: NavItem[];
  listClassName?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({ items, listClassName, linkClassName, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <ul className={listClassName} role="list">
      {items.map((item) => {
        const state = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={linkClassName}
              aria-current={state === "page" ? "page" : undefined}
              data-active={state ? "" : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
