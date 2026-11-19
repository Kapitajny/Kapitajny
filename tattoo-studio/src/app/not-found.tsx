import Link from "next/link";
import { Pattern } from "@/components/ui/Pattern";

export default function NotFound() {
  return (
    <main id="main" className="on-dark relative flex min-h-svh flex-col items-start justify-center overflow-hidden bg-sumi px-[clamp(1rem,4.5vw,4.5rem)] text-washi">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 text-washi/[0.1] [mask-image:linear-gradient(to_top,black,transparent)]">
        <Pattern kind="seigaiha" bg="var(--color-sumi)" />
      </div>
      <p className="font-mincho text-[clamp(5rem,16vw,12rem)] leading-none" aria-hidden="true">
        迷
      </p>
      <h1 className="display display-md mt-6">THIS PAGE DOESN&apos;T EXIST.</h1>
      <p className="mt-5 max-w-[30rem] font-mincho text-lg leading-relaxed text-washi/80">
        Adres mógł się zmienić albo zawierać literówkę. Wróć na stronę główną, aby zobaczyć prace studia.
      </p>
      <Link href="/" className="btn btn-paper relative mt-10">
        Back to homepage
      </Link>
    </main>
  );
}
