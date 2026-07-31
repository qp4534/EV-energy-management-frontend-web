export default function SummarySection({ section }) {
  return (
    <section className="card">
      <h3 className="mb-2 text-base font-bold text-[var(--color-header-text)]">
        {section.heading}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-sub-text)]">
        {section.content}
      </p>
    </section>
  );
}
