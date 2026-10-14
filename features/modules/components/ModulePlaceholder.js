import Link from "next/link";

export default function ModulePlaceholder({ eyebrow, title, description, items }) {
  return (
    <section className="module-page">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="module-intro">{description}</p>
      <div className="module-card-grid">
        {items.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.description}</p></article>)}
      </div>
      <div className="module-notice"><div><strong>Interface migrated and ready for implementation</strong><p>This section is intentionally separated so its API, validation, and tests can grow without coupling to the dashboard.</p></div><Link className="button button-small" href="/dashboard">Back to overview</Link></div>
    </section>
  );
}
