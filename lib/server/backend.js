import "server-only";

import { cookies } from "next/headers";

export const ACCESS_COOKIE = "pharmacyok_access";
export const REFRESH_COOKIE = "pharmacyok_refresh";

const API_URL = (
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api/v1"
).replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = Number(process.env.BACKEND_API_TIMEOUT_MS ?? 15_000);

export function backendRequest(path, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body != null && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  return fetch(`${API_URL}/${path.replace(/^\//, "")}`, {
    ...init,
    cache: "no-store",
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

export async function getSessionUser() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  try {
    const response = await backendRequest("auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export function jsonFromBackend(response) {
  return new Response(response.body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}

export function backendUnavailable() {
  return Response.json(
    { detail: "The PharmacyOK API is unavailable. Make sure the Django server is running." },
    { status: 503 },
  );
}
