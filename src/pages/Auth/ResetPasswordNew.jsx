import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import { userService } from "../../services/userService";
import "../../styles/auth/ResetPassword.css";

export default function ResetPasswordNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/reset-password", { replace: true });
    }
  }, [email, navigate]);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.resetPassword({ email, password, passwordConfirm });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout variant="plain">
      <h2 className="reset-title">비밀번호 재설정</h2>

      <form className="reset-new-form" onSubmit={handleSubmit}>
        <PasswordInput
          placeholder="8자리 이상, 대/소문자·숫자·특수문자 포함"
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
