import {
  AlertOctagon,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";

const filters = [
  { label: "Insurance Renewals", color: "bg-[#18b980]" },
  { label: "Maintenance Due", color: "bg-[#f39b0b]" },
  { label: "License Expiry", color: "bg-[#f04444]" },
  { label: "Audit Schedule", color: "bg-[#263f91]" },
];

const days = [
  ["29", "muted"],
  ["30", "muted"],
  ["1", ""],
  ["2", ""],
  ["3", ""],
  ["4", ""],
  ["5", ""],
  ["6", ""],
  ["7", ""],
  ["8", "today"],
  ["9", ""],
  ["10", ""],
  ["11", ""],
  ["12", ""],
  ["13", ""],
  ["14", ""],
  ["15", ""],
  ["16", ""],
  ["17", ""],
  ["18", ""],
  ["19", ""],
  ["20", ""],
  ["21", ""],
  ["22", ""],
  ["23", ""],
  ["24", ""],
  ["25", ""],
  ["26", ""],
  ["27", ""],
  ["28", ""],
  ["29", ""],
  ["30", ""],
  ["31", ""],
  ["1", "muted"],
  ["2", "muted"],
];

const eventMap: Record<string, { text: string; type: "renewal" | "maintenance" | "expiry" | "audit" }[]> = {
  "1": [{ text: "Ins. Renewal #492", type: "renewal" }],
  "2": [{ text: "Crane Service A", type: "maintenance" }],
  "4": [{ text: "License Exp. F-02", type: "expiry" }],
  "8": [
    { text: "Site Audit - North", type: "audit" },
    { text: "HVAC Filter Swap", type: "maintenance" },
  ],
  "10": [{ text: "Volvo FH-16 Ins.", type: "renewal" }],
  "15": [{ text: "Fleet Maintenance", type: "maintenance" }],
  "18": [{ text: "R.W. Certificate", type: "renewal" }],
  "23": [{ text: "Generator Service", type: "maintenance" }],
  "30": [{ text: "Lease Payment Due", type: "renewal" }],
};

const eventClass = {
  renewal: "border-[#18b980] bg-[#cbf5df] text-[#006c43]",
  maintenance: "border-[#f39b0b] bg-[#fff1c5] text-[#913900]",
  expiry: "border-[#f04444] bg-[#ffe0e0] text-[#c50000]",
  audit: "border-[#18b980] bg-[#cbf5df] text-[#006c43]",
};

const statCards = [
  {
    label: "Renewals Complete",
    value: "124",
    note: "+12%",
    icon: CheckCircle2,
    iconClass: "bg-[#d7f8e5] text-[#00964f]",
  },
  {
    label: "Pending Maintenance",
    value: "18",
    note: "this week",
    icon: BriefcaseBusiness,
    iconClass: "bg-[#fff2bb] text-[#b36b00]",
  },
  {
    label: "Overdue Compliance",
    value: "3",
    note: "Immediate",
    icon: AlertOctagon,
    iconClass: "bg-[#ffdcdc] text-[#e00000]",
  },
];

export default function Calendar() {
  return (
    <section className="-mx-5 -my-8 grid min-h-[calc(100vh-72px)] grid-cols-1 lg:-mx-10 lg:grid-cols-[330px_1fr]">
      <aside className="border-r border-[#c7c4d8] px-8 py-9">
        <h1 className="mb-6 text-2xl font-bold">Event Filtering</h1>
        <div className="space-y-5">
          {filters.map((filter) => (
            <label className="flex items-center gap-4 text-lg" key={filter.label}>
              <input className="h-5 w-5 accent-[#001970]" type="checkbox" defaultChecked />
              <span className="flex-1">{filter.label}</span>
              <span className={`h-4 w-4 rounded-full ${filter.color}`} />
            </label>
          ))}
        </div>

        <article className="mt-10 rounded border border-[#b7bdd4] bg-[#e5e8f7] p-6">
          <h2 className="flex items-center gap-3 font-bold text-[#001970]">
            <SlidersHorizontal className="h-4 w-4" />
            Critical Alerts
          </h2>
          <div className="mt-5 space-y-5 text-sm text-[#474957]">
            <p className="flex gap-3">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#d00000]" />
              Fleet-04 Insurance expired 2 days ago.
            </p>
            <p className="flex gap-3">
              <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#d00000]" />
              H-Lift Service overdue (150 hrs).
            </p>
          </div>
          <button className="mt-5 w-full text-center font-bold text-[#001970]">Resolve All -&gt;</button>
        </article>

        <article className="mt-32 min-h-40 rounded-lg border border-[#c7c4d8] bg-[linear-gradient(160deg,rgba(49,51,58,0.45),rgba(255,255,255,0.9)),linear-gradient(45deg,#90939d,#f8f8fb)] p-5">
          <p className="mt-24 text-xs font-bold uppercase tracking-[0.18em]">System Overview 2024</p>
        </article>
      </aside>

      <div className="px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <h1 className="text-3xl font-bold">October 2024</h1>
            <div className="flex rounded border border-[#c7c4d8] bg-white">
              <button className="grid h-12 w-14 place-items-center border-r border-[#c7c4d8]">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="h-12 border-r border-[#c7c4d8] px-5">Today</button>
              <button className="grid h-12 w-14 place-items-center">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex rounded bg-[#e6e3ee] p-1">
            {["Month", "Week", "Day"].map((view, index) => (
              <button
                className={`h-10 min-w-20 rounded px-4 text-lg ${index === 0 ? "bg-white" : "text-[#30313d]"}`}
                key={view}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <article className="overflow-hidden rounded border border-[#c7c4d8] bg-white">
          <div className="grid grid-cols-7 border-b border-[#c7c4d8] bg-[#fbf9ff] text-center text-sm font-bold uppercase tracking-[0.18em] text-[#2c2d36]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div className="border-r border-[#c7c4d8] py-4 last:border-r-0" key={day}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map(([day, state], index) => {
              const events = eventMap[day] ?? [];
              return (
                <div
                  className={`min-h-[145px] border-r border-b border-[#e0e4ec] p-3 last:border-r-0 ${state === "muted" ? "bg-[#eef2f7] text-[#8b9ab1]" : ""} ${state === "today" ? "bg-[#eeeeff]" : ""}`}
                  key={`${day}-${index}`}
                >
                  <div className="flex items-start justify-between">
                    <strong className="text-lg">{day}</strong>
                    {state === "today" && (
                      <span className="rounded bg-[#001970] px-2 py-0.5 text-xs text-white">Today</span>
                    )}
                  </div>
                  <div className="mt-5 space-y-2">
                    {events.map((event) => (
                      <div
                        className={`truncate border-l-4 px-2 py-1 text-sm ${eventClass[event.type]}`}
                        key={event.text}
                      >
                        {event.type === "maintenance" ? <Wrench className="mr-1 inline h-3 w-3" /> : null}
                        {event.type === "renewal" ? <ShieldCheck className="mr-1 inline h-3 w-3" /> : null}
                        {event.type === "audit" ? <ClipboardCheck className="mr-1 inline h-3 w-3" /> : null}
                        {event.type === "expiry" ? "! " : null}
                        {event.text}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="flex items-center gap-5 rounded border border-[#c7c4d8] bg-white p-6" key={card.label}>
                <div className={`grid h-16 w-16 place-items-center rounded ${card.iconClass}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="max-w-[150px] text-base leading-5">{card.label}</p>
                  <strong className="text-3xl">{card.value}</strong>
                  <span className={`ml-2 ${card.note === "Immediate" ? "text-[#e00000]" : "text-[#00964f]"}`}>
                    {card.note}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
