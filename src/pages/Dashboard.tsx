const metrics = [
  { label: "Total Assets", value: "1,248", trend: "+8.2%" },
  { label: "In Maintenance", value: "36", trend: "-3.1%" },
  { label: "Expiring Docs", value: "18", trend: "+4 due" },
];

const records = [
  { asset: "Dell Latitude 7440", owner: "Finance", status: "Active", date: "Jun 18, 2026" },
  { asset: "Toyota Hilux", owner: "Operations", status: "Maintenance", date: "Jun 22, 2026" },
  { asset: "HP LaserJet MFP", owner: "Admin", status: "Review", date: "Jul 02, 2026" },
];

const statusClass: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Maintenance: "bg-amber-50 text-amber-700",
  Review: "bg-rose-50 text-rose-700",
};

const Dashboard = () => {
  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article
            className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm"
            key={metric.label}
          >
            <p className="text-sm font-medium text-[#464555]">{metric.label}</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <strong className="text-3xl font-semibold text-[#0b1c30]">{metric.value}</strong>
              <span className="rounded-full bg-[#e2dfff] px-3 py-1 text-xs font-semibold text-[#3525cd]">
                {metric.trend}
              </span>
            </div>
          </article>
        ))}
      </div>

      <article className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="border-b border-[#e2e8f0] px-6 py-5">
          <h3 className="text-xl font-semibold text-[#0b1c30]">Recent Asset Activity</h3>
          <p className="mt-1 text-sm text-[#464555]">Latest records needing review or action.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-[#f1f5f9] text-xs font-semibold uppercase text-[#464555]">
              <tr>
                <th className="px-6 py-3">Asset</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {records.map((record) => (
                <tr className="hover:bg-[#f8f9ff]" key={record.asset}>
                  <td className="px-6 py-4 font-semibold text-[#0b1c30]">{record.asset}</td>
                  <td className="px-6 py-4 text-[#464555]">{record.owner}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-[#0b1c30]">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default Dashboard;
