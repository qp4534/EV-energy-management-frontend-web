export default function SummarySection({ section }) {
  return (
    <section className="border-t border-[var(--color-border)] py-6">
      <h3 className="mb-3 text-lg font-bold text-[var(--color-header-text)]">
        {section.title ?? section.heading}
      </h3>
      <p className="whitespace-pre-line text-[15px] leading-7 text-[var(--color-header-text)]">
        {section.content}
      </p>
    </section>
  );
}
