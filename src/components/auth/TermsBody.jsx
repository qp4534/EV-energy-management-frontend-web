const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
const LETTERED = ["가.", "나.", "다.", "라.", "마.", "바.", "사.", "아.", "자.", "차."];

function Block({ block }) {
  if (block.t === "p") {
    return <p>{block.text}</p>;
  }

  if (block.t === "table") {
    return (
      <div className="terms-table-wrap">
        <table className="terms-table">
          <thead>
            <tr>
              {block.headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const marks = block.t === "circled" ? CIRCLED : LETTERED;

  return (
    <ol className={`terms-list terms-list--${block.t}`}>
      {block.items.map((item, i) => (
        <li key={i}>
          <span className="terms-list-mark">{marks[i]}</span>
          <span>
            {item.text}
            {item.sub && (
              <ul className="terms-sublist">
                {item.sub.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ul>
            )}
            {item.subLettered && (
              <ol className="terms-list terms-list--lettered terms-sublist">
                {item.subLettered.map((s, j) => (
                  <li key={j}>
                    <span className="terms-list-mark">{LETTERED[j]}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function TermsBody({ content }) {
  return (
    <>
      {content.intro && <p className="terms-intro">{content.intro}</p>}

      {content.sections.map((section) => (
        <section key={section.heading}>
          {section.chapter && <h2 className="terms-chapter">{section.chapter}</h2>}
          <div className="terms-section">
            <h3>{section.heading}</h3>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </section>
      ))}

      <p className="terms-closing">
        {content.closing.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </>
  );
}
