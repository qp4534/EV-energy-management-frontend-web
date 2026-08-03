import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import RoleTabs from "../../components/auth/RoleTabs";
import AuthButton from "../../components/auth/AuthButton";
import { mockRequestPasswordReset } from "../../services/userService";
import "../../styles/auth/ResetPassword.css";

export default function ResetPasswordRequest() {
  const navigate = useNavigate();
  const [role, setRole] = useState("administrator");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (next) => {
    setRole(next);
    setSent(false);
    setError("");
  };

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      await mockRequestPasswordReset({ role, userId, email });
      setSent(true);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout variant="plain">
      <RoleTabs value={role} onChange={handleRoleChange} />
      <h2 className="reset-title">비밀번호 재설정</h2>

      <form className="reset-request-form" onSubmit={handleResend}>
        <input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="reset-error">{error}</p>}

        <div className="reset-resend-row">
          <AuthButton variant="primary" type="submit">
            {sent ? "재전송" : "찾기"}
          </AuthButton>
        </div>

        {sent && (
          <div className="reset-sent-notice">
            <p>이메일로 재설정 링크를 보냈습니다.</p>
            <AuthButton
              variant="primary"
              type="button"
              onClick={() => navigate("/reset-password/new")}
            >
              새 비밀번호 설정하기
            </AuthButton>
          </div>
        )}
      </form>

      <div className="reset-actions">
        <AuthButton variant="neutral" onClick={() => navigate("/login")}>
          로그인
        </AuthButton>
      </div>
    </AuthLayout>
  );
}
