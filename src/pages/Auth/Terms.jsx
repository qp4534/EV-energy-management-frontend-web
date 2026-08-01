import { useParams, Navigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { TERMS_CONTENT, TERMS_TABS } from "../../constants/terms.constants";
import "../../styles/auth/Terms.css";

export default function Terms() {
  const { type } = useParams();
  const content = TERMS_CONTENT[type];

  if (!content) {
    return <Navigate to="/terms/service" replace />;
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
          {content.sections.map((section) => (
            <section key={section.heading} className="terms-section">
              <h3>{section.heading}</h3>
              {section.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.list && (
                <ol>
                  {section.list.map((item, i) => (
                    <li key={i}>
                      {item.text}
                      {item.sub && (
                        <ul>
                          {item.sub.map((s, j) => (
                            <li key={j}>{s}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
          <p className="terms-closing">{content.closing}</p>
        </article>
      </div>
    </AuthLayout>
  );
}
