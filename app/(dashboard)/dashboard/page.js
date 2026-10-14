import Link from "next/link";

import { getSessionUser } from "@/lib/server/backend";

const metrics = [
  { label: "Today’s sales", value: "—", note: "Sales module ready to connect", tone: "blue" },
  { label: "Low stock items", value: "—", note: "Inventory module coming next", tone: "orange" },
  { label: "Expiring soon", value: "—", note: "Batch alerts will appear here", tone: "green" },
  { label: "Pending purchases", value: "—", note: "Purchase workflow placeholder", tone: "violet" },
];

const quickActions = [
  { href: "/sales", label: "Create sale", description: "Start a new customer bill", symbol: "+" },
  { href: "/purchases", label: "Record purchase", description: "Add supplier stock", symbol: "↓" },
  { href: "/inventory", label: "Check inventory", description: "Review batches and stock", symbol: "□" },
  { href: "/medbook", label: "Open Medbook", description: "Find medicine information", symbol: "⌕" },
];

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getSessionUser();
  const name = user?.first_name || "there";
  const branches = user?.active_context?.accessible_branches ?? [];

  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Good to see you, {name}.</h1>
          <p>Here’s the structure for your pharmacy’s daily operations.</p>
        </div>
        <div className="date-chip"><span>Active access</span><strong>{branches.length} {branches.length === 1 ? "branch" : "branches"}</strong></div>
      </section>

      <section className="metric-grid" aria-label="Pharmacy metrics">
        {metrics.map((metric) => <article className={`metric-card metric-${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></article>)}
      </section>

      <div className="dashboard-grid">
        <section className="content-card">
          <div className="section-heading"><div><p className="eyebrow">Shortcuts</p><h2>Quick actions</h2></div></div>
          <div className="quick-grid">
            {quickActions.map((action) => <Link href={action.href} className="quick-action" key={action.href}><span className="quick-symbol">{action.symbol}</span><span><strong>{action.label}</strong><small>{action.description}</small></span><span className="action-arrow">→</span></Link>)}
          </div>
        </section>

        <aside className="content-card setup-card">
          <p className="eyebrow">Foundation status</p>
          <h2>Your workspace is connected</h2>
          <ul className="check-list">
            <li><span>✓</span> Secure account access</li>
            <li><span>✓</span> Tenant and role context</li>
            <li><span>✓</span> Branch-level access</li>
            <li className="pending"><span>○</span> Business modules</li>
          </ul>
          <Link className="text-link" href="/settings">Review account settings →</Link>
        </aside>
      </div>
    </div>
  );
}

