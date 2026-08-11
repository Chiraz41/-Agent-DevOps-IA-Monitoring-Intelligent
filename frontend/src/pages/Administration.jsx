import { useState } from "react";
import {
  Users,
  SlidersHorizontal,
  Settings2,
  UserPlus,
  Trash2,
  ShieldCheck,
  Activity,
} from "lucide-react";

const METRICS = [
  "CPU",
  "Latence P99",
  "Taux d'erreur",
  "Mémoire",
  "I/O disque",
];

const ROLE_LABELS = {
  admin: "Administrateur",
  devops: "Ingénieur DevOps",
};

// Données de démonstration en attendant le branchement de
// src/services/adminService.js sur le backend (GET/POST /admin/users,
// GET/PUT /admin/thresholds, GET/PUT /admin/agent-settings).
function seedUsers() {
  return [
    { id: crypto.randomUUID(), name: "Nadia Ben Salah", email: "nadia.bensalah@entreprise.com", role: "admin", active: true },
    { id: crypto.randomUUID(), name: "Yassine Trabelsi", email: "yassine.t@entreprise.com", role: "devops", active: true },
    { id: crypto.randomUUID(), name: "Sarra Mejri", email: "sarra.mejri@entreprise.com", role: "devops", active: false },
  ];
}

function seedThresholds() {
  const base = { "CPU": 70, "Latence P99": 400, "Taux d'erreur": 2, "Mémoire": 75, "I/O disque": 80 };
  const out = {};
  METRICS.forEach((m) => {
    out[m] = { avertissement: base[m], critique: Math.round(base[m] * 1.3) };
  });
  return out;
}

export default function Administration() {
  const [section, setSection] = useState("users");
  const [users, setUsers] = useState(seedUsers);
  const [thresholds, setThresholds] = useState(seedThresholds);
  const [agentSettings, setAgentSettings] = useState({
    sensitivity: "normale",
    frequency: "1min",
    emailCritical: true,
  });
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "devops" });

  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    setUsers((prev) => [
      { id: crypto.randomUUID(), ...newUser, name: newUser.name.trim(), email: newUser.email.trim(), active: true },
      ...prev,
    ]);
    setNewUser({ name: "", email: "", role: "devops" });
  };

  const toggleActive = (id) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));

  const removeUser = (id) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  const updateThreshold = (metric, key, value) =>
    setThresholds((prev) => ({ ...prev, [metric]: { ...prev[metric], [key]: Number(value) } }));

  return (
    <div className="page">
      <div className="page-title">
        <h1>Administration</h1>
        <p>
          Gestion des accès, des seuils de détection et des paramètres de
          l'agent — réservé aux administrateurs.
        </p>
      </div>

      <div className="admin-subnav">
        <button className={section === "users" ? "active" : ""} onClick={() => setSection("users")}>
          <Users size={14} /> Utilisateurs
        </button>
        <button className={section === "thresholds" ? "active" : ""} onClick={() => setSection("thresholds")}>
          <SlidersHorizontal size={14} /> Seuils de détection
        </button>
        <button className={section === "agent" ? "active" : ""} onClick={() => setSection("agent")}>
          <Settings2 size={14} /> Paramètres de l'agent
        </button>
      </div>

      {section === "users" && (
        <section className="dashboard-card">
          <div className="add-user-row">
            <input
              placeholder="Nom complet"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="devops">Ingénieur DevOps</option>
              <option value="admin">Administrateur</option>
            </select>
            <button className="btn-primary" onClick={addUser}>
              <UserPlus size={14} /> Ajouter
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-pill ${u.role === "admin" ? "role-admin" : "role-devops"}`}>
                        {u.role === "admin" ? <ShieldCheck size={12} /> : <Activity size={12} />}
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`table-status ${u.active ? "success" : "danger"}`}
                        style={{ border: "none", cursor: "pointer" }}
                        onClick={() => toggleActive(u.id)}
                      >
                        {u.active ? "Actif" : "Désactivé"}
                      </button>
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => removeUser(u.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {section === "thresholds" && (
        <section className="dashboard-card">
          <p className="muted" style={{ marginBottom: 14 }}>
            Valeur à partir de laquelle une métrique est classée en
            avertissement ou en critique par le modèle.
          </p>

          <div className="threshold-grid">
            {METRICS.map((m) => (
              <div key={m} className="threshold-card">
                <span className="threshold-name">{m}</span>
                <label>
                  <span className="th-label th-warn">Avertissement</span>
                  <input
                    type="number"
                    value={thresholds[m].avertissement}
                    onChange={(e) => updateThreshold(m, "avertissement", e.target.value)}
                  />
                </label>
                <label>
                  <span className="th-label th-crit">Critique</span>
                  <input
                    type="number"
                    value={thresholds[m].critique}
                    onChange={(e) => updateThreshold(m, "critique", e.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
      )}

      {section === "agent" && (
        <section className="dashboard-card">
          <div className="agent-settings">
            <label className="field">
              <span>Sensibilité de détection</span>
              <select
                value={agentSettings.sensitivity}
                onChange={(e) => setAgentSettings({ ...agentSettings, sensitivity: e.target.value })}
              >
                <option value="faible">Faible — moins de faux positifs</option>
                <option value="normale">Normale — équilibrée</option>
                <option value="elevee">Élevée — détection précoce</option>
              </select>
            </label>

            <label className="field">
              <span>Fréquence d'analyse</span>
              <select
                value={agentSettings.frequency}
                onChange={(e) => setAgentSettings({ ...agentSettings, frequency: e.target.value })}
              >
                <option value="30s">Toutes les 30 secondes</option>
                <option value="1min">Toutes les minutes</option>
                <option value="5min">Toutes les 5 minutes</option>
              </select>
            </label>

            <label className="toggle-row">
              <span>Notifier par email les alertes critiques</span>
              <input
                type="checkbox"
                checked={agentSettings.emailCritical}
                onChange={(e) => setAgentSettings({ ...agentSettings, emailCritical: e.target.checked })}
              />
            </label>
          </div>
        </section>
      )}
    </div>
  );
}
