import { CalendarClock, CheckCircle2, ClipboardList, Filter, Plus, TriangleAlert } from "lucide-react";

const stats = [
  { label: "Pending", value: "14", note: "+12% vs LW", icon: ClipboardList, color: "#516479" },
  { label: "Scheduled", value: "28", note: "On Track", icon: CalendarClock, color: "#001970" },
  { label: "Completed", value: "156", note: "84% Rate", icon: CheckCircle2, color: "#8a2a12" },
  { label: "Overdue", value: "03", note: "Critical", icon: TriangleAlert, color: "#c00000" },
];

const rows = [
  ["Data Node - XT900", "Hardware Calibration", "TechLink Solutions", "$1,450.00", "Oct 12, 2023", "Apr 12, 2024", "SCHEDULED"],
  ["HVAC Main Unit - 02", "Preventive Inspection", "Global Climate Inc.", "$820.00", "Nov 05, 2023", "Feb 05, 2024", "OVERDUE"],
  ["GenSet Prime 500", "Oil & Filter Exchange", "Prime Power Svc.", "$2,100.00", "Jan 18, 2024", "Jul 18, 2024", "PENDING"],
  ["Precision T7920", "Software Patching", "Internal IT", "$0.00", "Feb 14, 2024", "Aug 14, 2024", "COMPLETED"],
];

const badge: Record<string, string> = {
  SCHEDULED: "bg-[#dce4ff] text-[#001970]",
  OVERDUE: "bg-[#ffd9d2] text-[#b00000]",
  PENDING: "bg-[#dbe5f0] text-[#516479]",
  COMPLETED: "bg-[#ffd9ca] text-[#8a2a12]",
};

export default function Maintenance() {
  return (
    <section className="mx-auto max-w-[1260px]">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Management</h1>
          <p className="mt-2 text-lg text-[#30313d]">
            Lifecycle monitoring and vendor coordination for enterprise assets.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="h-12 rounded border border-[#c7c4d8] bg-white px-8 font-bold text-[#001970]">
            Export
          </button>
          <button className="inline-flex h-12 items-center gap-3 rounded bg-[#001970] px-8 font-bold text-white">
            <Plus className="h-5 w-5" />
            Schedule Maintenance
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="rounded border border-[#c7c4d8] bg-white p-7" key={stat.label}>
              <div className="mb-6 flex items-start justify-between">
                <div className="grid h-14 w-14 place-items-center rounded bg-[#eceff5]">
                  <Icon className="h-7 w-7" style={{ color: stat.color }} />
                </div>
                <span className="rounded-full bg-[#e7e7f0] px-3 py-1 text-sm" style={{ color: stat.color }}>
                  {stat.note}
                </span>
              </div>
              <p className="text-lg">{stat.label}</p>
              <strong className="text-4xl" style={{ color: stat.label === "Overdue" ? "#c00000" : undefined }}>
                {stat.value}
              </strong>
              <div className="mt-6 h-1 rounded-full bg-[#e6e7ee]">
                <div className="h-1 w-[55%] rounded-full" style={{ background: stat.color }} />
              </div>
            </article>
          );
        })}
      </div>

      <article className="mt-10 overflow-hidden rounded border border-[#c7c4d8] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#c7c4d8] p-5">
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex h-11 items-center gap-3 bg-[#e8e6ee] px-6 font-bold">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <span className="text-[#c7c4d8]">|</span>
            {["All Assets", "Critical Infrastructure", "Logistics"].map((filter, index) => (
              <span
                className={`rounded-full px-4 py-2 text-sm ${index === 0 ? "bg-[#001970] text-white" : "bg-[#e8e6ee]"}`}
                key={filter}
              >
                {filter}
              </span>
            ))}
          </div>
          <p className="text-sm">
            Sort by: <strong className="text-[#001970]">Next Service Date⌄</strong>
          </p>
        </div>
        <table className="w-full min-w-[900px] text-left text-lg">
          <thead className="bg-[#f0eef7] text-sm uppercase tracking-widest text-[#30313d]">
            <tr>
              {["Asset", "Maintenance Type", "Vendor", "Cost", "Last Service", "Next Service", "Status", "Actions"].map(
                (head) => (
                  <th className="px-8 py-5" key={head}>{head}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c7c4d8]">
            {rows.map((row) => (
              <tr key={row[0]}>
                <td className="px-8 py-6 font-semibold">{row[0]}<p className="text-sm font-normal">SN: 44921-A</p></td>
                {row.slice(1, 6).map((cell) => (
                  <td className="px-8 py-6" key={cell}>{cell}</td>
                ))}
                <td className="px-8 py-6">
                  <span className={`rounded-full px-4 py-2 text-sm font-bold ${badge[row[6]]}`}>{row[6]}</span>
                </td>
                <td className="px-8 py-6 font-bold text-[#001970]">Update</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
