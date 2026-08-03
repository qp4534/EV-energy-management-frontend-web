import React from "react";
import CardShell from "../common/CardShell";

// 처리 유형별 강조 색상. index.css에 전용 토큰이 없어 StatusDot의 기존 관례처럼 임시 hex로 지정.
const PROCESS_COLOR = {
  reuse: "var(--color-header-text)", // 재사용 - 딥그린 (헤더 텍스트 색과 동일)
  recycle: "#1F8FCC", // 재활용 - 블루
  dispose: "#E15B5B", // 폐기 - 레드
};

/**
 * "배터리 처리" 카드. 이번 달 재사용/재활용/폐기 처리 건수를 구분선으로 나눈 3컬럼으로 보여준다.
 *
 * @param {string} title - 카드 제목 (예: "배터리 처리")
 * @param {{key:string, label:string, count:number, unit?:string}[]} items
 */
export default function ProcessStatCard({ title, items }) {
  return (
    <CardShell title={title}>
      <div className="grid grid-cols-3 divide-x divide-[var(--color-border)]">
        {items.map((item) => (
          <div key={item.key} className="flex flex-col items-center gap-2 px-2 py-2 text-center">
            <span className="text-sm text-[var(--color-sub-text)]">{item.label}</span>
            <span
              className="text-2xl font-extrabold"
              style={{ color: PROCESS_COLOR[item.key] || "var(--color-header-text)" }}
            >
              {item.count.toLocaleString()}
              <span className="ml-1 text-base font-normal">{item.unit ?? "건"}</span>
            </span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}