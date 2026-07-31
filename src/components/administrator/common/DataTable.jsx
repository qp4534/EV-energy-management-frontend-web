/**
 * 컬럼 정의 기반 공용 테이블. "그 외 매입처" 표, "건전성 세부지표" 표, 배터리 목록 등에서 재사용.
 *
 * @param {{key:string, header:string, align?:"left"|"right"|"center", render?:(row:Object)=>React.ReactNode}[]} columns
 *   - render가 있으면 row[key] 대신 render(row) 결과를 렌더링 (뱃지/버튼 등 커스텀 셀용)
 * @param {Array<Object & {summary?: boolean}>} rows
 *   - row.summary === true 인 행은 첫 컬럼을 라벨로, 나머지 컬럼을 합쳐 강조 텍스트로 표시
 *     (예: "기타 6곳" / "690~715만원")
 * @param {(row:Object) => void} [onRowClick] - 있으면 행 클릭 가능(커서/hover 스타일 적용)
 */
export default function DataTable({ columns, rows, onRowClick }) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <table className="w-full border-collapse bg-transparent">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`border-b-2 border-[var(--color-sub-text)] px-3 py-3.5 text-[15px] font-bold text-[var(--color-header-text)] ${
                alignClass[col.align ?? "left"]
              }`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr
            key={row.id ?? row.batteryId ?? idx}
            className={[
              row.summary ? "bg-[var(--color-bg-main)] font-bold" : "",
              onRowClick && !row.summary
                ? "cursor-pointer transition-colors duration-150 hover:bg-[#eef3ea]"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={
              onRowClick && !row.summary ? () => onRowClick(row) : undefined
            }
          >
            {row.summary ? (
              <>
                <td className="whitespace-nowrap border-b border-[var(--color-border)] px-3 py-3.5 text-sm text-[#333] text-left">
                  {row[columns[0].key]}
                </td>
                <td
                  className="whitespace-nowrap border-b border-[var(--color-border)] px-3 py-3.5 text-sm text-[#333] text-right"
                  colSpan={columns.length - 1}
                >
                  {row[columns[columns.length - 1].key]}
                </td>
              </>
            ) : (
              columns.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap border-b border-[var(--color-border)] px-3 py-3.5 text-sm text-[#333] ${
                    alignClass[col.align ?? "left"]
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}