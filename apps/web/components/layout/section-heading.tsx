type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm uppercase tracking-[0.22em] text-foreground/50">{eyebrow}</p>
      <h2 className="max-w-3xl text-3xl leading-tight sm:text-4xl">{title}</h2>
      <p className="section-copy">{description}</p>
    </div>
  );
}
