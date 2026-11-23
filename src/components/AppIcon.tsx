export function AppIcon({ name, hue, size = "h-14 w-14 text-xl" }: { name: string; hue: number; size?: string }) {
  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-2xl font-display font-bold text-foreground`}
      style={{ background: `linear-gradient(135deg, oklch(0.55 0.14 ${hue}), oklch(0.35 0.1 ${hue + 40}))` }} aria-hidden="true">
      {name.slice(0, 2)}
    </div>
  );
}
