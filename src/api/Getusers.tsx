export type ApiDepartment = {
  id: number;
  name: string;
  branch_location?: string | null;
  branchLocation?: string | null;
};

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  initials?: string;
  avatar_url?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "VIEWER";
  department_id?: number | null;
  departmentId?: number | null;
  department?: ApiDepartment | null;
  status: "ACTIVE" | "PENDING" | "DEACTIVATED";
};

type ApiResult<T> = {
  message: string;
  data: T | null;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3005";

export const getUsers = async (): Promise<ApiResult<{ users: ApiUser[] }>> => {
  const baseUrl = `${apiBaseUrl}/user`;

  try {
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok)
      return { message: "Something went wrong. Try again later", data: null };

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};

export const getDepartments = async (): Promise<ApiResult<{ departments: ApiDepartment[] }>> => {
  try {
    const res = await fetch(`${apiBaseUrl}/department`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { message: "Could not load departments", data: null };
    }

    const data = await res.json();

    return { message: "success", data };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred. Try again later", data: null };
  }
};
