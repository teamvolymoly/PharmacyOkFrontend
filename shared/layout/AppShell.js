"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { accountNavigation, primaryNavigation } from "@/config/navigation";
import BrandLogo from "@/shared/ui/BrandLogo";
import LogoutButton from "@/shared/layout/LogoutButton";
import NavigationIcon from "@/shared/layout/NavigationIcon";

function NavigationLink({ item, onNavigate }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  return (
    <Link className={`nav-link${active ? " nav-link-active" : ""}`} href={item.href} onClick={onNavigate}>
      <NavigationIcon name={item.icon} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function AppShell({ children, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const membership = user.tenant_memberships?.[0];
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <div className="app-shell">
      <aside className={`sidebar${menuOpen ? " sidebar-open" : ""}`}>
        <div className="sidebar-brand"><BrandLogo variant="light" /></div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-heading">Workspace</p>
          {primaryNavigation.map((item) => <NavigationLink key={item.href} item={item} onNavigate={() => setMenuOpen(false)} />)}
          <p className="nav-heading nav-heading-account">Manage</p>
          {accountNavigation.map((item) => <NavigationLink key={item.href} item={item} onNavigate={() => setMenuOpen(false)} />)}
        </nav>
        <div className="sidebar-status">
          <span className="status-dot" />
          <div><strong>{membership?.tenant?.name ?? "Pharmacy workspace"}</strong><small>{membership?.role?.name ?? "Account active"}</small></div>
        </div>
      </aside>

      {menuOpen ? <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} /> : null}

      <div className="app-content">
        <header className="app-header">
          <button className="menu-button" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>
          <div className="header-context">
            <span>Current workspace</span>
            <strong>{membership?.tenant?.name ?? "PharmacyOK"}</strong>
          </div>
          <div className="account-summary">
            <span className="avatar">{displayName.charAt(0).toUpperCase()}</span>
            <div><strong>{displayName}</strong><small>{membership?.role?.name ?? "Team member"}</small></div>
            <LogoutButton />
          </div>
        </header>
        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}
