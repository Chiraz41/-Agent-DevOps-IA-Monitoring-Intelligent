import { useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Anomalies from "./pages/Anomalies";
import Historique from "./pages/Historique";
import Logs from "./pages/Logs";
import Statistiques from "./pages/Statistiques";
import Assistant from "./pages/Assistant";
import Administration from "./pages/Administration";

import { useHealth } from "./hooks/useHealth";
import { useAuth } from "./hooks/useAuth";

function getPage(path, role) {
  switch (path) {
    case "/anomalies":
      return <Anomalies />;

    case "/historique":
      return <Historique />;

    case "/logs":
      return <Logs />;

    case "/statistiques":
      return <Statistiques />;

    case "/assistant":
      return <Assistant />;

    case "/administration":
      return role === "admin" ? <Administration /> : <Dashboard />;

    case "/":
    default:
      return <Dashboard />;
  }
}

export default function App() {
  const [currentPath, setCurrentPath] =
    useState(window.location.pathname);

  const { health } = useHealth(30000);
  const { user, loading, error, login, logout } = useAuth();

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <Login onLogin={login} loading={loading} error={error} />;
  }

  return (
    <MainLayout
      currentPath={currentPath}
      onNavigate={navigate}
      health={health}
      user={user}
      onLogout={handleLogout}
    >
      {getPage(currentPath, user.role)}
    </MainLayout>
  );
}
