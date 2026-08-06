/** Small "New" / "Nouveau" pill for the docs sidebar (2.2 highlights). */
export function NewBadge({ lang }: { lang: string }) {
  const label = lang === 'fr' ? 'Nouveau' : 'New';
  return (
    <span
      className="shrink-0 rounded-full bg-fd-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fd-primary"
      aria-label={label}
    >
      {label}
    </span>
  );
}
