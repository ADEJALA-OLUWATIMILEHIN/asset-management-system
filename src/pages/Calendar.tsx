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
  Loader,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  createCalendarEvent,
  getCalendarEventsByMonth,
  getCalendarStats,
  type CalendarEvent,
  type EventType,
} from "@/api/CalendarApi/CalendarApi";

const filters = [
  { label: "Insurance Renewals", color: "bg-[#18b980]" },
  { label: "Maintenance Due", color: "bg-[#f39b0b]" },
  { label: "License Expiry", color: "bg-[#f04444]" },
  { label: "Audit Schedule", color: "bg-[#263f91]" },
];

const eventTypeMap: Record<EventType, "renewal" | "maintenance" | "expiry" | "audit"> = {
  INSURANCE_RENEWAL: "renewal",
  MAINTENANCE_DUE: "maintenance",
  LICENSE_EXPIRY: "expiry",
  AUDIT_SCHEDULE: "audit",
  LEASE_PAYMENT: "renewal",
};

const eventClass = {
  renewal: "border-[#18b980] bg-[#cbf5df] text-[#006c43]",
  maintenance: "border-[#f39b0b] bg-[#fff1c5] text-[#913900]",
  expiry: "border-[#f04444] bg-[#ffe0e0] text-[#c50000]",
  audit: "border-[#263f91] bg-[#dce4ff] text-[#001970]",
};

type CalendarDay = {
  label: string;
  state: "muted" | "today" | "";
  dateKey: string;
};

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const eventDateKey = (value: string) => {
  const dateOnly = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return dateOnly;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : toDateKey(date);
};

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days: CalendarDay[] = [];

  // Get the first day of the month
  const firstDay = date.getDay();

  // Add muted days from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayDate = new Date(year, month - 1, prevMonthDays - i);
    days.push({ label: String(prevMonthDays - i), state: "muted", dateKey: toDateKey(dayDate) });
  }

  // Add days of current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
    const dayDate = new Date(year, month, i);
    days.push({ label: String(i), state: isToday ? "today" : "", dateKey: toDateKey(dayDate) });
  }

  // Add muted days from next month to fill the grid
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const dayDate = new Date(year, month + 1, i);
    days.push({ label: String(i), state: "muted", dateKey: toDateKey(dayDate) });
  }

  return days;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState({ renewals: 0, maintenance: 0, expiry: 0, audit: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventColor, setEventColor] = useState<"green" | "yellow">("yellow");
  const [savingEvent, setSavingEvent] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes, statsRes] = await Promise.all([
        getCalendarEventsByMonth(currentDate.getFullYear(), currentDate.getMonth() + 1),
        getCalendarStats(),
      ]);

      if (eventsRes.data?.events) {
        setEvents(eventsRes.data.events);
      }

      if (statsRes.data) {
        setStats({
          renewals: statsRes.data.renewals || 0,
          maintenance: statsRes.data.maintenance || 0,
          expiry: statsRes.data.expiry || 0,
          audit: statsRes.data.audit || 0,
          critical: statsRes.data.critical || 0,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadData();
    });
  }, [loadData]);

  const handleAddEvent = async () => {
    if (!eventTitle.trim() || !eventDate) return;

    setSavingEvent(true);
    const result = await createCalendarEvent({
      title: eventTitle.trim(),
      eventDate,
      eventType: eventColor === "yellow" ? "MAINTENANCE_DUE" : "INSURANCE_RENEWAL",
      isCritical: eventColor === "yellow",
      isResolved: false,
      linkedAssetId: null,
      linkedDocId: null,
    });

    setSavingEvent(false);

    if (!result.data) {
      setError(result.message ?? "Failed to add calendar note");
      return;
    }

    setEventTitle("");
    setEventDate("");
    await loadData();
  };

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Group events by day
  const eventMap: Record<string, CalendarEvent[]> = {};
  events.forEach((event) => {
    const key = eventDateKey(event.eventDate);
    if (!key) return;
    if (!eventMap[key]) {
      eventMap[key] = [];
    }
    eventMap[key].push(event);
  });

  const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const statCards = [
    {
      label: "Renewals Complete",
      value: String(stats.renewals),
      note: "Active",
      icon: CheckCircle2,
      iconClass: "bg-[#d7f8e5] text-[#00964f]",
    },
    {
      label: "Pending Maintenance",
      value: String(stats.maintenance),
      note: "This month",
      icon: BriefcaseBusiness,
      iconClass: "bg-[#fff2bb] text-[#b36b00]",
    },
    {
      label: "Critical Alerts",
      value: String(stats.critical),
      note: "Immediate",
      icon: AlertOctagon,
      iconClass: "bg-[#ffdcdc] text-[#e00000]",
    },
  ];

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

        <article className="mt-8 rounded border border-[#c7c4d8] bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-[#001970]">
            <Plus className="h-4 w-4" />
            Add Date Note
          </h2>
          <div className="space-y-3">
            <input
              className="h-11 w-full rounded border border-[#c7c4d8] px-3 text-sm"
              placeholder="Words for this date"
              value={eventTitle}
              onChange={(event) => setEventTitle(event.target.value)}
            />
            <input
              className="h-11 w-full rounded border border-[#c7c4d8] px-3 text-sm"
              type="date"
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`h-10 rounded border text-sm font-bold ${
                  eventColor === "yellow" ? "border-[#f39b0b] bg-[#fff1c5] text-[#913900]" : "border-[#c7c4d8]"
                }`}
                onClick={() => setEventColor("yellow")}
                type="button"
              >
                Yellow Important
              </button>
              <button
                className={`h-10 rounded border text-sm font-bold ${
                  eventColor === "green" ? "border-[#18b980] bg-[#cbf5df] text-[#006c43]" : "border-[#c7c4d8]"
                }`}
                onClick={() => setEventColor("green")}
                type="button"
              >
                Green Normal
              </button>
            </div>
            <button
              className="h-11 w-full rounded bg-[#001970] font-bold text-white disabled:opacity-50"
              disabled={!eventTitle.trim() || !eventDate || savingEvent}
              onClick={handleAddEvent}
              type="button"
            >
              {savingEvent ? "Adding..." : "Add to Calendar"}
            </button>
          </div>
        </article>

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
            <h1 className="text-3xl font-bold">{monthName}</h1>
            <div className="flex rounded border border-[#c7c4d8] bg-white">
              <button 
                className="grid h-12 w-14 place-items-center border-r border-[#c7c4d8] hover:bg-[#f3f1f8]"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                className="h-12 border-r border-[#c7c4d8] px-5 hover:bg-[#f3f1f8]"
                onClick={handleToday}
              >
                Today
              </button>
              <button 
                className="grid h-12 w-14 place-items-center hover:bg-[#f3f1f8]"
                onClick={handleNextMonth}
              >
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
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-[#001970]" />
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center text-[#c00000]">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {days.map((calendarDay, index) => {
                const dayEvents = eventMap[calendarDay.dateKey] ?? [];
                return (
                  <div
                    className={`min-h-[145px] border-r border-b border-[#e0e4ec] p-3 last:border-r-0 ${calendarDay.state === "muted" ? "bg-[#eef2f7] text-[#8b9ab1]" : ""} ${calendarDay.state === "today" ? "bg-[#eeeeff]" : ""}`}
                    key={`${calendarDay.dateKey}-${index}`}
                  >
                    <div className="flex items-start justify-between">
                      <strong className="text-lg">{calendarDay.label}</strong>
                      {calendarDay.state === "today" && (
                        <span className="rounded bg-[#001970] px-2 py-0.5 text-xs text-white">Today</span>
                      )}
                    </div>
                    <div className="mt-5 space-y-2">
                      {dayEvents.map((event) => {
                        const eventType = eventTypeMap[event.eventType];
                        return (
                          <div
                            className={`truncate border-l-4 px-2 py-1 text-sm ${eventClass[eventType]}`}
                            key={event.id}
                            title={event.title}
                          >
                            {eventType === "maintenance" ? <Wrench className="mr-1 inline h-3 w-3" /> : null}
                            {eventType === "renewal" ? <ShieldCheck className="mr-1 inline h-3 w-3" /> : null}
                            {eventType === "audit" ? <ClipboardCheck className="mr-1 inline h-3 w-3" /> : null}
                            {eventType === "expiry" ? "! " : null}
                            {event.title}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
