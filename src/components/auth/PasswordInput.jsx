import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../../styles/auth/components/PasswordInput.css";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "비밀번호 입력",
  name,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input">
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {visible ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}
