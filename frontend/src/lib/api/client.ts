import { ApiEnvelope, PaginatedResult } from "../../types/api";
import { tokenStorage } from "../auth/token-storage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

type RequestOptions = RequestInit & {
  auth?: boolean;
  query?: Record<string, string | number | undefined>;
};

let unauthorizedHandler: (() => void) | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const url = new URL(`${API_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

const parseResponse = async <T>(response: Response): Promise<ApiEnvelope<T>> => {
  const data = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    throw new ApiError(
      data?.error?.message ?? "Unexpected request error",
      response.status,
      data?.error?.details
    );
  }

  if (!data) {
    throw new ApiError("Invalid API response", response.status);
  }

  return data;
};

export const apiClient = {
  onUnauthorized(handler: () => void) {
    unauthorizedHandler = handler;
  },

  async request<T>(path: string, options: RequestOptions = {}): Promise<ApiEnvelope<T>> {
    const token = tokenStorage.get();
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    if (options.auth !== false && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(buildUrl(path, options.query), {
      ...options,
      headers
    });

    return parseResponse<T>(response);
  },

  async get<T>(path: string, query?: RequestOptions["query"]) {
    return this.request<T>(path, {
      method: "GET",
      query
    });
  },

  async post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined
    });
  },

  async patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined
    });
  },

  async delete(path: string) {
    const token = tokenStorage.get();
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : undefined
    });

    if (!response.ok) {
      await parseResponse(response);
    }
  }
};

export const unwrapList = <T>(envelope: ApiEnvelope<T[]>): PaginatedResult<T> => ({
  items: envelope.data,
  meta: envelope.meta
});
