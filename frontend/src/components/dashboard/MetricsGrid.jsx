import MetricCard from "./MetricCard";

export default function MetricsGrid({ metrics }) {
  return (
    <div className="metrics-grid">
      <MetricCard
        type="cpu"
        label="CPU"
        value={metrics?.cpu}
        unit="%"
      />

      <MetricCard
        type="ram"
        label="RAM"
        value={metrics?.memoire}
        unit="%"
      />

      <MetricCard
        type="network"
        label="Réseau"
        value={metrics?.reseau}
        unit="B/s"
      />

      <MetricCard
        type="error"
        label="Taux d'erreur"
        value={metrics?.taux_erreur}
        unit="%"
      />
    </div>
  );
}