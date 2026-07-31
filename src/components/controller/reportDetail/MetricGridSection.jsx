export default function MetricGridSection({ section }) {
  return (
    <section className="card">
      <h3 className="mb-3 text-base font-bold text-[var(--color-header-text)]">
        {section.heading}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {section.items.map((item) => {
          const isDanger = item.emphasis === "danger";
          return (
            <div
              key={item.label}
              className={
                isDanger
                  ? "rounded-xl bg-red-50 p-4"
                  : "rounded-xl border border-[var(--color-border)] p-4"
              }
            >
              <div className="text-xs font-medium text-[var(--color-sub-text)]">
                {item.label}
              </div>
              <div
                className={
                  isDanger
                    ? "mt-1 text-3xl font-extrabold text-red-600"
                    : "mt-1 text-3xl font-extrabold text-[var(--color-header-text)]"
                }
              >
                {item.value}
                <span className="ml-0.5 text-lg font-bold">{item.unit}</span>
              </div>
              {item.caption && (
                <div className="mt-1 text-xs text-[var(--color-btn-desc)]">
                  {item.caption}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
