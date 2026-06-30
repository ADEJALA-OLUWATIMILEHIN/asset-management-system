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
import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAsset } from "@/api/AssetApi/Getasset";
import type { AssetCategory, AssetCreatePayload } from "@/api/AssetApi/Getasset";

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
  assetCode: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: string;
  departmentId: string;
  location: string;
  custodianId: string;
};

const initialForm: AssetFormState = {
  name: "",
  description: "",
  category: "",
  assetCode: "",
  serialNumber: "",
  purchaseDate: "",
  purchasePrice: "",
  departmentId: "",
  location: "",
  custodianId: "",
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
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const departmentId = parseOptionalId(form.departmentId);
    const custodianId = parseOptionalId(form.custodianId);

    if (Number.isNaN(purchasePrice)) {
      setError("Purchase value must be a valid number.");
      return;
    }

    if (Number.isNaN(departmentId) || Number.isNaN(custodianId)) {
      setError("Department ID and custodian ID must be positive whole numbers.");
      return;
    }

    const payload: AssetCreatePayload = {
      assetCode: form.assetCode.trim(),
      name: form.name.trim(),
      category: form.category,
      status: "ACTIVE",
      serialNumber: form.serialNumber.trim() || null,
      purchaseDate: form.purchaseDate || null,
      purchasePrice,
      location: form.location.trim() || null,
      departmentId,
      custodianId,
    };

    setIsSubmitting(true);

    try {
      const result = await createAsset(payload);

      if (!result.data) {
        setError(result.message);
        return;
      }

      setSuccess("Asset saved successfully.");
      navigate("/assets");
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
            <strong className="text-[#001970]">Add New Asset</strong>
          </div>
          <h1 className="text-4xl font-extrabold tracking-normal text-[#11111a]">
            Register New Asset
          </h1>
          <p className="mt-3 max-w-[830px] text-xl leading-7 text-[#30313d]">
            Enter the details of the asset to register it in the system database for lifecycle tracking.
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
                  <div className="flex h-12 items-center gap-3 rounded border border-[#c7c4d8] bg-[#f3f1f8] px-5 text-lg">
                    <span className="h-3 w-3 rounded-full bg-[#10b981]" />
                    Active (Default)
                  </div>
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
              <Field label="Purchase Value (USD)">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-[#737789]">$</span>
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
            <SectionHeader icon={MapPin} title="Assignment & Location" />

            <div className="mt-9 grid gap-7 md:grid-cols-3">
              <Field label="Department ID">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  onChange={updateField("departmentId")}
                  placeholder="Department record ID"
                  value={form.departmentId}
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  onChange={updateField("location")}
                  placeholder="e.g. London HQ"
                  value={form.location}
                />
              </Field>
              <Field label="Custodian ID">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  onChange={updateField("custodianId")}
                  placeholder="User record ID"
                  value={form.custodianId}
                />
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
            {isSubmitting ? "Saving..." : "Save Asset"}
          </button>
        </div>
      </div>
    </form>
  );
}
