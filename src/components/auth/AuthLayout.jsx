import { FiZap } from "react-icons/fi";
import "../../styles/auth/AuthLayout.css";

export default function AuthLayout({
  variant = "plain",
  fullWidth = false,
  belowCard = null,
  children,
}) {
  return (
    <div className="auth-page">
      {variant === "bar" ? (
        <header className="auth-page-header">
          <div className="auth-page-logo">
            <FiZap className="auth-page-logo-icon" />
            <span>MijungE</span>
          </div>
        </header>
      ) : (
        <div className="auth-page-logo auth-page-logo--plain">
          <FiZap className="auth-page-logo-icon auth-page-logo-icon--plain" />
          <span>MijungE</span>
        </div>
      )}

      <main className={`auth-page-main ${fullWidth ? "auth-page-main--full" : ""}`}>
        {fullWidth ? children : <div className="auth-card">{children}</div>}
        {belowCard}
      </main>

      <footer className="auth-page-footer">
        <span>@EV energy resource management platform</span>
      </footer>
    </div>
  );
}
