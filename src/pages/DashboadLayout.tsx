import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
            <strong>School Manager</strong>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/subjects">Subjects</NavLink>
          <NavLink to="/subjects/create">Create Subject</NavLink>
        </nav>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
