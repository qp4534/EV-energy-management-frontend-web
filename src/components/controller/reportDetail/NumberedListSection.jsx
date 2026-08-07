export default function NumberedListSection({ section }) {
  return (
    <section className="border-t border-[var(--color-border)] py-6">
      <h3 className="mb-3 text-lg font-bold text-[var(--color-header-text)]">
        {section.title ?? section.heading}
      </h3>
      <ol className="flex list-none flex-col gap-2 p-0">
        {(section.items ?? []).map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex gap-3 text-[15px] leading-6 text-[var(--color-header-text)]"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-main)] text-xs font-bold">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
