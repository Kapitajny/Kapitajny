import type { Track } from "@/data/tracks";

/**
 * Okładki demonstracyjnych utworów – generowane w SVG, bez cudzych grafik i wizerunków.
 * `uid` rozróżnia identyfikatory wzorów, gdy ta sama okładka występuje kilka razy na stronie.
 */
export function Cover({ track, uid }: { track: Track; uid: string }) {
  const id = `${uid}-${track.id}`;
  const title = track.title.toUpperCase();

  const art: Record<Track["id"], React.ReactNode> = {
    "neon-drift": (
      <>
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#3be8ff" />
            <stop offset="1" stopColor="#8a63ff" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="#05060c" />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx="20" cy="190" r={30 + i * 22} fill="none" stroke={`url(#${id}-g)`} strokeWidth={i % 3 === 0 ? 2.5 : 1} opacity={1 - i * 0.08} />
        ))}
        <text x="16" y="44" fontSize="18" fontWeight="800" fill="#e9edf3" style={{ fontStretch: "125%" }}>
          {title}
        </text>
      </>
    ),
    beton: (
      <>
        <defs>
          <pattern id={`${id}-dots`} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.6" fill="#2b2a27" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="#a29e95" />
        <rect width="200" height="200" fill={`url(#${id}-dots)`} opacity="0.55" />
        <rect x="14" y="118" width="128" height="58" fill="#e3261c" />
        <text x="22" y="168" fontSize="52" fontWeight="900" fill="#0b0b0b" style={{ fontStretch: "62%" }}>
          {title}
        </text>
        <rect x="0" y="0" width="200" height="200" fill="none" stroke="#0b0b0b" strokeWidth="10" />
      </>
    ),
    velvet: (
      <>
        <rect width="200" height="200" fill="#3a0c17" />
        <circle cx="100" cy="92" r="52" fill="none" stroke="#d9bf86" strokeWidth="0.8" />
        <circle cx="100" cy="92" r="46" fill="none" stroke="#d9bf86" strokeWidth="0.4" />
        <text x="100" y="170" textAnchor="middle" fontSize="15" fontWeight="200" letterSpacing="7" fill="#d9bf86" style={{ fontStretch: "125%" }}>
          {title}
        </text>
      </>
    ),
    "tasma-13": (
      <>
        <rect width="200" height="200" fill="#efe3cf" />
        <rect y="112" width="200" height="16" fill="#ff8a3d" />
        <rect y="128" width="200" height="16" fill="#b8541d" />
        <rect y="144" width="200" height="16" fill="#5b2a10" />
        <text x="16" y="58" fontSize="30" fontWeight="650" fontStyle="italic" fill="#5b2a10">
          {track.title}
        </text>
        <text x="16" y="80" fontSize="10" fontWeight="600" fill="#8a5a3b" letterSpacing="1">
          C-60
        </text>
      </>
    ),
    "pusty-pokoj": (
      <>
        <rect width="200" height="200" fill="#f2f1ee" />
        <rect x="128" y="62" width="14" height="14" fill="#111" />
        <text x="16" y="186" fontSize="11" fontWeight="500" fill="#111">
          {track.title.toLowerCase()}
        </text>
      </>
    ),
    horyzont: (
      <>
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b3a44" />
            <stop offset="0.62" stopColor="#f2a65a" />
            <stop offset="0.63" stopColor="#1a1410" />
            <stop offset="1" stopColor="#050708" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#${id}-sky)`} />
        <rect width="200" height="34" fill="#000" />
        <rect y="166" width="200" height="34" fill="#000" />
        <text x="100" y="112" textAnchor="middle" fontSize="13" fontWeight="300" letterSpacing="9" fill="#fff" style={{ fontStretch: "125%" }}>
          {title}
        </text>
      </>
    ),
  };

  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" style={{ fontFamily: "var(--font)" }}>
      {art[track.id]}
    </svg>
  );
}
