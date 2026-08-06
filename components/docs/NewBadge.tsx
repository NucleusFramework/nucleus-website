/**
 * Quiet sidebar marker for 2.2 highlights — sits after the label like a
 * footnote, not a marketing chip.
 */
export function NewBadge({ lang }: { lang: string }) {
  const label = lang === 'fr' ? 'nouveau' : 'new';
  return (
    <span
      className="shrink-0 text-[0.65rem] font-normal leading-none text-fd-muted-foreground/80"
      aria-label={lang === 'fr' ? 'Nouveau' : 'New'}
    >
      {label}
    </span>
  );
}
