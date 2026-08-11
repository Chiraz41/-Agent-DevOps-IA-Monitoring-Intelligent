export function getSeverityClass(severity) {
  if (!severity) return "normal";

  const value = severity.toLowerCase();

  if (
    value.includes("critique") ||
    value.includes("critical")
  ) {
    return "critical";
  }

  if (
    value.includes("warning") ||
    value.includes("avertissement")
  ) {
    return "warning";
  }

  if (value.includes("info")) {
    return "info";
  }

  return "normal";
}

export function getSeverityLabel(severity) {
  if (!severity) return "Normal";

  const value = severity.toLowerCase();

  if (value.includes("critique") || value.includes("critical")) {
    return "Critique";
  }

  if (value.includes("warning") || value.includes("avertissement")) {
    return "Avertissement";
  }

  if (value.includes("info")) {
    return "Info";
  }

  return "Normal";
}