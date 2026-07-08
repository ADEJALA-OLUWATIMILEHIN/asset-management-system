import {
  BadgeDollarSign,
  CalendarDays,
  Camera,
  CheckCircle2,
  CloudUpload,
  Image,
  Info,
  Lightbulb,
  MapPin,
  Save,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createAsset, getAssetById, updateAsset } from "@/api/AssetApi/Getasset";
import type { AssetCategory, AssetCreatePayload, AssetStatus } from "@/api/AssetApi/Getasset";
import { getDepartments, getUsers, type ApiDepartment, type ApiUser } from "@/api/Getusers";
import { getStaff, type StaffRecord } from "@/api/StaffApi";

const inputClass =
  "h-12 w-full rounded border border-[#c7c4d8] bg-white px-5 text-base text-[#11111a] outline-none placeholder:text-[#737789] focus:ring-2 focus:ring-[#001970]";

const categories: Array<{ value: AssetCategory; label: string }> = [
  { value: "VEHICLES", label: "Vehicles" },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "IT_INFRASTRUCTURE", label: "IT Infrastructure" },
  { value: "HEAVY_MACHINERY", label: "Heavy Machinery" },
  { value: "CORPORATE_FLEET", label: "Corporate Fleet" },
];

type AssetFormState = {
  name: string;
  description: string;
  category: AssetCategory | "";
  status: AssetStatus;
  assetCode: string;
  serialNumber: string;
  manufacturer: string;
  modelYear: string;
  color: string;
  purchaseDate: string;
  purchasePrice: string;
  warrantyExpiry: string;
  vendorId: string;
  departmentId: string;
  location: string;
  custodianId: string;
  condition: string;
  conditionScore: string;
  valuation: string;
  riskLevel: string;
};

const conditions = ["EXCELLENT", "GOOD", "FAIR", "POOR"];
const riskLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const statuses: Array<{ value: string; label: string }> = [
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRED", label: "Expired" },
  { value: "EXPIRING_SOON", label: "Expiring Soon" },
  { value: "DECOMMISSIONED", label: "Decommissioned" },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
];

const initialForm: AssetFormState = {
  name: "",
  description: "",
  category: "",
  status: "ACTIVE",
  assetCode: "",
  serialNumber: "",
  manufacturer: "",
  modelYear: "",
  color: "",
  purchaseDate: "",
  purchasePrice: "",
  warrantyExpiry: "",
  vendorId: "",
  departmentId: "",
  location: "",
  custodianId: "",
  condition: "",
  conditionScore: "",
  valuation: "",
  riskLevel: "",
};

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="border-b border-[#d8d6e3] pb-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-[#11111a]">
        <Icon className="h-6 w-6 text-[#001970]" />
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#202333]">
        {label} {required && <span className="text-[#c00000]">*</span>}
      </span>
      {children}
    </label>
  );
}

const parseOptionalAmount = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const parseOptionalId = (value: string) => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
};

export default function NewAsset() {
  const navigate = useNavigate();
  const { assetId } = useParams<{ assetId?: string }>();
  const isEditing = Boolean(assetId);
  const [form, setForm] = useState(initialForm);
  const [departments, setDepartments] = useState<ApiDepartment[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    Promise.all([getDepartments(), getUsers(), getStaff()]).then(([departmentResult, userResult, staffResult]) => {
      if (!mounted) return;
      setDepartments(departmentResult.data?.departments ?? []);
      setUsers(userResult.data?.users ?? []);
      setStaff(staffResult.data?.staff ?? []);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!assetId) return;

    let mounted = true;

    getAssetById(assetId).then((result) => {
      if (!mounted) return;

      if (!result.data?.asset) {
        setError(result.message);
        return;
      }

      const asset = result.data.asset;
      setForm({
        ...initialForm,
        name: asset.name ?? "",
        category: asset.category ?? "",
        status: asset.status ?? "ACTIVE",
        assetCode: asset.assetCode ?? "",
        serialNumber: asset.serialNumber ?? "",
        manufacturer: asset.manufacturer ?? "",
        modelYear: asset.modelYear ? String(asset.modelYear) : "",
        color: asset.color ?? "",
        purchaseDate: asset.purchaseDate ? asset.purchaseDate.slice(0, 10) : "",
        purchasePrice: asset.purchasePrice ? String(asset.purchasePrice) : "",
        warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.slice(0, 10) : "",
        vendorId: asset.vendorId ? String(asset.vendorId) : "",
        departmentId: asset.departmentId ? String(asset.departmentId) : "",
        location: asset.location ?? "",
        custodianId: asset.custodianId ? String(asset.custodianId) : "",
        condition: asset.condition ?? "",
        conditionScore: asset.conditionScore ? String(asset.conditionScore) : "",
        valuation: asset.valuation ? String(asset.valuation) : "",
        riskLevel: asset.riskLevel ?? "",
      });
    });

    return () => {
      mounted = false;
    };
  }, [assetId]);

  const updateField =
    (field: keyof AssetFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.assetCode.trim() || !form.category) {
      setError("Asset name, asset code, and asset class are required.");
      return;
    }

    const purchasePrice = parseOptionalAmount(form.purchasePrice);
    const vendorId = parseOptionalId(form.vendorId);
    const departmentId = parseOptionalId(form.departmentId);
    const custodianId = parseOptionalId(form.custodianId);
    const modelYear = parseOptionalAmount(form.modelYear);
    const conditionScore = parseOptionalAmount(form.conditionScore);
    const valuation = parseOptionalAmount(form.valuation);

    if (Number.isNaN(purchasePrice)) {
      setError("Purchase value must be a valid number.");
      return;
    }

    if (Number.isNaN(vendorId) || Number.isNaN(departmentId) || Number.isNaN(custodianId)) {
      setError("Vendor, department, and custodian selections must be valid.");
      return;
    }

    if (Number.isNaN(modelYear) || Number.isNaN(conditionScore) || Number.isNaN(valuation)) {
      setError("Model year, condition score, and valuation must be valid numbers if provided.");
      return;
    }

    const payload: AssetCreatePayload = {
      assetCode: form.assetCode.trim(),
      name: form.name.trim(),
      category: form.category,
      status: form.status,
      serialNumber: form.serialNumber.trim() || null,
      manufacturer: form.manufacturer.trim() || null,
      modelYear: modelYear,
      color: form.color.trim() || null,
      purchaseDate: form.purchaseDate || null,
      purchasePrice,
      warrantyExpiry: form.warrantyExpiry || null,
      vendorId,
      location: form.location.trim() || null,
      departmentId,
      custodianId,
      condition: (form.condition || null) as AssetCreatePayload["condition"],
      conditionScore: conditionScore,
      valuation: valuation,
      riskLevel: (form.riskLevel || null) as AssetCreatePayload["riskLevel"],
    };

    setIsSubmitting(true);

    try {
      const result = isEditing && assetId
        ? await updateAsset(assetId, payload)
        : await createAsset(payload);

      if (!result.data) {
        setError(result.message);
        return;
      }

      setSuccess(isEditing ? "Asset updated successfully." : "Asset saved successfully.");
      navigate(isEditing && assetId ? `/assets/${assetId}` : "/assets");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mx-auto max-w-[1240px] pb-28" onSubmit={handleSubmit}>
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-6 flex items-center gap-3 text-sm font-medium text-[#606475]">
            <Link to="/assets">Assets</Link>
            <span>&gt;</span>
            <strong className="text-[#001970]">{isEditing ? "Edit Asset" : "Add New Asset"}</strong>
          </div>
          <h1 className="text-4xl font-extrabold tracking-normal text-[#11111a]">
            {isEditing ? "Edit Asset" : "Register New Asset"}
          </h1>
          <p className="mt-3 max-w-[830px] text-xl leading-7 text-[#30313d]">
            {isEditing
              ? "Update the asset details, assignment, and lifecycle tracking fields."
              : "Enter the details of the asset to register it in the system database for lifecycle tracking."}
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#c9f5df] px-4 py-2 text-sm font-bold text-[#007042]">
          <CheckCircle2 className="h-4 w-4" />
          Ready to save
        </span>
      </div>

      {(error || success) && (
        <div
          className={`mb-5 rounded border px-5 py-4 ${
            error
              ? "border-[#f4b4b4] bg-[#fff5f5] text-[#9a1111]"
              : "border-[#b8e7c8] bg-[#f1fff6] text-[#08613a]"
          }`}
          role="status"
        >
          {error || success}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_385px]">
        <div className="space-y-5">
          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <SectionHeader icon={Info} title="General Information" />

            <div className="mt-9 space-y-8">
              <Field label="Asset Name" required>
                <input
                  className={inputClass}
                  onChange={updateField("name")}
                  placeholder="e.g. Dell Latitude 5420 - HQ-01"
                  required
                  value={form.name}
                />
              </Field>

              <Field label="Description">
                <textarea
                  className="min-h-24 w-full resize-none rounded border border-[#c7c4d8] bg-white px-5 py-4 text-base text-[#11111a] outline-none placeholder:text-[#737789] focus:ring-2 focus:ring-[#001970]"
                  onChange={updateField("description")}
                  placeholder="Provide detailed technical specifications or usage notes..."
                  value={form.description}
                />
              </Field>

              <div className="grid gap-8 md:grid-cols-2">
                <Field label="Asset Class" required>
                  <select
                    className={inputClass}
                    onChange={updateField("category")}
                    required
                    value={form.category}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    className={inputClass}
                    onChange={updateField("status")}
                    value={form.status}
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <SectionHeader icon={BadgeDollarSign} title="Purchase & Identification" />

            <div className="mt-9 grid gap-8 md:grid-cols-2">
              <Field label="Asset Code" required>
                <input
                  className={`${inputClass} border-dashed bg-[#fbfbfe] font-mono`}
                  onChange={updateField("assetCode")}
                  placeholder="AST-2023-XXXXX"
                  required
                  value={form.assetCode}
                />
              </Field>
              <Field label="Serial Number">
                <input
                  className={inputClass}
                  onChange={updateField("serialNumber")}
                  placeholder="SN/UUID/IMEI"
                  value={form.serialNumber}
                />
              </Field>
              <Field label="Purchase Date">
                <div className="relative">
                  <input
                    className={inputClass}
                    onChange={updateField("purchaseDate")}
                    type="date"
                    value={form.purchaseDate}
                  />
                  <CalendarDays className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#11111a]" />
                </div>
              </Field>
              <Field label="Purchase Value (NGN)">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-[#737789]">₦</span>
                  <input
                    className={`${inputClass} pl-10`}
                    min="0"
                    onChange={updateField("purchasePrice")}
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={form.purchasePrice}
                  />
                </div>
              </Field>
            </div>
          </article>

          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <SectionHeader icon={BadgeDollarSign} title="Manufacturer & Specifications" />

            <div className="mt-9 grid gap-8 md:grid-cols-2">
              <Field label="Manufacturer">
                <input
                  className={inputClass}
                  onChange={updateField("manufacturer")}
                  placeholder="e.g. Dell, HP, Toyota"
                  value={form.manufacturer}
                />
              </Field>
              <Field label="Model Year">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  onChange={updateField("modelYear")}
                  placeholder="e.g. 2023"
                  value={form.modelYear}
                />
              </Field>
              <Field label="Color">
                <input
                  className={inputClass}
                  onChange={updateField("color")}
                  placeholder="e.g. Silver, Black"
                  value={form.color}
                />
              </Field>
              <Field label="Warranty Expiry">
                <div className="relative">
                  <input
                    className={inputClass}
                    onChange={updateField("warrantyExpiry")}
                    type="date"
                    value={form.warrantyExpiry}
                  />
                  <CalendarDays className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#11111a]" />
                </div>
              </Field>
            </div>
          </article>

          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <SectionHeader icon={CheckCircle2} title="Condition & Risk Assessment" />

            <div className="mt-9 grid gap-8 md:grid-cols-2">
              <Field label="Condition">
                <select
                  className={inputClass}
                  onChange={updateField("condition")}
                  value={form.condition}
                >
                  <option value="">Select condition</option>
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Condition Score (0-100)">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  onChange={updateField("conditionScore")}
                  placeholder="0-100"
                  type="number"
                  min="0"
                  max="100"
                  value={form.conditionScore}
                />
              </Field>
              <Field label="Risk Level">
                <select
                  className={inputClass}
                  onChange={updateField("riskLevel")}
                  value={form.riskLevel}
                >
                  <option value="">Select risk level</option>
                  {riskLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Valuation (NGN)">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-[#737789]">₦</span>
                  <input
                    className={`${inputClass} pl-10`}
                    inputMode="decimal"
                    min="0"
                    onChange={updateField("valuation")}
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                    value={form.valuation}
                  />
                </div>
              </Field>
            </div>
          </article>

          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <SectionHeader icon={MapPin} title="Assignment & Location" />

            <div className="mt-9 grid gap-7 md:grid-cols-2">
              <Field label="Department">
                <select className={inputClass} onChange={updateField("departmentId")} value={form.departmentId}>
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  onChange={updateField("location")}
                  placeholder="e.g. London HQ"
                  value={form.location}
                />
              </Field>
              <Field label="Custodian">
                <select className={inputClass} onChange={updateField("custodianId")} value={form.custodianId}>
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Vendor / Staff">
                <select className={inputClass} onChange={updateField("vendorId")} value={form.vendorId}>
                  <option value="">Select vendor or staff</option>
                  {staff.map((staffMember) => (
                    <option key={staffMember.id} value={staffMember.id}>
                      {staffMember.fullName} - {staffMember.email}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </article>
        </div>

        <aside className="space-y-5">
          <article className="rounded-lg border border-[#c7c4d8] bg-white p-8">
            <SectionHeader icon={Image} title="Asset Media" />

            <button
              className="mt-8 grid min-h-60 w-full place-items-center rounded-lg border-2 border-dashed border-[#c7c4d8] bg-[#f3f1f8] px-6 text-center"
              type="button"
            >
              <span>
                <CloudUpload className="mx-auto h-10 w-10 text-[#606475]" />
                <span className="mt-5 block text-lg">
                  <strong>Click to upload</strong> or drag and drop
                </span>
                <span className="mt-3 block text-sm uppercase text-[#606475]">
                  SVG, PNG, JPG or HEIC (MAX. 10MB)
                </span>
              </span>
            </button>

            <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#202333]">
              Preview Gallery
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="relative h-36 overflow-hidden rounded border border-[#c7c4d8] bg-[#0b1720]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_30%,rgba(72,180,210,0.55),transparent_24%),linear-gradient(135deg,#0e2229,#111827_52%,#42566d)]" />
                <div className="absolute bottom-7 left-6 h-12 w-20 skew-x-[-8deg] rounded border border-cyan-200/60 bg-cyan-100/20 shadow-[0_0_35px_rgba(125,211,252,0.5)]" />
                <div className="absolute bottom-5 left-4 h-2 w-28 rounded-full bg-cyan-100/50" />
                <div className="absolute right-5 top-8 h-12 w-16 rounded border border-cyan-100/40 bg-cyan-100/10" />
              </div>
              <button
                className="grid h-36 place-items-center rounded border border-dashed border-[#c7c4d8] bg-[#e7e5ec] text-[#606475]"
                type="button"
              >
                <Camera className="h-6 w-6" />
              </button>
            </div>
          </article>

          <article className="overflow-hidden rounded-lg bg-[#263f91] text-white">
            <div className="p-8">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-[#aebfff]">
                <Lightbulb className="h-6 w-6" />
                Lifecycle Tip
              </h2>
              <p className="mt-5 text-base leading-7 text-[#c6d0ff]">
                Assigning an asset code and purchase value immediately allows the system to begin calculating
                depreciation and maintenance windows.
              </p>
            </div>
            <div className="h-24 bg-[#001970]/35" />
          </article>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#c7c4d8] bg-white px-5 py-5 shadow-[0_-8px_24px_rgba(17,17,26,0.08)] md:left-[290px] sm:px-8">
        <div className="mx-auto flex max-w-[1240px] items-center justify-end gap-8">
          <Link className="font-bold text-[#202333]" to="/assets">
            Cancel
          </Link>
          <button
            className="inline-flex h-12 items-center gap-3 rounded bg-[#001970] px-8 font-bold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : isEditing ? "Update Asset" : "Save Asset"}
          </button>
        </div>
      </div>
    </form>
  );
}
