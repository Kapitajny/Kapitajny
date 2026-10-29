/**
 * Znak InterPodatki: monogram „iP” zbudowany z uporządkowanych linii dokumentu.
 * Pionowa kreska to litera „i”, łuk z trzech linii ewidencji tworzy brzuszek „P”, złoty punkt – kropkę nad „i”.
 */
export function LogoMark({ size = 32, inverted = false }: { size?: number; inverted?: boolean }) {
  const bg = inverted ? "#ffffff" : "#10243A";
  const fg = inverted ? "#10243A" : "#ffffff";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7" fill={bg} />
      <rect x="8" y="12" width="3" height="13" rx="1.5" fill={fg} />
      <circle cx="9.5" cy="7.6" r="1.9" fill="#C7A66A" />
      <path d="M14.5 7.5h5.2a5.2 5.2 0 0 1 0 10.4h-5.2" stroke={fg} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M14.5 12.7h4.6" stroke="#22B8A7" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14.5 17.9V25" stroke={fg} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark inverted={inverted} />
      <span
        className={`font-serif text-[1.35rem] leading-none tracking-[-0.01em] ${inverted ? "text-white" : "text-navy"}`}
      >
        Inter<span className="font-semibold">Podatki</span>
      </span>
    </span>
  );
}
