import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import StepIndicator from "../../components/auth/StepIndicator";
import RoleSelectCards from "../../components/auth/RoleSelectCards";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import TermsModal from "../../components/auth/TermsModal";
import { mockLogin } from "../../services/userService";
import "../../styles/auth/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("administrator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modalType, setModalType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mockLogin({ role, email, password });
      navigate(role === "administrator" ? "/administrator" : "/controller");
    } catch (err) {
      setError(err.message);
    }
  };

  const termsLinks = (
    <div className="login-terms-links">
      <button type="button" onClick={() => setModalType("service")}>
        서비스 이용약관
      </button>
      <button type="button" onClick={() => setModalType("privacy")}>
        개인정보처리방침
      </button>
      <button type="button" onClick={() => setModalType("location")}>
        위치기반서비스 이용약관
      </button>
    </div>
  );

  return (
    <AuthLayout variant="bar" belowCard={termsLinks}>
      <h1 className="login-title">로그인</h1>
      <StepIndicator step={step} />

      {step === 1 ? (
        <>
          <RoleSelectCards value={role} onChange={setRole} />
          <div className="login-actions login-actions--end">
            <AuthButton variant="primary" onClick={() => setStep(2)}>
              다음
            </AuthButton>
          </div>
        </>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>이메일 입력</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </label>
          <label className="login-field">
            <span>비밀번호 입력</span>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <div className="login-links">
            <Link to="/find-id">아이디 찾기</Link>
            <span className="login-links-divider">|</span>
            <Link to="/reset-password">비밀번호 재설정</Link>
            <span className="login-links-divider">|</span>
            <Link to="/signup">회원가입</Link>
          </div>

          <div className="login-actions">
            <AuthButton
              variant="neutral"
              type="button"
              onClick={() => setStep(1)}
            >
              이전
            </AuthButton>
            <AuthButton variant="primary" type="submit">
              로그인
            </AuthButton>
          </div>
        </form>
      )}

      {modalType && (
        <TermsModal
          initialType={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </AuthLayout>
  );
}
