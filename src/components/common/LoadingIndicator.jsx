// size별 padding까지 함께 묶어서 관리한다. 개별 사용처에서 className으로
// py-*를 덧붙이면 Tailwind 클래스 병합 순서상 어느 쪽이 이길지 보장되지 않으므로,
// 여백은 항상 size로만 조절하고 className은 padding 외의 미세 조정에만 쓴다.
const SIZE_STYLES = {
  sm: { spinner: "w-4 h-4 border-2", text: "text-xs", wrapper: "gap-1.5 py-6" },
  md: { spinner: "w-8 h-8 border-[3px]", text: "text-sm", wrapper: "gap-2 py-10" },
  lg: { spinner: "w-11 h-11 border-4", text: "text-base", wrapper: "gap-3 py-14" },
};

// 데이터 로딩 상태를 나타내는 공용 컴포넌트. 카드/테이블/페이지 어디서든
// isLoading 분기에서 <LoadingIndicator /> 하나로 통일해서 사용한다.
export default function LoadingIndicator({
  size = "md",
  text = "데이터를 불러오는 중입니다...",
  className = "",
}) {
  const { spinner, text: textClass, wrapper } = SIZE_STYLES[size];

  return (
    <div className={`flex flex-col items-center justify-center ${wrapper} ${className}`}>
      <div
        className={`${spinner} rounded-full border-[var(--color-border)] border-t-[var(--color-header-text)] animate-spin`}
      />
      {text && <p className={`${textClass} text-[var(--color-sub-text)]`}>{text}</p>}
    </div>
  );
}
