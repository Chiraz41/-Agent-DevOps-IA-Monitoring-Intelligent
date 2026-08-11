import {
  Cpu,
  MemoryStick,
  Network,
  AlertCircle,
  Activity,
} from "lucide-react";

const icons = {
  cpu: Cpu,
  ram: MemoryStick,
  network: Network,
  error: AlertCircle,
};

export default function MetricCard({
  type,
  label,
  value,
  unit,
}) {
  const Icon = icons[type] || Activity;

  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span>{label}</span>
        <Icon size={19} />
      </div>

      <div className="metric-value">
        {value ?? "--"}
      </div>

      <div className="metric-unit">
        {unit}
      </div>
    </div>
  );
}