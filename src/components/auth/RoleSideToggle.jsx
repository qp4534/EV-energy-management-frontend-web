import "../../styles/auth/components/RoleSideToggle.css";

const OPTIONS = [
  { value: "controller", label: "관제자" },
  { value: "administrator", label: "관리자" },
];

export default function RoleSideToggle({ value, onChange }) {
  return (
    <div className="role-side-toggle">
      {OPTIONS.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          className={`role-side-btn ${
            value === v ? "role-side-btn--selected" : ""
          }`}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
