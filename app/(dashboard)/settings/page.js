import { getSessionUser } from "@/lib/server/backend";
import { redirect } from "next/navigation";

export const metadata = { title: "Account & settings" };

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return (
    <section className="settings-page">
      <p className="eyebrow">Manage</p>
      <h1>Account & settings</h1>
      <p className="module-intro">Your identity, organizations, roles, and branch access from the PharmacyOK backend.</p>
      <div className="settings-grid">
        <article className="content-card"><h2>Profile</h2><dl className="details-list"><div><dt>Name</dt><dd>{[user.first_name, user.last_name].filter(Boolean).join(" ") || "Not set"}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Phone</dt><dd>{user.phone || "Not set"}</dd></div></dl></article>
        <article className="content-card"><h2>Workspace access</h2><div className="membership-list">{user.tenant_memberships?.length ? user.tenant_memberships.map((membership) => <div className="membership" key={membership.id}><span className="avatar">{membership.tenant.name.charAt(0)}</span><div><strong>{membership.tenant.name}</strong><small>{membership.role.name} · {membership.accessible_branches.length} branches</small></div></div>) : <p>No active pharmacy membership is assigned.</p>}</div></article>
      </div>
    </section>
  );
}
