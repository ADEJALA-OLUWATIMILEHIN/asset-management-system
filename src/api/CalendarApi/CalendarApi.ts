export type EventType = "INSURANCE_RENEWAL" | "MAINTENANCE_DUE" | "LICENSE_EXPIRY" | "AUDIT_SCHEDULE" | "LEASE_PAYMENT";

export type CalendarEvent = {
  id: number;
  title: string;
  eventType: EventType;
  eventDate: string;
  linkedAssetId?: number | null;
  linkedDocId?: number | null;
  isCritical: boolean;
  isResolved: boolean;
  createdAt?: string;
  updatedAt?: string;
  asset?: {
    id: number;
    assetCode: string;
    name: string;
  } | null;
  document?: {
    id: number;
    name: string;
    docType: string;
  } | null;
};

type ApiResult<T> = {
  message?: string;
  data: T | null;
  error?: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3005";
const calendarUrl = `${apiBaseUrl}/calendar`;

async function readErrorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    return typeof body?.error === "string" ? body.error : fallback;
  } catch {
    return fallback;
  }
}

export const getCalendarEvents = async (): Promise<
  ApiResult<{ events: CalendarEvent[] }>
> => {
  try {
    const res = await fetch(calendarUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const message = await readErrorMessage(res, "Failed to fetch calendar events");
      return { message, data: null };
    }

    const body = await res.json();
    return {
      message: "Calendar events fetched successfully",
      data: body.events
        ? { events: body.events }
        : body.data,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
};

export const getCalendarEventsByMonth = async (
  year: number,
  month: number
): Promise<ApiResult<{ events: CalendarEvent[] }>> => {
  try {
    const res = await fetch(`${calendarUrl}/month/${year}/${month}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const message = await readErrorMessage(res, "Failed to fetch calendar events");
      return { message, data: null };
    }

    const body = await res.json();
    return {
      message: "Calendar events fetched successfully",
      data: body.events
        ? { events: body.events }
        : body.data,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
};

export const getCalendarStats = async (): Promise<
  ApiResult<{
    total: number;
    renewals: number;
    maintenance: number;
    expiry: number;
    audit: number;
    critical: number;
  }>
> => {
  try {
    const res = await fetch(`${calendarUrl}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const message = await readErrorMessage(res, "Failed to fetch calendar stats");
      return { message, data: null };
    }

    const body = await res.json();
    return {
      message: "Calendar stats fetched successfully",
      data: body.data || body,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
};

export const createCalendarEvent = async (
  event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
): Promise<ApiResult<{ event: CalendarEvent }>> => {
  try {
    const res = await fetch(`${calendarUrl}/new-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const message = await readErrorMessage(res, "Failed to create event");
      return { message, data: null };
    }

    const body = await res.json();
    return {
      message: body.message || "Event created successfully",
      data: body.event ? { event: body.event } : body.data,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
};

export const updateCalendarEvent = async (
  id: number,
  updates: Partial<Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">>
): Promise<ApiResult<{ event: CalendarEvent }>> => {
  try {
    const res = await fetch(`${calendarUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const message = await readErrorMessage(res, "Failed to update event");
      return { message, data: null };
    }

    const body = await res.json();
    return {
      message: body.message || "Event updated successfully",
      data: body.event ? { event: body.event } : body.data,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An error occurred",
      data: null,
    };
  }
};
