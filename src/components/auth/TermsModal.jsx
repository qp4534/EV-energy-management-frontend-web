import { useState } from "react";
import TermsBody from "./TermsBody";
import AuthButton from "./AuthButton";
import { TERMS_CONTENT, TERMS_TABS } from "../../constants/terms.constants";
import "../../styles/auth/components/TermsModal.css";

export default function TermsModal({ initialType, onClose, onAgree }) {
  const [type, setType] = useState(initialType);
  const content = TERMS_CONTENT[type];

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
        <div className="terms-modal-tabs">
          {TERMS_TABS.map((tab) => (
            <button
              key={tab.type}
              type="button"
              className={`terms-modal-tab ${
                tab.type === type ? "terms-modal-tab--active" : ""
              }`}
              onClick={() => setType(tab.type)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="terms-modal-body">
          <TermsBody content={content} />
        </div>

        <div className="terms-modal-actions">
          <AuthButton variant="neutral" onClick={onClose}>
            닫기
          </AuthButton>
          {onAgree && (
            <AuthButton variant="primary" onClick={() => onAgree(type)}>
              동의
            </AuthButton>
          )}
        </div>
      </div>
    </div>
  );
}
