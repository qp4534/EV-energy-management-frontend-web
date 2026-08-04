import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { mockResetPassword } from "../../services/userService";
import "../../styles/auth/ResetPassword.css";

export default function ResetPasswordNew() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mockResetPassword({ password, passwordConfirm });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout variant="plain">
      <h2 className="reset-title">비밀번호 재설정</h2>

      <form className="reset-new-form" onSubmit={handleSubmit}>
        <PasswordInput
          placeholder="새 비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          placeholder="새 비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        {error && <p className="reset-error">{error}</p>}

        <AuthButton variant="neutral" type="submit" className="reset-new-submit">
          변경하기
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
