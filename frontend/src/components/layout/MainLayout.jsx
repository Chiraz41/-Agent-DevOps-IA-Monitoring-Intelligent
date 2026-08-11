import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({
  children,
  currentPath,
  onNavigate,
  health,
  user,
  onLogout,
}) {
  return (
    <div className="app-layout">
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        role={user?.role}
      />

      <div className="main-area">
        <Header health={health} user={user} onLogout={onLogout} />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
