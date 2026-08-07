export default function BulletListSection({ section }) {
  return (
    <section className="border-t border-[var(--color-border)] py-6">
      <h3 className="mb-3 text-lg font-bold text-[var(--color-header-text)]">
        {section.title ?? section.heading}
      </h3>
      <ul className="flex list-none flex-col gap-2 p-0">
        {(section.items ?? []).map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex gap-3 text-[15px] leading-6 text-[var(--color-header-text)]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-sub-text)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
