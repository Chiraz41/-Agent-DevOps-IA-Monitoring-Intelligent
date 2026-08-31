import { useState } from "react";
import {
  Mail,
  KeyRound,
  Activity,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  UserPlus,
} from "lucide-react";

export default function Login({ onLogin, onSignup, loading, error }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("devops");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const displayError = formError || error;
  const isLogin = mode === "login";
  const isBusy = loading || submitting;

  function switchMode(nextMode) {
    setMode(nextMode);
    setFormError("");
    setFormSuccess("");
  }

  function submitLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setFormError("Renseignez votre email et votre mot de passe.");
      return;
    }

    setFormError("");
    onLogin({ email: email.trim(), password });
  }

  async function submitSignup(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setFormError("Renseignez votre email et votre mot de passe.");
      return;
    }

    if (password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas.");
      return;
    }

    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    try {
      await onSignup({ email: email.trim(), password, role });
      setFormSuccess("Compte créé avec succès. Vous pouvez vous connecter.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => switchMode("login"), 1400);
    } catch (err) {
      console.error("Erreur inscription:", err);
      setFormError(err?.message || "Erreur lors de l'inscription.");
    } finally {
      setSubmitting(false);
    }
  }

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

        <h2 className="login-title">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h2>
        <p className="muted">
          {isLogin
            ? "Accédez au tableau de bord de supervision."
            : "Rejoignez la plateforme de supervision."}
        </p>

        <form
          onSubmit={isLogin ? submitLogin : submitSignup}
          className="login-form"
        >
          <label className="field">
            <span><Mail size={13} /> Email professionnel</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom.nom@entreprise.com"
              disabled={isBusy}
            />
          </label>

          <label className="field">
            <span><KeyRound size={13} /> Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isBusy}
            />
          </label>

          {!isLogin && (
            <>
              <label className="field">
                <span><KeyRound size={13} /> Confirmer le mot de passe</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isBusy}
                />
              </label>

              <div className="role-picker">
                <span className="muted">Inscription en tant que</span>

                <div className="role-toggle">
                  <button
                    type="button"
                    className={role === "devops" ? "active" : ""}
                    onClick={() => setRole("devops")}
                    disabled={isBusy}
                  >
                    <Activity size={14} /> Ingénieur DevOps
                  </button>

                  <button
                    type="button"
                    className={role === "admin" ? "active" : ""}
                    onClick={() => setRole("admin")}
                    disabled={isBusy}
                  >
                    <ShieldCheck size={14} /> Administrateur
                  </button>
                </div>
              </div>
            </>
          )}

          {displayError && (
            <div className="error-box">
              <AlertTriangle size={13} /> {displayError}
            </div>
          )}

          {formSuccess && (
            <div className="success-box">
              <CheckCircle2 size={13} /> {formSuccess}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isBusy}>
            {isLogin ? <Lock size={14} /> : <UserPlus size={14} />}
            {isBusy
              ? isLogin
                ? "Connexion..."
                : "Création en cours..."
              : isLogin
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </form>

        <p className="login-note muted">
          {isLogin ? (
            <>
              Pas encore de compte ?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => switchMode("signup")}
                disabled={isBusy}
              >
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà inscrit ?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => switchMode("login")}
                disabled={isBusy}
              >
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}