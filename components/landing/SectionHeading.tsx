import * as React from 'react';

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="sec-h">
      {eyebrow && <div className="sec-h-eyebrow">{eyebrow}</div>}
      <h2 className="sec-h-title">{title}</h2>
      {subtitle && <p className="sec-h-sub">{subtitle}</p>}
    </div>
  );
}
