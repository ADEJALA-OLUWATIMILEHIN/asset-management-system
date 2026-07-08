import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, FileText, Loader2, Package, Wrench } from "lucide-react";
import { Getasset, type AssetApiAsset } from "@/api/AssetApi/Getasset";
import { getDocuments, type DocumentRecord } from "@/api/DocumentApi/Document";
import { getMaintenanceRecords, type MaintenanceRecord } from "@/api/MaintenanceApi/MaintenanceApi";

const statusClass: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  SCHEDULED: "bg-blue-50 text-blue-800",
  PENDING: "bg-slate-100 text-slate-700",
  OVERDUE: "bg-rose-50 text-rose-700",
  EXPIRING_SOON: "bg-amber-50 text-amber-700",
  EXPIRED: "bg-rose-50 text-rose-700",
};

const formatDate = (value?: string | null) => {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const Dashboard = () => {
  const [assets, setAssets] = useState<AssetApiAsset[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [assetRes, docsRes, maintenanceRes] = await Promise.all([
          Getasset(),
          getDocuments().catch(() => []),
          getMaintenanceRecords(),
        ]);

        if (!mounted) return;

        if (assetRes.data?.assets) setAssets(assetRes.data.assets);
        if (Array.isArray(docsRes)) setDocuments(docsRes);
        if (maintenanceRes.data?.maintenanceRecords) setMaintenance(maintenanceRes.data.maintenanceRecords);
        if (!assetRes.data) setError(assetRes.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const inMaintenance = maintenance.filter((item) => item.status !== "COMPLETED").length;
    const expiringDocs = documents.filter((doc) => doc.status === "EXPIRING_SOON" || doc.status === "EXPIRED").length;

    return [
      { label: "Total Assets", value: assets.length, Icon: Package, tone: "bg-[#e8edf8] text-[#001970]" },
      { label: "In Maintenance", value: inMaintenance, Icon: Wrench, tone: "bg-[#fff1c5] text-[#913900]" },
      { label: "Expiring Docs", value: expiringDocs, Icon: FileText, tone: "bg-[#ffe0e0] text-[#c50000]" },
    ];
  }, [assets, documents, maintenance]);

  const recentActivity = useMemo(() => {
    const assetRows = assets.slice(0, 5).map((asset) => ({
      id: `asset-${asset.id}`,
      assetId: asset.id,
      asset: asset.name,
      department: asset.department?.name ?? "Unassigned",
      status: asset.status,
      date: asset.updatedAt ?? asset.createdAt,
      type: "Asset",
    }));

    const maintenanceRows = maintenance.slice(0, 5).map((record) => ({
      id: `maintenance-${record.id}`,
      assetId: record.assetId,
      asset: record.asset?.name ?? `Asset ${record.assetId}`,
      department: record.maintenanceType,
      status: record.status,
      date: record.nextServiceDate ?? record.updatedAt ?? record.createdAt,
      type: "Maintenance",
    }));

    const documentRows = documents.slice(0, 5).map((doc) => ({
      id: `document-${doc.id}`,
      assetId: doc.linkedAssetId,
      asset: doc.asset?.name ?? doc.name,
      department: doc.docType.replaceAll("_", " "),
      status: doc.status,
      date: doc.updatedAt ?? doc.createdAt,
      type: "Document",
    }));

    return [...assetRows, ...maintenanceRows, ...documentRows]
      .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
      .slice(0, 8);
  }, [assets, documents, maintenance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-[#001970]">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="grid gap-6">
      {error && (
        <div className="flex items-center gap-3 rounded border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map(({ Icon, ...metric }) => (
          <article className="rounded-lg border border-[#c7c4d8] bg-white p-6 shadow-sm" key={metric.label}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-[#464555]">{metric.label}</p>
              <span className={`grid h-11 w-11 place-items-center rounded ${metric.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <strong className="mt-4 block text-3xl font-semibold text-[#0b1c30]">
              {metric.value.toLocaleString()}
            </strong>
          </article>
        ))}
      </div>

      <article className="overflow-hidden rounded-lg border border-[#c7c4d8] bg-white shadow-sm">
        <div className="border-b border-[#c7c4d8] px-6 py-5">
          <h3 className="text-xl font-semibold text-[#0b1c30]">Recent Asset Activity</h3>
          <p className="mt-1 text-sm text-[#464555]">Latest assets, maintenance, and document changes.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f1f5f9] text-xs font-semibold uppercase text-[#464555]">
              <tr>
                <th className="px-6 py-3">Asset</th>
                <th className="px-6 py-3">Activity</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {recentActivity.map((record) => (
                <tr className="hover:bg-[#f8f9ff]" key={record.id}>
                  <td className="px-6 py-4 font-semibold text-[#0b1c30]">
                    {record.assetId ? <Link to={`/assets/${record.assetId}`}>{record.asset}</Link> : record.asset}
                  </td>
                  <td className="px-6 py-4 text-[#464555]">{record.type} - {record.department}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[record.status] ?? "bg-slate-100 text-slate-700"}`}>
                      {record.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-[#0b1c30]">{formatDate(record.date)}</td>
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
