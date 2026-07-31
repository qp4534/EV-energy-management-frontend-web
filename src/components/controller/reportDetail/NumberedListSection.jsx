export default function NumberedListSection({ section }) {
  return (
    <section className="card">
      <h3 className="mb-2 text-base font-bold text-[var(--color-header-text)]">
        {section.heading}
      </h3>
      <ol className="flex flex-col gap-1.5">
        {section.items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm text-[var(--color-sub-text)]"
          >
            <span className="shrink-0 text-[var(--color-header-text)]">
              {i + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
