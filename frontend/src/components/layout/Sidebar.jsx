import {
  LayoutDashboard,
  AlertTriangle,
  History,
  FileText,
  BarChart3,
  Bot,
  ShieldCheck,
} from "lucide-react";

const menuItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/anomalies",
    label: "Anomalies",
    icon: AlertTriangle,
  },
  {
    path: "/historique",
    label: "Historique",
    icon: History,
  },
  {
    path: "/logs",
    label: "Logs",
    icon: FileText,
  },
  {
    path: "/statistiques",
    label: "Statistiques",
    icon: BarChart3,
  },
  {
    path: "/assistant",
    label: "Assistant IA",
    icon: Bot,
  },
];

const adminItem = {
  path: "/administration",
  label: "Administration",
  icon: ShieldCheck,
};

export default function Sidebar({ currentPath, onNavigate, role }) {
  const items = role === "admin" ? [...menuItems, adminItem] : menuItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">AI</div>

        <div>
          <h1>Agent DevOps</h1>
          <span>Monitoring intelligent</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            currentPath === item.path ||
            (item.path !== "/" &&
              currentPath.startsWith(item.path));

          return (
            <button
              key={item.path}
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => onNavigate(item.path)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
