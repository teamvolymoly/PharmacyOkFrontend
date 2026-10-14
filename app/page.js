import Link from "next/link";

import BrandLogo from "@/shared/ui/BrandLogo";

export default function HomePage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav shell">
        <BrandLogo />
        <Link className="button button-small" href="/login">Sign in</Link>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">Pharmacy operations, thoughtfully connected</p>
          <h1>Run your pharmacy with clarity.</h1>
          <p className="hero-text">
            PharmacyOK brings sales, purchases, inventory, branches, and your
            medicine book into one secure workspace built for Indian pharmacies.
          </p>
          <div className="actions">
            <Link className="button" href="/login">Open your workspace</Link>
            <a className="button button-secondary" href="#capabilities">Explore features</a>
          </div>
          <div className="trust-row" aria-label="Product highlights">
            <span>Multi-branch ready</span>
            <span>Role-based access</span>
            <span>Secure by design</span>
          </div>
        </div>

        <div className="hero-preview" aria-label="PharmacyOK dashboard preview">
          <div className="preview-topbar">
            <span className="preview-dot" />
            <span>Today at your pharmacy</span>
          </div>
          <div className="preview-grid">
            <article><span>Sales</span><strong>Ready</strong><small>Fast billing workflow</small></article>
            <article><span>Inventory</span><strong>Organized</strong><small>Batch and expiry focused</small></article>
            <article><span>Branches</span><strong>Connected</strong><small>One secure workspace</small></article>
            <article><span>Medbook</span><strong>Accessible</strong><small>Your medicine reference</small></article>
          </div>
        </div>
      </section>

      <section id="capabilities" className="capabilities shell">
        <p className="eyebrow">Everything has a place</p>
        <h2>A foundation that grows with your pharmacy</h2>
        <div className="capability-grid">
          <article><span>01</span><h3>Daily operations</h3><p>Keep sales, purchases, and stock movement easy to find and understand.</p></article>
          <article><span>02</span><h3>Team access</h3><p>Give owners and staff the right branch and role context for their work.</p></article>
          <article><span>03</span><h3>Built to scale</h3><p>Add business modules without turning the codebase into one large feature folder.</p></article>
        </div>
      </section>
    </main>
  );
}

