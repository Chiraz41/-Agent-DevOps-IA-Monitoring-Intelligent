export function formatTime(timestamp) {
  if (!timestamp) return "--";

  return new Date(timestamp).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDate(timestamp) {
  if (!timestamp) return "--";

  return new Date(timestamp).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatScore(score) {
  if (score === null || score === undefined) return "--";

  return Number(score).toFixed(3);
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return "--";

  const date = new Date(timestamp);
  const now = new Date();

  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "à l'instant";

  const minutes = Math.floor(diff / 60);

  if (minutes < 60) {
    return `il y a ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `il y a ${hours} h`;
  }

  const days = Math.floor(hours / 24);

  return `il y a ${days} j`;
}