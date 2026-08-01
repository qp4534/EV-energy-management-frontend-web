import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthButton from "../../components/auth/AuthButton";
import TermsModal from "../../components/auth/TermsModal";
import "../../styles/auth/SignupConsent.css";

const INITIAL_AGREEMENTS = {
  age: false,
  service: false,
  privacy: false,
  location: false,
};

export default function SignupConsent() {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState(INITIAL_AGREEMENTS);
  const [modalType, setModalType] = useState(null);

  const allChecked = Object.values(agreements).every(Boolean);
  const requiredChecked =
    agreements.age && agreements.service && agreements.privacy;

  const toggleAll = () => {
    const next = !allChecked;
    setAgreements({
      age: next,
      service: next,
      privacy: next,
      location: next,
    });
  };

  const toggleOne = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (requiredChecked) {
      navigate("/signup/info");
    }
  };

  const handleAgreeFromModal = (key) => {
    setAgreements((prev) => ({ ...prev, [key]: true }));
    setModalType(null);
  };

  return (
    <AuthLayout variant="plain">
      <div className="consent-all">
        <label className="consent-row consent-row--all">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
          />
          <span>전체 동의하기</span>
        </label>
        <ul className="consent-all-desc">
          <li>
            전체 동의 시 필수사항 및 선택사항에 대해 일괄 동의하게 되며,
            개별적으로도 동의를 선택하실 수 있습니다.
          </li>
          <li>
            필수 항목은 서비스 제공을 위해 필요한 항목이므로, 동의를
            거부하시는 경우 서비스 이용에 제한이 있을 수 있습니다.
          </li>
        </ul>
      </div>

      <div className="consent-list">
        <label className="consent-row">
          <input
            type="checkbox"
            checked={agreements.age}
            onChange={() => toggleOne("age")}
          />
          <span>[필수] 만 14세 이상입니다</span>
        </label>

        <label className="consent-row">
          <input
            type="checkbox"
            checked={agreements.service}
            onChange={() => toggleOne("service")}
          />
          <span>[필수] 서비스 이용약관 동의</span>
          <button
            type="button"
            className="consent-view-link"
            onClick={() => setModalType("service")}
          >
            보기
          </button>
        </label>

        <label className="consent-row">
          <input
            type="checkbox"
            checked={agreements.privacy}
            onChange={() => toggleOne("privacy")}
          />
          <span>[필수] 개인정보 수집 및 이용 동의</span>
          <button
            type="button"
            className="consent-view-link"
            onClick={() => setModalType("privacy")}
          >
            보기
          </button>
        </label>

        <label className="consent-row">
          <input
            type="checkbox"
            checked={agreements.location}
            onChange={() => toggleOne("location")}
          />
          <span>[선택] 위치기반서비스 이용약관</span>
          <button
            type="button"
            className="consent-view-link"
            onClick={() => setModalType("location")}
          >
            보기
          </button>
        </label>
      </div>

      <AuthButton
        variant="primary"
        className="consent-next-btn"
        disabled={!requiredChecked}
        onClick={handleNext}
      >
        다음
      </AuthButton>

      {modalType && (
        <TermsModal
          initialType={modalType}
          onClose={() => setModalType(null)}
          onAgree={handleAgreeFromModal}
        />
      )}
    </AuthLayout>
  );
}
