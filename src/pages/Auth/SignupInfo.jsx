import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import RoleSideToggle from "../../components/auth/RoleSideToggle";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { userService } from "../../services/userService";
import { YEARS, MONTHS, DAYS } from "../../constants/birthDate.constants";
import { formatPhoneNumber } from "../../utils/phone";
import "../../styles/auth/SignupInfo.css";

export default function SignupInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const agreements = location.state?.agreements;

  useEffect(() => {
    if (!agreements) {
      navigate("/signup", { replace: true });
    }
  }, [agreements, navigate]);

  const [role, setRole] = useState("controller");
  const [form, setForm] = useState({
    name: "",
    email: "",
    emailCode: "",
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const updateEmail = (e) => {
    setForm((prev) => ({ ...prev, email: e.target.value }));
    if (emailVerified) {
      setEmailVerified(false);
      setEmailCodeSent(false);
      setEmailMessage("");
    }
  };

  const handleSendCode = async () => {
    setEmailMessage("");
    setEmailBusy(true);
    try {
      await userService.sendVerificationCode(form.email);
      setEmailCodeSent(true);
      setEmailMessage("인증번호를 보냈어요. 이메일을 확인해주세요.");
      setCooldown(120);
    } catch (err) {
      setEmailMessage(err.response?.data?.message || err.message);
    } finally {
      setEmailBusy(false);
    }
  };

  const handleVerifyCode = async () => {
    setEmailMessage("");
    setEmailBusy(true);
    try {
      await userService.verifyEmailCode(form.email, form.emailCode);
      setEmailVerified(true);
      setEmailMessage("이메일 인증이 완료되었습니다.");
    } catch (err) {
      setEmailMessage(err.response?.data?.message || err.message);
    } finally {
      setEmailBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      setError("이메일 인증을 먼저 완료해주세요.");
      return;
    }
    // 년/월/일 중 하나라도 안 고르면 예전엔 그냥 빈 값으로 서버에 보내서, 서버 쪽 not-null
    // 제약에 걸려 "서버 오류가 발생했습니다"라는 알아보기 힘든 에러만 뜨고 왜 실패했는지
    // 알 수 없었다 - 여기서 먼저 걸러서 무엇이 비어있는지 바로 알려준다.
    if (!form.birthYear || !form.birthMonth || !form.birthDay) {
      setError("생년월일(년/월/일)을 모두 선택해주세요.");
      return;
    }
    try {
      const birth = `${form.birthYear}-${String(form.birthMonth).padStart(2, "0")}-${String(
        form.birthDay
      ).padStart(2, "0")}`;
      const consentedTerms = Object.entries(agreements ?? {})
        .filter(([, agreed]) => agreed)
        .map(([key]) => key);
      await userService.signup({
        role,
        name: form.name,
        email: form.email,
        phone: form.phone,
        birth,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        consentedTerms,
      });
      setSuccess(true);
      setError("");
    } catch (err) {
      // VALIDATION_ERROR 응답은 실제 이유가 최상위 message("입력값을 확인해주세요.")가
      // 아니라 fieldErrors 안에 있다 - 예전엔 이 구체적인 이유를 화면에 못 보여줘서
      // 무엇이 문제인지 사용자가 알 방법이 없었다. 있으면 그걸 우선 보여준다.
      const fieldErrors = err.response?.data?.fieldErrors;
      const firstFieldError = fieldErrors && Object.values(fieldErrors)[0];
      setError(firstFieldError || err.response?.data?.message || err.message);
    }
  };

  if (!agreements) {
    return null;
  }

  if (success) {
    return (
      <div className="signup-info-page">
        <div className="signup-success-card">
          <p>회원가입이 완료되었습니다.</p>
          <p className="signup-success-sub">로그인 화면으로 이동할까요?</p>
          <AuthButton variant="primary" onClick={() => navigate("/login")}>
            로그인 화면으로 이동
          </AuthButton>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-info-page">
      <div className="signup-info-card">
        <aside className="signup-info-side">
          <div className="signup-info-logo">
            <FiZap />
            <span>MijungE</span>
          </div>
          <div className="signup-info-role">
            <p>직원 구분</p>
            <RoleSideToggle value={role} onChange={setRole} />
          </div>
        </aside>

        <form className="signup-info-form" onSubmit={handleSubmit}>
          <h2>회원가입</h2>

          <label>
            <span>이름</span>
            <input
              value={form.name}
              onChange={update("name")}
              placeholder="홍길동"
            />
          </label>

          <label>
            <span>이메일</span>
            <div className="signup-info-inline">
              <input
                value={form.email}
                onChange={updateEmail}
                placeholder="123@mijungE.com"
                disabled={emailVerified}
              />
              <AuthButton
                variant="primary"
                type="button"
                onClick={handleSendCode}
                disabled={emailBusy || emailVerified || cooldown > 0 || !form.email}
              >
                {emailVerified
                  ? "인증완료"
                  : cooldown > 0
                    ? `재전송 (${cooldown}s)`
                    : emailCodeSent
                      ? "재전송"
                      : "이메일 인증"}
              </AuthButton>
            </div>
          </label>

          <div className="signup-info-inline">
            <input
              value={form.emailCode}
              onChange={update("emailCode")}
              placeholder="인증번호 입력"
              disabled={emailVerified || !emailCodeSent}
            />
            <AuthButton
              variant="primary"
              type="button"
              onClick={handleVerifyCode}
              disabled={emailBusy || emailVerified || !emailCodeSent || !form.emailCode}
            >
              {emailVerified ? "인증완료" : "인증번호 확인"}
            </AuthButton>
          </div>

          {emailMessage && (
            <p className={emailVerified ? "signup-info-email-success" : "signup-info-error"}>
              {emailMessage}
            </p>
          )}

          {emailCodeSent && !emailVerified && (
            <p className="signup-info-email-hint">
              구글 메일 인증 특성상 인증번호 도착까지 최대 1~2분 정도 걸릴 수 있어요. 조금만 기다려주세요.
            </p>
          )}

          <label>
            <span>전화번호</span>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))
              }
              placeholder="010-0000-0000"
              maxLength={13}
            />
          </label>

          <label>
            <span>생년월일</span>
            <div className="signup-info-birth">
              <select value={form.birthYear} onChange={update("birthYear")}>
                <option value=""></option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span>년</span>
              <select value={form.birthMonth} onChange={update("birthMonth")}>
                <option value=""></option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <span>월</span>
              <select value={form.birthDay} onChange={update("birthDay")}>
                <option value=""></option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <span>일</span>
            </div>
          </label>

          <label>
            <span>비밀번호</span>
            <PasswordInput
              value={form.password}
              onChange={update("password")}
              placeholder="8자리 이상, 대/소문자·숫자·특수문자 포함"
            />
          </label>

          <label>
            <span>비밀번호 확인</span>
            <PasswordInput
              value={form.passwordConfirm}
              onChange={update("passwordConfirm")}
              placeholder="비밀번호 재입력"
            />
          </label>

          {error && <p className="signup-info-error">{error}</p>}

          <AuthButton
            variant="primary"
            type="submit"
            className="signup-info-submit"
          >
            회원가입
          </AuthButton>
        </form>
      </div>
    </div>
  );
}
