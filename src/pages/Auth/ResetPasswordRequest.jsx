import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthButton from "../../components/auth/AuthButton";
import { userService } from "../../services/userService";
import "../../styles/auth/ResetPassword.css";

export default function ResetPasswordRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (verified) {
      setVerified(false);
      setCodeSent(false);
      setMessage("");
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await userService.requestPasswordReset(email);
      setCodeSent(true);
      setMessage("인증번호를 보냈어요. 이메일을 확인해주세요.");
      setCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await userService.verifyEmailCode(email, code);
      setVerified(true);
      setMessage("이메일 인증이 완료되었습니다.");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout variant="plain">
      <h2 className="reset-title">비밀번호 재설정</h2>

      <form className="reset-request-form" onSubmit={handleSendCode}>
        <div className="reset-inline">
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={handleEmailChange}
            disabled={verified}
          />
          <AuthButton
            variant="primary"
            type="submit"
            disabled={busy || verified || cooldown > 0 || !email}
          >
            {verified
              ? "인증완료"
              : cooldown > 0
                ? `재전송 (${cooldown}s)`
                : codeSent
                  ? "재전송"
                  : "인증번호 발송"}
          </AuthButton>
        </div>

        <div className="reset-inline">
          <input
            type="text"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={verified || !codeSent}
          />
          <AuthButton
            variant="primary"
            type="button"
            onClick={handleVerifyCode}
            disabled={busy || verified || !codeSent || !code}
          >
            {verified ? "인증완료" : "확인"}
          </AuthButton>
        </div>

        {message && <p className={verified ? "reset-success" : "reset-error"}>{message}</p>}
        {error && <p className="reset-error">{error}</p>}

        {verified && (
          <div className="reset-sent-notice">
            <p>본인 확인이 끝났습니다.</p>
            <AuthButton
              variant="primary"
              type="button"
              onClick={() => navigate("/reset-password/new", { state: { email } })}
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
