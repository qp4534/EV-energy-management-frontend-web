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
}) {
  return (
    <div className="buyer-card">
      <div className="buyer-card__top">
        <div>
          <p className="buyer-card__name">{name}</p>
          <p className="buyer-card__category">{category}</p>
        </div>
        <div className="buyer-card__price-block">
          <RankBadge rank={rank} />
          <p className="buyer-card__price">{price}만원</p>
          <p className="buyer-card__price-sub">{priceSubtext}</p>
        </div>
      </div>

      <StatusDot tone="success" label={gradeLabel} size="sm" />

      <p className="buyer-card__desc">{description}</p>

      {tag && <span className="buyer-card__tag">{tag}</span>}
    </div>
  );
}