import "../../styles/auth/components/StepIndicator.css";

export default function StepIndicator({ step }) {
  return (
    <div className="step-indicator">
      <div
        className={`step-indicator-item ${
          step === 1 ? "step-indicator-item--active" : ""
        }`}
      >
        <span className="step-indicator-num">①</span>
        {step === 1 && (
          <span className="step-indicator-label">역할 선택</span>
        )}
      </div>
      <div className="step-indicator-divider" />
      <div
        className={`step-indicator-item ${
          step === 2 ? "step-indicator-item--active" : ""
        }`}
      >
        <span className="step-indicator-num">{step === 2 ? "②" : "2"}</span>
        {step === 2 && (
          <span className="step-indicator-label">정보 입력</span>
        )}
      </div>
    </div>
  );
}
