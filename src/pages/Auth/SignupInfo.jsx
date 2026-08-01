import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import RoleSideToggle from "../../components/auth/RoleSideToggle";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { mockSignup } from "../../services/userService";
import "../../styles/auth/SignupInfo.css";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function SignupInfo() {
  const navigate = useNavigate();
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

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const birth =
        form.birthYear && form.birthMonth && form.birthDay
          ? `${form.birthYear}-${String(form.birthMonth).padStart(2, "0")}-${String(
              form.birthDay
            ).padStart(2, "0")}`
          : "";
      await mockSignup({
        role,
        name: form.name,
        email: form.email,
        phone: form.phone,
        birth,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
      });
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

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
                onChange={update("email")}
                placeholder="123@mijungE.com"
              />
              <AuthButton variant="primary" type="button">
                이메일 인증
              </AuthButton>
            </div>
          </label>

          <div className="signup-info-inline">
            <input
              value={form.emailCode}
              onChange={update("emailCode")}
              placeholder="인증번호 입력"
            />
            <AuthButton variant="primary" type="button">
              인증번호 확인
            </AuthButton>
          </div>

          <label>
            <span>전화번호</span>
            <input
              value={form.phone}
              onChange={update("phone")}
              placeholder="전화번호 입력"
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
              placeholder="8자리 이상 입력"
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
