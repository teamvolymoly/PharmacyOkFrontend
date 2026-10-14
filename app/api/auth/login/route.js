import { cookies } from "next/headers";

import { ACCESS_COOKIE, REFRESH_COOKIE, backendRequest, backendUnavailable } from "@/lib/server/backend";

export async function POST(request) {
  try {
    const response = await backendRequest("auth/login/", {
      method: "POST",
      body: JSON.stringify(await request.json()),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) return Response.json(payload ?? { detail: "Sign in failed." }, { status: response.status });
    if (!payload?.access || !payload?.refresh) {
      return Response.json({ detail: "The API returned an invalid authentication response." }, { status: 502 });
    }

    const secure = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_COOKIE, payload.access, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 15,
    });
    cookieStore.set(REFRESH_COOKIE, payload.refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ success: true });
  } catch {
    return backendUnavailable();
  }
}
