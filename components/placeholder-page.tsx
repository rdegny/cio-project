type SectionTone = "neutral" | "green" | "amber" | "blue";

type PlaceholderSection = {
  title: string;
  value: string;
  detail: string;
  tone: SectionTone;
};

const toneStyles: Record<SectionTone, string> = {
  neutral: "border-line bg-white text-ink",
  green: "border-moss/30 bg-[#f4f8f1] text-moss",
  amber: "border-signal/30 bg-[#fff8e8] text-signal",
  blue: "border-harbor/30 bg-[#eef7fa] text-harbor"
};

export function PlaceholderPage({
  eyebrow,
  title,
  summary,
  sections
}: Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  sections: PlaceholderSection[];
}>) {
  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-700 sm:text-lg">
          {summary}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-lg border border-line bg-white p-5 shadow-panel"
          >
            <div
              className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${toneStyles[section.tone]}`}
            >
              {section.title}
            </div>
            <p className="mt-5 text-3xl font-semibold text-ink">{section.value}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{section.detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
