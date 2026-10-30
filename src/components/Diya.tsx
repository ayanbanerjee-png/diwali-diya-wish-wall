export function Diya({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <radialGradient id="dg" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="var(--flame)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--flame)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="26" r="22" fill="url(#dg)" />
      <g className="animate-flicker" style={{ transformBox: "fill-box" }}>
        <path d="M32 10 C38 20 38 28 32 32 C26 28 26 20 32 10Z" fill="var(--flame)" />
        <path d="M32 18 C35 24 35 28 32 30 C29 28 29 24 32 18Z" fill="var(--foreground)" />
      </g>
      <path d="M8 36 Q32 62 56 36 Q32 42 8 36Z" fill="var(--accent)" />
      <path d="M8 36 Q32 42 56 36" stroke="var(--primary)" strokeWidth="2" fill="none" />
    </svg>
  );
}
