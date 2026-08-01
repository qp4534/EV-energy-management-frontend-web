import "../../styles/auth/components/AuthButton.css";

export default function AuthButton({
  children,
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`auth-btn auth-btn--${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
