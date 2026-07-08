export type AssetCategory =
  | "VEHICLES"
  | "EQUIPMENT"
  | "REAL_ESTATE"
  | "IT_INFRASTRUCTURE"
  | "HEAVY_MACHINERY"
  | "CORPORATE_FLEET";

export type AssetStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "EXPIRING_SOON"
  | "DECOMMISSIONED"
  | "PENDING_APPROVAL";

export type AssetApiAsset = {
  id: number;
  assetCode: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  manufacturer?: string | null;
  modelYear?: number | null;
  color?: string | null;
  serialNumber?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | string | null;
  warrantyExpiry?: string | null;
  vendorId?: number | null;
  custodianId?: number | null;
  location?: string | null;
  departmentId?: number | null;
  condition?: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | null;
  conditionScore?: number | null;
  valuation?: number | string | null;
  lastScannedAt?: string | null;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: number;
    name: string;
    branch_location?: string | null;
    branchLocation?: string | null;
  } | null;
  custodian?: {
    id: number;
    name: string;
    email: string;
    initials?: string | null;
    role?: string | null;
    status?: string | null;
  } | null;
  documents?: Array<{
    id: number;
    name: string;
    fileUrl?: string | null;
    docType?: string | null;
    expiryDate?: string | null;
    status?: string | null;
    isVerified?: boolean;
  }>;
};

export type AssetCreatePayload = {
  assetCode: string;
  name: string;
  category: AssetCategory;
  status?: AssetStatus;
  serialNumber?: string | null;
  manufacturer?: string | null;
  modelYear?: number | null;
  color?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  warrantyExpiry?: string | null;
  vendorId?: number | null;
  location?: string | null;
  departmentId?: number | null;
  custodianId?: number | null;
  condition?: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | null;
  conditionScore?: number | null;
  valuation?: number | null;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null;
};

type ApiResult<T> = {
  message: string;
  data: T | null;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3005";
const assetUrl = `${apiBaseUrl}/asset`;

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    return typeof body?.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
}

export const Getasset = async (): Promise<ApiResult<{ assets: AssetApiAsset[] }>> => {
  try {
    const res = await fetch(assetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        message: await readErrorMessage(res, "Something went wrong. Try again later"),
        data: null,
      };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};

export const createAsset = async (
  payload: AssetCreatePayload
): Promise<ApiResult<{ message: string; asset: AssetApiAsset }>> => {
  try {
    const res = await fetch(`${assetUrl}/new-asset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        message: await readErrorMessage(res, "Could not save this asset. Try again later."),
        data: null,
      };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};

export const getAssetById = async (
  id: number | string
): Promise<ApiResult<{ asset: AssetApiAsset }>> => {
  try {
    const res = await fetch(`${assetUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        message: await readErrorMessage(res, "Could not load this asset."),
        data: null,
      };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};

export const updateAsset = async (
  id: number | string,
  payload: Partial<AssetCreatePayload>
): Promise<ApiResult<{ message: string; asset: AssetApiAsset }>> => {
  try {
    const res = await fetch(`${assetUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        message: await readErrorMessage(res, "Could not update this asset. Try again later."),
        data: null,
      };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};
