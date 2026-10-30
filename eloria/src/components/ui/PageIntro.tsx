import Link from "next/link";

interface PageIntroProps {
  title: React.ReactNode;
  lede?: React.ReactNode;
  breadcrumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
  className?: string;
}

/** Nagłówek podstrony: okruszki, tytuł H1 i akapit wprowadzający. */
export function PageIntro({ title, lede, breadcrumbs, children, className = "" }: PageIntroProps) {
  return (
    <header className={`frame pb-14 pt-10 sm:pt-14 lg:pb-20 lg:pt-20 ${className}`}>
      {breadcrumbs && (
        <nav aria-label="Okruszki" className="mb-10 text-xs text-taupe lg:mb-14">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="h-px w-3 bg-champagne" />
                )}
                {i === breadcrumbs.length - 1 ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="link-quiet">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="max-w-5xl text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.02em]">{title}</h1>
      {lede && <p className="lead mt-8 max-w-2xl lg:mt-10">{lede}</p>}
      {children}
    </header>
  );
}
