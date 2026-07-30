import "../../styles/administrator/components/DataTable.css";

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
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`data-table__th data-table__th--${col.align ?? "left"}`}
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
              row.summary ? "data-table__row--summary" : "",
              onRowClick && !row.summary ? "data-table__row--clickable" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={
              onRowClick && !row.summary ? () => onRowClick(row) : undefined
            }
          >
            {row.summary ? (
              <>
                <td className="data-table__td">{row[columns[0].key]}</td>
                <td
                  className="data-table__td data-table__td--right"
                  colSpan={columns.length - 1}
                >
                  {row[columns[columns.length - 1].key]}
                </td>
              </>
            ) : (
              columns.map((col) => (
                <td
                  key={col.key}
                  className={`data-table__td data-table__td--${col.align ?? "left"}`}
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
