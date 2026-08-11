import { useState } from "react";
import {
  User,
  Mail,
  KeyRound,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function Login({ onLogin, loading, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("devops");
  const [formError, setFormError] = useState("");

  const displayError = formError || error;

  const submit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("Renseignez votre nom, votre email et votre mot de passe.");
      return;
    }

    setFormError("");
    onLogin({ name: name.trim(), email: email.trim(), password, role });
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="sidebar-brand">
          <div className="brand-icon">AI</div>

          <div>
            <h1>Agent DevOps</h1>
            <span>Monitoring intelligent</span>
          </div>
        </div>

        <h2 className="login-title">Connexion</h2>
        <p className="muted">Accédez au tableau de bord de supervision.</p>

        <form onSubmit={submit} className="login-form">
          <label className="field">
            <span><User size={13} /> Nom complet</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Nadia Ben Salah"
            />
          </label>

          <label className="field">
            <span><Mail size={13} /> Email professionnel</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom.nom@entreprise.com"
            />
          </label>

          <label className="field">
            <span><KeyRound size={13} /> Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <div className="role-picker">
            <span className="muted">Se connecter en tant que</span>

            <div className="role-toggle">
              <button
                type="button"
                className={role === "devops" ? "active" : ""}
                onClick={() => setRole("devops")}
              >
                <Activity size={14} /> Ingénieur DevOps
              </button>

              <button
                type="button"
                className={role === "admin" ? "active" : ""}
                onClick={() => setRole("admin")}
              >
                <ShieldCheck size={14} /> Administrateur
              </button>
            </div>
          </div>

          {displayError && (
            <div className="error-box">
              <AlertTriangle size={13} /> {displayError}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            <Lock size={14} /> {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="login-note muted">
          Démo — tant que le backend d'authentification n'est pas branché
          (voir src/hooks/useAuth.js), la connexion utilise les informations
          saisies ci-dessus. Le rôle choisi détermine les sections visibles
          du tableau de bord.
        </p>
      </div>
    </div>
  );
}
