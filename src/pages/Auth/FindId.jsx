import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import RoleTabs from "../../components/auth/RoleTabs";
import AuthButton from "../../components/auth/AuthButton";
import { mockFindId } from "../../services/userService";
import "../../styles/auth/FindId.css";

export default function FindId() {
  const navigate = useNavigate();
  const [role, setRole] = useState("administrator");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
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
      const res = await mockFindId({ role, email });
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
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="find-id-code-row">
            <input
              type="text"
              placeholder="암호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <AuthButton variant="primary" type="submit">
              재전송
            </AuthButton>
          </div>
          {error && <p className="find-id-error">{error}</p>}
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
