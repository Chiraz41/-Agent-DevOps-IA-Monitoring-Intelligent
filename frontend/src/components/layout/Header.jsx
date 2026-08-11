import {
  Activity,
  Database,
  Cpu,
  Server,
  ShieldCheck,
  LogOut,
} from "lucide-react";

function Status({ label, status, icon: Icon }) {
  const isOk = status === "ok";

  return (
    <div className={`health-item ${isOk ? "online" : "offline"}`}>
      <Icon size={14} />

      <span>{label}</span>

      <span className="health-dot" />

      <strong>{isOk ? "OK" : "DOWN"}</strong>
    </div>
  );
}

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Header({ health, user, onLogout }) {
  return (
    <header className="header">
      <div>
        <h2>Monitoring Intelligent</h2>
        <p>Agent DevOps IA</p>
      </div>

      <div className="health-container">
        <Status
          label="API"
          status={health?.api}
          icon={Activity}
        />

        <Status
          label="Elasticsearch"
          status={health?.elasticsearch}
          icon={Database}
        />

        <Status
          label="Redis"
          status={health?.redis}
          icon={Server}
        />

        <Status
          label="Ollama"
          status={health?.ollama}
          icon={Cpu}
        />

        {user && (
          <div className="user-box">
            <div className="user-avatar">{initials(user.name)}</div>

            <div className="user-meta">
              <span className="user-name">{user.name}</span>
              <span className="user-role">
                {user.role === "admin" ? <ShieldCheck size={11} /> : <Activity size={11} />}
                {user.role === "admin" ? "Administrateur" : "Ingénieur DevOps"}
              </span>
            </div>

            <button className="btn-logout" onClick={onLogout} title="Se déconnecter">
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
