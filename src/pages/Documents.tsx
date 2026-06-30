import { Cloud, Download, Eye, FileText, Folder, Grid2X2, List, MoreVertical, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const summaries: Array<[string, string, string, LucideIcon]> = [
  ["Total Documents", "1,284", "+12% from last month", Folder],
  ["Expiring Soon", "42", "Requires Review", FileText],
  ["Expired Docs", "07", "Critical Compliance Issue", FileText],
];

const documents = [
  ["Insurance_Policy_2024.pdf", "Size: 4.2 MB • Updated: 2d ago", "Mercedes Sprinter #42", "Vehicle Insurance", "Dec 12, 2024", "Active"],
  ["Service_Contract_Q3.docx", "Size: 1.8 MB • Updated: 1w ago", "Elevator System A-2", "Maintenance Agreement", "Oct 15, 2023", "Expiring Soon"],
  ["Regulatory_Compliance_V2.pdf", "Size: 12.5 MB • Updated: 1m ago", "Generator Unit H-10", "Compliance Cert", "Sep 30, 2023", "Expired"],
  ["Lease_Agreement_Bldg4.pdf", "Size: 2.1 MB • Updated: 3d ago", "Innovation Hub (West)", "Real Estate Lease", "Jan 01, 2026", "Active"],
  ["Purchase_Receipt_INV-990.pdf", "Size: 0.5 MB • Updated: 5d ago", "Workstation Setup 10", "Purchase Order", "N/A", "Permanent"],
];

const statusClass: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "Expiring Soon": "bg-orange-100 text-orange-900",
  Expired: "bg-rose-100 text-rose-700",
  Permanent: "bg-slate-100 text-slate-700",
};

export default function Documents() {
  return (
    <section className="mx-auto max-w-[1060px]">
      <div className="mb-7 flex items-start justify-between gap-5">
        <div>
          <p className="text-lg">Home › <strong className="text-[#001970]">Documents</strong></p>
          <h1 className="mt-2 text-lg">Document Repository</h1>
        </div>
        <button className="inline-flex h-12 items-center gap-3 rounded bg-[#001970] px-8 text-lg font-bold text-white">
          <Upload className="h-5 w-5" />
          Upload Document
        </button>
      </div>

      <div className="mb-7 grid gap-5 md:grid-cols-4">
        {summaries.map(([label, value, note, Icon]) => (
          <article className="rounded border border-[#c7c4d8] bg-white p-5" key={label as string}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg">{label}</p>
              <Icon className="h-6 w-6 text-[#8ba0ca]" />
            </div>
            <strong className="text-xl">{value}</strong>
            <p className={`mt-3 text-sm font-bold ${String(note).includes("Critical") ? "text-[#c00000]" : "text-emerald-700"}`}>
              {note}
            </p>
          </article>
        ))}
        <article className="rounded bg-[#263f91] p-5 text-white">
          <div className="mb-4 flex justify-between">
            <p className="text-[#9db4fb]">Storage Used</p>
            <Cloud className="h-6 w-6 text-[#9db4fb]" />
          </div>
          <strong className="text-lg text-[#9db4fb]">64.8 GB</strong>
          <div className="mt-5 h-2 rounded-full bg-white/25">
            <div className="h-2 w-[64%] rounded-full bg-white" />
          </div>
        </article>
      </div>

      <article className="overflow-hidden rounded border border-[#c7c4d8] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#c7c4d8] p-4">
          <div className="flex rounded bg-[#f0eef7] p-1 text-lg">
            {["All", "Expiring Soon", "Expired"].map((tab, index) => (
              <button className={`px-5 py-3 ${index === 0 ? "bg-white font-bold text-[#001970]" : ""}`} key={tab}>
                {tab}
              </button>
            ))}
          </div>
          <label className="relative">
            <input className="h-11 w-80 rounded border border-[#c7c4d8] px-12" placeholder="Search by name or asset..." />
          </label>
          <div className="flex gap-3">
            <button className="grid h-11 w-11 place-items-center rounded border border-[#c7c4d8] bg-[#f0eef7]">
              <List className="h-5 w-5" />
            </button>
            <button className="grid h-11 w-11 place-items-center rounded border border-[#c7c4d8]">
              <Grid2X2 className="h-5 w-5" />
            </button>
            <button className="inline-flex h-11 items-center gap-2 rounded border border-[#c7c4d8] px-5">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#f0eef7] text-sm uppercase">
            <tr>
              {["Document Name", "Linked Asset", "Type", "Expiry Date", "Status", "Action"].map((head) => (
                <th className="px-7 py-5" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c7c4d8]">
            {documents.map((doc) => (
              <tr key={doc[0]}>
                <td className="px-7 py-5">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded bg-[#eef5ff] text-[#0056ff]">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <strong>{doc[0]}</strong>
                      <p className="text-sm text-[#606475]">{doc[1]}</p>
                    </div>
                  </div>
                </td>
                <td className="px-7 py-5">{doc[2]}<p className="text-xs uppercase tracking-widest text-[#606475]">Fleet-Truck-004</p></td>
                <td className="px-7 py-5 text-[#334f78]">{doc[3]}</td>
                <td className={`px-7 py-5 ${doc[5] === "Expired" ? "font-bold italic text-[#c00000]" : ""}`}>{doc[4]}</td>
                <td className="px-7 py-5"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[doc[5]]}`}>{doc[5]}</span></td>
                <td className="px-7 py-5">
                  <div className="flex gap-4">
                    <Eye className="h-5 w-5" />
                    <Download className="h-5 w-5" />
                    <MoreVertical className="h-5 w-5" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-[#c7c4d8] px-7 py-6 text-lg">Showing <strong>1 - 5</strong> of <strong>1,284</strong> documents</p>
      </article>

      <aside className="fixed bottom-8 right-8 hidden w-80 rounded-2xl border border-[#c7c4d8] bg-white p-6 shadow-2xl xl:block">
        <div className="mb-6 flex justify-between text-lg">
          <span>Quick Preview</span>
          <span>×</span>
        </div>
        <div className="grid h-80 place-items-center rounded bg-gradient-to-br from-slate-200 to-slate-500 text-center">
          <div>
            <FileText className="mx-auto h-10 w-10" />
            <strong>Scanning Document...</strong>
          </div>
        </div>
        <p className="mt-5 text-xs font-bold uppercase text-[#606475]">Verified Content</p>
        <h2 className="text-lg">Insurance Policy #MER-9902</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="rounded bg-[#001970] px-4 py-3 text-white">Download</button>
          <button className="rounded border border-[#c7c4d8] px-4 py-3">Full View</button>
        </div>
      </aside>
    </section>
  );
}
