import { useParams, Navigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import TermsBody from "../../components/auth/TermsBody";
import { TERMS_CONTENT, TERMS_TABS } from "../../constants/terms.constants";
import "../../styles/auth/Terms.css";

export default function Terms() {
  const { type } = useParams();
  const content = TERMS_CONTENT[type];

  if (!content) {
    return <Navigate to="/terms/privacy" replace />;
  }

  return (
    <AuthLayout variant="bar" fullWidth>
      <div className="terms-page">
        <h1 className="terms-title">약관 및 정책</h1>

        <div className="terms-tabs">
          {TERMS_TABS.map((tab) => (
            <Link
              key={tab.type}
              to={`/terms/${tab.type}`}
              className={`terms-tab ${
                tab.type === type ? "terms-tab--active" : ""
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <article className="terms-body">
          <TermsBody content={content} />
        </article>
      </div>
    </AuthLayout>
  );
}
