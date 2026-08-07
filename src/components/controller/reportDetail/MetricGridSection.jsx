export default function MetricGridSection({ section }) {
  return (
    <section className="border-t border-[var(--color-border)] py-6">
      <h3 className="mb-4 text-lg font-bold text-[var(--color-header-text)]">
        {section.title ?? section.heading}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(section.items ?? []).map((item) => {
          const isDanger = item.emphasis === "danger";
          return (
            <div
              key={item.label}
              className={
                isDanger
                  ? "rounded-xl border border-red-200 bg-red-50 p-4 shadow-[0_3px_10px_rgba(220,38,38,0.08)]"
                  : "rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-[0_3px_10px_rgba(15,61,46,0.07)]"
              }
            >
              <div className="text-xs font-semibold text-[var(--color-sub-text)]">
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
                {item.unit && (
                  <span className="ml-0.5 text-lg font-bold">{item.unit}</span>
                )}
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
