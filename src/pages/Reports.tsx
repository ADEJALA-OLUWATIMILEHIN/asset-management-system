import { ClipboardCheck, FileSpreadsheet, Filter, FileText, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const reportCards: Array<[string, string, string, LucideIcon]> = [
  ["Asset Register", "Comprehensive ledger of all active, retired, and pending assets across global branches.", "Last updated: 2h ago", ClipboardCheck],
  ["Expiry Report", "Forecast of warranty expirations, lease endings, and lifecycle decommissioning dates.", "12 High Priority", FileText],
  ["Maintenance Report", "Analysis of repair costs, downtime logs, and scheduled preventative maintenance cycles.", "98.4% Uptime", UsersRound],
];

const logs = [
  ["#AST-98234", "IT Infrastructure", "London Data Center", "OPERATIONAL", "$142,500.00", "bg-emerald-100 text-emerald-700"],
  ["#AST-12093", "Corporate Fleet", "Berlin Hub", "MAINTENANCE", "$68,200.00", "bg-amber-100 text-amber-700"],
  ["#AST-44122", "Real Estate", "New York HQ", "OPERATIONAL", "$12,400,000.00", "bg-emerald-100 text-emerald-700"],
  ["#AST-00392", "Heavy Machinery", "Singapore Port", "DECOMMISSIONED", "$540,000.00", "bg-rose-100 text-rose-700"],
];

export default function Reports() {
  return (
    <section className="mx-auto max-w-[1180px] space-y-7">
      <article className="rounded border border-[#c7c4d8] bg-white p-7">
        <div className="mb-7 flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            <Filter className="h-5 w-5 text-[#001970]" />
            Data Intelligence Filters
          </h1>
          <button className="font-bold text-[#001970]">Clear all filters</button>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {["Current Fiscal Year", "All Global Offices", "All Departments", "All Asset Classes"].map((value, index) => (
            <label className="grid gap-2 text-sm font-semibold" key={value}>
              {["Date Range", "Branch Location", "Department", "Asset Class"][index]}
              <select className="h-11 rounded border border-[#c7c4d8] bg-white px-4 font-normal">
                <option>{value}</option>
              </select>
            </label>
          ))}
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <article className="rounded border border-[#c7c4d8] bg-white p-7">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Asset Distribution</h2>
              <p>Live overview of asset allocation across classes</p>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="rounded bg-[#dbe8ff] px-3 py-1">● Technology</span>
              <span className="rounded bg-[#dbe8ff] px-3 py-1">● Infrastructure</span>
            </div>
          </div>
          <div className="flex h-72 items-end gap-6">
            {[55, 34, 72, 45, 78, 26].map((height, index) => (
              <div
                className={`w-full rounded-t ${index % 2 ? "bg-[#8195bd]" : "bg-[#c6cedd]"}`}
                key={height}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded bg-[#002174] p-7 text-white">
          <h2 className="text-2xl font-bold">Instant Export</h2>
          <p className="mt-5">Generated reports are encrypted and ready for institutional audit.</p>
          <div className="mt-8 space-y-4">
            {["Audit-Ready PDF", "Microsoft Excel (.xlsx)", "Comma Separated (.csv)"].map((item) => (
              <button className="flex h-14 w-full items-center gap-4 rounded border border-white/30 px-5 text-left font-bold" key={item}>
                <FileSpreadsheet className="h-5 w-5" />
                {item}
              </button>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reportCards.map(([title, body, meta, Icon]) => (
          <article className="rounded border border-[#c7c4d8] bg-white p-7" key={title as string}>
            <div className="mb-7 grid h-14 w-14 place-items-center rounded bg-[#e8f0ff]">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-4 min-h-20">{body}</p>
            <div className="mt-7 flex justify-between border-t border-[#c7c4d8] pt-5 text-sm">
              <span>{meta}</span>
              <strong className="text-[#001970]">VIEW REPORT</strong>
            </div>
          </article>
        ))}
      </div>

      <article className="overflow-hidden rounded border border-[#c7c4d8] bg-white">
        <h2 className="p-7 text-2xl font-bold">Recent Intelligence Logs</h2>
        <table className="w-full text-left">
          <thead className="bg-[#f0eef7] text-sm uppercase">
            <tr>
              {["Asset ID", "Class", "Location", "Status", "Valuation", "Risk Level"].map((head) => (
                <th className="px-7 py-4" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c7c4d8]">
            {logs.map((log) => (
              <tr key={log[0]}>
                <td className="px-7 py-5 font-bold text-[#001970]">{log[0]}</td>
                <td className="px-7 py-5">{log[1]}</td>
                <td className="px-7 py-5">{log[2]}</td>
                <td className="px-7 py-5"><span className={`rounded-full px-3 py-1 text-xs font-bold ${log[5]}`}>{log[3]}</span></td>
                <td className="px-7 py-5">{log[4]}</td>
                <td className="px-7 py-5"><div className="h-2 w-20 rounded-full bg-slate-200"><div className="h-2 w-14 rounded-full bg-emerald-500" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
