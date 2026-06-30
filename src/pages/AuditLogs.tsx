import { Eye, Filter, ShieldCheck } from "lucide-react";

const metrics = [
  ["TOTAL LOGS (24H)", "12,842", "14% vs yesterday", "text-[#001970]"],
  ["FAILED LOGINS", "14", "Security Attention Needed", "text-[#c00000]"],
  ["CRITICAL CHANGES", "89", "Deletions & Config changes", "text-[#8a2a12]"],
  ["SYSTEM HEALTH", "99.9%", "Logging Services Active", "text-[#001970]"],
];

const rows = [
  ["RW", "Robert White", "Senior Adjuster", "CREATED", "Asset #AS-98042", "Oct 24, 2023 · 14:32:11", "192.168.1.144"],
  ["?", "Unknown User", "Auth Failure", "FAILED LOGIN", "Authentication Service", "Oct 24, 2023 · 14:30:05", "45.22.10.89"],
  ["SM", "Sarah Miller", "IT Operations", "UPDATED", "System Policy: Retention", "Oct 24, 2023 · 13:15:44", "10.0.0.52"],
  ["JL", "James Lee", "Inventory Manager", "DELETED", "Draft Document: Q3-Audit", "Oct 24, 2023 · 12:44:02", "192.168.1.12"],
  ["AD", "Admin Root", "System Admin", "LOGIN", "Security Console", "Oct 24, 2023 · 12:00:00", "127.0.0.1"],
];

const actionClass: Record<string, string> = {
  CREATED: "bg-emerald-100 text-emerald-700",
  "FAILED LOGIN": "bg-rose-100 text-rose-700",
  UPDATED: "bg-blue-100 text-blue-700",
  DELETED: "bg-orange-100 text-orange-900",
  LOGIN: "bg-slate-100 text-slate-700",
};

export default function AuditLogs() {
  return (
    <section className="mx-auto max-w-[1120px] space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#606475]">Security › Audit Logs</p>
          <h1 className="mt-4 text-4xl font-bold text-[#001970]">System Audit Trail</h1>
          <p className="mt-2 text-lg">Immutable record of all enterprise activities and system modifications.</p>
        </div>
        <div className="mt-14 flex rounded border border-[#c7c4d8] bg-white">
          <button className="px-6 py-3 text-lg">Real-time</button>
          <button className="bg-[#263f91] px-6 py-3 text-lg text-white">History</button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        {metrics.map(([label, value, note, color]) => (
          <article className="rounded border border-[#d8d8e6] bg-white p-5" key={label}>
            <p className="text-xs font-bold uppercase text-[#606475]">{label}</p>
            <strong className={`mt-3 block text-3xl ${color}`}>{value}</strong>
            <p className="mt-4 text-sm font-bold text-green-700">{note}</p>
          </article>
        ))}
      </div>

      <div className="rounded border border-[#c7c4d8] bg-white p-5">
        <div className="grid gap-5 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
          {["Last 24 Hours", "All Actions", "All Modules"].map((value) => (
            <select className="h-11 rounded border border-[#c7c4d8] bg-[#f7f5fd] px-4" key={value}>
              <option>{value}</option>
            </select>
          ))}
          <button className="inline-flex h-11 items-center justify-center gap-3 rounded bg-[#001970] px-8 text-white">
            <Filter className="h-4 w-4" />
            Apply Filters
          </button>
          <button className="underline">Clear</button>
        </div>
      </div>

      <article className="overflow-hidden rounded border border-[#c7c4d8] bg-white">
        <table className="w-full min-w-[980px] text-left text-lg">
          <thead className="bg-[#f0eef7] text-sm uppercase tracking-widest">
            <tr>
              {["User / Agent", "Action", "Target Module", "Date & Time", "IP Address", "Details"].map((head) => (
                <th className="px-7 py-5" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e2eb]">
            {rows.map((row) => (
              <tr key={`${row[1]}-${row[5]}`}>
                <td className="px-7 py-5">
                  <div className="flex items-center gap-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dbe8ff] text-xs font-bold text-[#001970]">{row[0]}</span>
                    <div>
                      <strong>{row[1]}</strong>
                      <p className="text-sm text-[#606475]">{row[2]}</p>
                    </div>
                  </div>
                </td>
                <td className="px-7 py-5"><span className={`rounded-full px-3 py-1 text-xs font-bold ${actionClass[row[3]]}`}>{row[3]}</span></td>
                <td className="px-7 py-5">{row[4]}</td>
                <td className="px-7 py-5">{row[5]}</td>
                <td className={`px-7 py-5 font-mono ${row[6].startsWith("45") ? "text-[#c00000]" : ""}`}>{row[6]}</td>
                <td className="px-7 py-5"><Eye className="h-5 w-5 text-[#606475]" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="flex items-center justify-between rounded border border-[#d8d8e6] bg-white p-8">
        <div>
          <h2 className="text-2xl font-bold text-[#001970]">Audit Integrity Protection</h2>
          <p className="mt-4 max-w-xl text-lg">
            Logs are cryptographically signed and stored in a multi-region immutable ledger.
          </p>
        </div>
        <div className="grid h-40 w-52 place-items-center rounded-xl bg-[#e5e3ea] shadow-inner">
          <ShieldCheck className="h-20 w-20 text-[#001970]" />
        </div>
      </article>
    </section>
  );
}
