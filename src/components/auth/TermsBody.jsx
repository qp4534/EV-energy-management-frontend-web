export default function TermsBody({ content }) {
  return (
    <>
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
    </>
  );
}
