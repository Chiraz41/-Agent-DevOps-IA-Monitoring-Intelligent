export default function EmptyState({
  title = "Aucune donnée",
  message = "Aucune information disponible.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">○</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}