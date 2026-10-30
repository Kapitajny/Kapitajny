import { Breadcrumbs } from "./Breadcrumbs";

interface PageHeadProps {
  crumbs: { href: string; label: string }[];
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}

/** Wyśrodkowany nagłówek podstrony: okruszki, tytuł miękką kursywą, krótki wstęp. */
export function PageHead({ crumbs, title, lede, children }: PageHeadProps) {
  return (
    <header className="shell pb-12 pt-[calc(var(--header-h)+2.5rem)] text-center sm:pb-16 lg:pt-[calc(var(--header-h)+3.5rem)]">
      <Breadcrumbs items={crumbs} />
      <h1 className="script mx-auto mt-8 max-w-4xl text-[clamp(3rem,9vw,6.5rem)] leading-[1]">{title}</h1>
      {lede && <p className="lede mx-auto mt-6 max-w-xl text-stone">{lede}</p>}
      {children}
    </header>
  );
}
