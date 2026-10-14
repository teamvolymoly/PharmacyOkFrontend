import Link from "next/link";

export default function BrandLogo({ variant = "dark", compact = false }) {
  return (
    <Link className={`brand-logo brand-logo-${variant}`} href="/" aria-label="PharmacyOK home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <rect x="2" y="2" width="36" height="36" rx="12" fill="currentColor" />
          <path d="M20 10v20M10 20h20" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </span>
      {!compact ? <span>Pharmacy<strong>OK</strong></span> : null}
    </Link>
  );
}
