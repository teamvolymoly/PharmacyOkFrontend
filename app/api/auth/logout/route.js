import { cookies } from "next/headers";

import { ACCESS_COOKIE, REFRESH_COOKIE, backendRequest } from "@/lib/server/backend";

export async function POST() {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  const refresh = cookieStore.get(REFRESH_COOKIE)?.value;

  if (access && refresh) {
    await backendRequest("auth/logout/", {
      method: "POST",
      headers: { Authorization: `Bearer ${access}` },
      body: JSON.stringify({ refresh }),
    }).catch(() => null);
  }

  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  return Response.json({ success: true });
}
