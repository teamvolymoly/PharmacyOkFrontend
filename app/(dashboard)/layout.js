import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/server/backend";
import AppShell from "@/shared/layout/AppShell";

export default async function DashboardLayout({ children }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <AppShell user={user}>{children}</AppShell>;
}
