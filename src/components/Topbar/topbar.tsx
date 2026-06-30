import { Bell, Download, Plus, Search } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

const topLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Assets", to: "/assets" },
  { label: "Maintenance", to: "/maintenance" },
];

const pageConfig: Record<string, { title: string; search: string; cta?: string }> = {
  "/reports": { title: "Reports", search: "Search reports...", cta: "New Report" },
  "/maintenance": {
    title: "ALMS",
    search: "Search maintenance logs...",
    cta: "Schedule Maintenance",
  },
  "/documents": { title: "ALMS", search: "Search assets...", cta: "New Asset" },
  "/calendar": { title: "ALMS", search: "Search events...", cta: "New Asset" },
  "/users": { title: "ALMS", search: "Search users, roles, departments...", cta: "Add User" },
  "/audit-logs": { title: "", search: "Search logs, IDs, or users...", cta: "Export" },
  "/assets": { title: "ALMS", search: "Quick Search..." },
  "/": { title: "ALMS", search: "Search assets, records...", cta: "New Asset" },
};

export const Topbar = () => {
  const { pathname } = useLocation();
  const config = pathname.startsWith("/assets") ? pageConfig["/assets"] : pageConfig[pathname] ?? pageConfig["/"];
  const cta = config.cta;
  const isReport = pathname === "/reports";
  const isAudit = pathname === "/audit-logs";
  const isUsers = pathname === "/users";

  return (
    <header className="flex h-[72px] shrink-0 items-center gap-7 border-b border-[#c7c4d8] bg-[#fbf9ff] px-8">
      {config.title && (
        <div className="text-2xl font-extrabold text-[#001970]">{config.title}</div>
      )}

      {!isReport && (
        <nav className="hidden items-center gap-7 text-base lg:flex">
          {topLinks.map((link) => (
            <NavLink
              className={({ isActive }) =>
                [
                  "border-b-2 border-transparent py-6 font-medium",
                  isActive ? "border-[#001970] text-[#001970]" : "text-[#1f2030]",
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
        <Search className="absolute left-4 h-5 w-5 text-[#606475]" />
        <input
          className="h-10 w-full rounded border border-[#c7c4d8] bg-[#f5f3fa] pl-12 pr-4 text-sm outline-none placeholder:text-[#737789] focus:ring-2 focus:ring-[#001970]"
          placeholder={config.search}
          type="search"
        />
      </label>

      {isAudit && (
        <button className="hidden h-11 items-center gap-2 rounded border border-[#c7c4d8] bg-white px-5 text-sm font-bold text-[#001970] sm:inline-flex">
          <Download className="h-4 w-4" />
          Export
        </button>
      )}
      {isReport && (
        <button className="hidden h-11 items-center gap-2 rounded border border-[#c7c4d8] bg-white px-5 text-sm font-bold text-[#001970] sm:inline-flex">
        <Download className="h-4 w-4" />
        Export
        </button>
      )}
      {!isAudit && !isUsers && cta === "New Asset" && (
        <Link
          className="inline-flex h-11 items-center gap-2 rounded bg-[#001970] px-5 text-sm font-bold text-white shadow-sm"
          to="/assets/new"
        >
          <Plus className="h-4 w-4" />
          {cta}
        </Link>
      )}
      {!isAudit && !isUsers && cta && cta !== "New Asset" && (
        <button className="inline-flex h-11 items-center gap-2 rounded bg-[#001970] px-5 text-sm font-bold text-white shadow-sm">
          <Plus className="h-4 w-4" />
          {cta}
        </button>
      )}
      <button className="relative grid h-10 w-10 place-items-center rounded-full text-[#11111a]">
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#c90000]" />
      </button>
      <div className="hidden h-10 border-l border-[#c7c4d8] sm:block" />
      <div className="hidden items-center gap-4 sm:flex">
        <div className="text-right">
          <p className="text-sm font-bold text-[#11111a]">Alex Thompson</p>
          <p className="text-xs uppercase tracking-[0.15em] text-[#464555]">Asset Manager</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-lg border border-[#8ea1ca] bg-[linear-gradient(145deg,#092552,#4a768b)] text-xs font-bold text-white shadow-sm">
          AT
        </div>
      </div>
    </header>
  );
};
