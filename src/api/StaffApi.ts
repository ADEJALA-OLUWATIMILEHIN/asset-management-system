import type { ApiUser } from "./Getusers";

export type StaffRecord = {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  userId?: number | null;
  user?: ApiUser | null;
};

export type CreateStaffPayload = {
  fullName: string;
  email: string;
  phone?: string | null;
  userId?: number | null;
};

type ApiResult<T> = {
  message: string;
  data: T | null;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3005";

export const getStaff = async (): Promise<ApiResult<{ staff: StaffRecord[] }>> => {
  try {
    const res = await fetch(`${apiBaseUrl}/staff`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { message: "Could not load staff", data: null };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};

export const createStaff = async (
  payload: CreateStaffPayload
): Promise<ApiResult<{ staff: StaffRecord }>> => {
  try {
    const res = await fetch(`${apiBaseUrl}/staff/new-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { message: await readErrorMessage(res, "Could not create this staff/vendor"), data: null };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    return typeof body?.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
}

export const getStaffStats = async (): Promise<ApiResult<{ total: number }>> => {
  try {
    const res = await fetch(`${apiBaseUrl}/staff/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { message: "Could not load staff stats", data: null };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};
