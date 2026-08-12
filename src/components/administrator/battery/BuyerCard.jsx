import React from "react";
import RankBadge from "../common/RankBadge";
import StatusDot from "../common/StatusDot";

/**
 * 매입처별 예상 제안가 카드 (현대글로비스, 지자체 공개입찰 등)
 *
 * @param {number} rank - 1,2,3위
 * @param {string} name - 매입처명
 * @param {string} category - 업종/지역 설명
 * @param {number|string} price - 제안가 (만원)
 * @param {string} priceSubtext - 단가 등 보조 텍스트 (예: "126,793 원/kWh")
 * @param {string} gradeLabel - 등급 텍스트 (예: "재사용(EV 재제조)급")
 * @param {string} description - 설명 문단
 * @param {string} [tag] - 하단 태그 텍스트 (예: "현대글로비스 수거→현대모비스 재제조 순환경제 시스템")
 * @param {string} [sourceUrl] - 위 tag(확인된 사업 영역)의 근거 링크 - 있으면 "참고자료" 하이퍼링크로 노출
 */
export default function BuyerCard({
  rank,
  name,
  category,
  price,
  priceSubtext,
  gradeLabel,
  description,
  tag,
  sourceUrl,
}) {
  return (
    <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-login-frame)] px-6 py-5">
      {/* 헤더 영역 + 구분선 */}
      <div className="mb-3.5 flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3.5">
        <div>
          <p className="text-[1.0625rem] font-bold text-[var(--color-header-text)]">
            {name}
          </p>
          <p className="mt-0.5 text-[0.8125rem] text-[var(--color-sub-text)]">
            {category}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          {/* 배지 + 가격 나란히 */}
          <div className="flex items-center justify-end gap-2">
            <RankBadge rank={rank} />
            <p className="text-[1.375rem] font-bold text-[var(--color-header-text)]">
              {price}만원
            </p>
          </div>
          <p className="mt-0.5 text-xs text-[var(--color-btn-desc)]">
            {priceSubtext}
          </p>
        </div>
      </div>

      <StatusDot tone="success" label={gradeLabel} size="sm" />

      <p className="my-1.5 mb-3.5 text-sm leading-normal text-[var(--color-sub-text)]">
        {description}
      </p>

      {tag && (
        <span className="inline-block rounded-lg border border-[var(--color-footer-border)] bg-[var(--color-footer-bg)] px-3.5 py-1.5 text-[0.8125rem] font-medium text-[var(--color-footer-desc)]">
          {tag}
        </span>
      )}

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 block text-[0.8125rem] font-medium text-[var(--color-primary-btn)] underline underline-offset-2"
        >
          참고자료 ↗
        </a>
      )}
    </div>
  );
}