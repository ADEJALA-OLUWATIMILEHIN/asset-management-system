import { Bell, Download, HelpCircle, Plus, Search } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const topLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Assets", to: "/assets" },
  { label: "Maintenance", to: "/maintenance" },
];

const pageConfig: Record<string, { title: string; search: string; cta?: string; ctaTo?: string }> = {
  "/reports": { title: "Reports", search: "Search reports...", cta: "New Report" },
  "/maintenance": {
    title: "",
    search: "Search maintenance logs...",
    cta: "Schedule Maintenance",
    ctaTo: "/maintenance/schedule",
  },
  "/documents": { title: "", search: "Search documents...", cta: "Upload Document", ctaTo: "/documents/new" },
  "/calendar": { title: "", search: "Search events...", cta: "Add Event", ctaTo: "/calendar" },
  "/users": { title: "", search: "Search users, roles, departments...", cta: "Add User" },
  "/audit-logs": { title: "", search: "Search logs, IDs, or users...", cta: "Export" },
  "/assets": { title: "", search: "Quick Search..." },
  "/": { title: "", search: "Search assets, records...", cta: "New Asset" },
};

export const Topbar = () => {
  const { pathname } = useLocation();
  const config = pathname.startsWith("/assets") ? pageConfig["/assets"] : pageConfig[pathname] ?? pageConfig["/"];
  const cta = config.cta;
  const isReport = pathname === "/reports";
  const isAudit = pathname === "/audit-logs";
  const isUsers = pathname === "/users";
  const userName = "Dele Daniel";

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-7 border-b border-slate-200 bg-white px-8">
      <Link to="/" className="text-lg font-bold text-blue-950">
        ALMS
      </Link>

      {config.title && (
        <div className="text-2xl font-bold text-slate-900">{config.title}</div>
      )}

      {!isReport && (
        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {topLinks.map((link) => (
            <NavLink
              className={({ isActive }) =>
                [
                  "border-b-2 border-transparent py-6 font-medium transition",
                  isActive ? "border-blue-900 text-blue-900" : "text-slate-500 hover:text-slate-700",
                ].join(" ")
              }
              end={link.to === "/"}
              key={link.label}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}

      <label className="relative ml-auto hidden w-full max-w-[390px] items-center md:flex">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
        <input
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-900/20"
          placeholder={config.search}
          type="search"
        />
      </label>

      {(isAudit || isReport) && (
        <button className="hidden h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-blue-900 hover:bg-slate-50 sm:inline-flex">
          <Download className="h-4 w-4" />
          Export
        </button>
      )}

      {!isAudit && !isUsers && cta === "New Asset" && (
        <Link
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-900 px-5 text-sm font-medium text-white hover:bg-blue-800"
          to="/assets/new"
        >
          <Plus className="h-4 w-4" />
          {cta}
        </Link>
      )}
      {!isAudit && !isUsers && cta && cta !== "New Asset" && (
        <Link
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-900 px-5 text-sm font-medium text-white hover:bg-blue-800"
          to={config.ctaTo ?? pathname}
        >
          <Plus className="h-4 w-4" />
          {cta}
        </Link>
      )}

      <button aria-label="Help" className="hidden text-slate-500 hover:text-slate-700 sm:block">
        <HelpCircle className="h-5 w-5" />
      </button>

      <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:text-slate-700">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </button>

      <div className="hidden h-9 border-l border-slate-200 sm:block" />

      <div className="hidden items-center gap-2 sm:flex">
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">{userName}</p>
          <p className="text-xs text-slate-500">Asset Manager</p>
        </div>
      </div>
    </header>
  );
};
