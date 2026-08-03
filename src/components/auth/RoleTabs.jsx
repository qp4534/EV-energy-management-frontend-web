import "../../styles/auth/components/RoleTabs.css";

const TABS = [
  { value: "administrator", label: "관리자" },
  { value: "controller", label: "관제자" },
];

export default function RoleTabs({ value, onChange }) {
  return (
    <div className="role-tabs">
      {TABS.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          className={`role-tab ${value === v ? "role-tab--active" : ""}`}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
