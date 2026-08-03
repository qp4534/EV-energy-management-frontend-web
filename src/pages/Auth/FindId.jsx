import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import RoleTabs from "../../components/auth/RoleTabs";
import AuthButton from "../../components/auth/AuthButton";
import { YEARS, MONTHS, DAYS } from "../../constants/birthDate.constants";
import { mockFindId } from "../../services/userService";
import "../../styles/auth/FindId.css";

export default function FindId() {
  const navigate = useNavigate();
  const [role, setRole] = useState("administrator");
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleRoleChange = (next) => {
    setRole(next);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const birth =
        birthYear && birthMonth && birthDay
          ? `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`
          : "";
      const res = await mockFindId({ role, name, birth, phone });
      setResult(res);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout variant="plain">
      <RoleTabs value={role} onChange={handleRoleChange} />
      <h2 className="find-id-title">아이디 찾기</h2>

      {result ? (
        <div className="find-id-result">
          <p>
            {result.name}님의 아이디는
            <br />
            <strong>{result.userId}</strong> 입니다.
          </p>
        </div>
      ) : (
        <form className="find-id-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="find-id-birth-row">
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
              <option value=""></option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <span>년</span>
            <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
              <option value=""></option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span>월</span>
            <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)}>
              <option value=""></option>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span>일</span>
          </div>
          <input
            type="text"
            placeholder="휴대폰 번호 입력"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <p className="find-id-error">{error}</p>}
          <div className="find-id-submit-row">
            <AuthButton variant="primary" type="submit">
              아이디 찾기
            </AuthButton>
          </div>
        </form>
      )}

      <div className="find-id-actions">
        <AuthButton variant="neutral" onClick={() => navigate("/login")}>
          로그인
        </AuthButton>
        <AuthButton
          variant="primary"
          onClick={() => navigate("/reset-password")}
        >
          비밀번호 재설정
        </AuthButton>
      </div>
    </AuthLayout>
  );
}
