export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" className="fill-card" />
      <path d="M20 12 L52 32 L20 52 Z" className="fill-ochre" />
      <path d="M20 12 L36 32 L20 52 Z" className="fill-terracotta" />
      <path d="M36 32 L52 32 L20 52 Z" className="fill-primary opacity-70" />
      <path d="M20 12 L36 32 L52 32 Z" className="fill-amber-legal" />
      <circle cx="30" cy="32" r="3" className="fill-emerald" />
    </svg>
  );
}
