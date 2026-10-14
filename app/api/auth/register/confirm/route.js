import { backendRequest, backendUnavailable, jsonFromBackend } from "@/lib/server/backend";

export async function POST(request) {
  try {
    const response = await backendRequest("auth/register/confirm/", {
      method: "POST",
      body: JSON.stringify(await request.json()),
    });
    return jsonFromBackend(response);
  } catch {
    return backendUnavailable();
  }
}
