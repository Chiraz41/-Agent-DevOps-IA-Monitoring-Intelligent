import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
} from "lucide-react";

export default function Badge({ type = "normal", children }) {
  const config = {
    normal: {
      icon: CheckCircle2,
      className: "badge-normal",
    },
    warning: {
      icon: AlertTriangle,
      className: "badge-warning",
    },
    critical: {
      icon: AlertOctagon,
      className: "badge-critical",
    },
    info: {
      icon: Info,
      className: "badge-info",
    },
  };

  const current = config[type] || config.normal;

  const Icon = current.icon;

  return (
    <span className={`status-badge ${current.className}`}>
      <Icon size={13} />
      {children}
    </span>
  );
}