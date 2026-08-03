import { FiUser, FiMonitor } from "react-icons/fi";
import "../../styles/auth/components/RoleSelectCards.css";

const ROLES = [
  { value: "administrator", label: "관리자", Icon: FiUser },
  { value: "controller", label: "관제자", Icon: FiMonitor },
];

export default function RoleSelectCards({ value, onChange }) {
  return (
    <div className="role-select-cards">
      {ROLES.map(({ value: v, label, Icon }) => (
        <button
          key={v}
          type="button"
          className={`role-card ${value === v ? "role-card--selected" : ""}`}
          onClick={() => onChange(v)}
        >
          <Icon className="role-card-icon" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
