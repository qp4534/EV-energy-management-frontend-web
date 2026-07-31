import React from "react";

const DEFAULT_COLUMNS = [
  { key: "name", label: "매입처" },
  { key: "category", label: "업종" },
  { key: "price", label: "제안가", align: "right" },
];

/**
 * @param {string} [title]
 * @param {{key:string,label:string,align?:"left"|"right"}[]} [columns] - 생략 시 기존 매입처 테이블(매입처/업종/제안가)로 동작
 * @param {object[]} rows - columns의 key와 매칭되는 필드를 가진 객체 배열
 */
export default function BuyerTable({ title, columns = DEFAULT_COLUMNS, rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-login-frame)]">
      {title && (
        <div className="border-b border-[var(--color-border)] px-5 py-3.5 text-[0.9375rem] font-bold text-[var(--color-header-text)]">
          {title}
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`bg-[var(--color-footer-bg)] px-5 py-2.5 text-left text-[0.8125rem] font-semibold text-[var(--color-footer-desc)] ${
                  col.align === "right" ? "text-right" : ""
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`border-t border-[var(--color-footer-border)] px-5 py-3 text-sm text-[var(--color-header-text)] ${
                    col.align === "right" ? "text-right font-semibold" : ""
                  }`}
                >
                  {row[col.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
