import { FE_ENV } from "./env";
export const API_BASE_URL = FE_ENV.API_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";

async function http<T>(path: string, options: RequestInit & { method?: HttpMethod } = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const method = (options.method || "GET") as HttpMethod;
  const res = await fetch(url, {
    method,
    headers: method !== "GET" && method !== "HEAD"
      ? {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        }
      : options.headers,
    body: options.body,
    credentials: "include",
    // Avoid caching authenticated requests by default
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return (await res.json()) as T;
  // @ts-expect-error allow empty json
  return undefined;
}

// ROUTES

export const api = {
  getTrending: () =>
    http<Array<{ id: string; text: string; instructions?: string; usageCount?: number; ownerUsername?: string }>>(
      "/api/poems/trending"
    ),
  generatePoem: (payload: { userName: string; friendNames: string[] }) =>
    http<{ text: string; templateId: string }>("/api/poems/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload: { email: string; password: string }) =>
    http<{ id: string; email: string; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    http<{ id: string; email: string; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  otpStart: (payload: { phone: string }) =>
    http<{ ok: boolean }>("/api/auth/otp/start", { method: "POST", body: JSON.stringify(payload) }),
  otpConfirm: (payload: { phone: string; code: string }) =>
    http<{ id: string; phone: string; username?: string; name?: string; profileComplete?: boolean }>(
      "/api/auth/otp/confirm",
      { method: "POST", body: JSON.stringify(payload) }
    ),
  usernameAvailable: (username: string) =>
    http<{ available: boolean }>(`/api/auth/username-available?username=${encodeURIComponent(username)}`),
  registerProfile: (payload: { firstName: string; lastName?: string }) =>
    http<{ ok: boolean; username: string; name: string }>("/api/auth/register-profile", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => http<{ message: string }>("/api/auth/logout", { method: "POST" }),
  me: () => http<{ id: string; email?: string; phone?: string; username?: string; name?: string }>("/api/auth/me"),
  listPoems: () => http<Array<{ _id: string; text: string; instructions?: string }>>("/api/poems"),
  getPoem: (id: string) => http<{ _id: string; text: string; instructions?: string }>(`/api/poems/${id}`),
  createPoem: (payload: { text: string; instructions?: string }) =>
    http<{ _id: string }>("/api/poems", { method: "POST", body: JSON.stringify(payload) }),
  updatePoem: (id: string, payload: { text: string; instructions?: string }) =>
    http<{ _id: string }>(`/api/poems/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deletePoem: (id: string) => http<{ ok: boolean }>(`/api/poems/${id}`, { method: "DELETE" }),
  browsePoems: (params: { q?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return http<{
      items: Array<{ _id: string; text: string; instructions?: string; usageCount?: number; ownerUsername?: string }>;
      page: number;
      limit: number;
      total: number;
      pages: number;
    }>(`/api/poems/browse${qs ? `?${qs}` : ""}`);
  },
  fitCount: (friends: number) => http<{ count: number }>(`/api/poems/fit-count?friends=${friends}`),
  fitStats: () => http<{ items: Array<{ friends: number; count: number }> }>(`/api/poems/fit-stats`),
};


