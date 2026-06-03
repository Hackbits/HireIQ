"use client";
// components/Sidebar.tsx - Shared navigation sidebar
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/billing",
    label: "Billing",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, plan, quotaUsed, quotaLimit, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const quotaPercent = plan === "pro" ? 0 : Math.min((quotaUsed / quotaLimit) * 100, 100);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--gradient-primary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-base font-bold" style={{ fontFamily: "var(--font-manrope)" }}>
            Hire<span className="gradient-text">IQ</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <span style={{ color: isActive ? "var(--primary)" : "var(--on-surface-variant)" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Plan/Quota section */}
      {plan === "free" && (
        <div className="mx-3 mb-4 p-3 rounded-lg" style={{ background: "rgba(189,157,255,0.06)", border: "1px solid rgba(189,157,255,0.12)" }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: "var(--on-surface-variant)", fontSize: "0.75rem" }}>
              Screens used
            </span>
            <span style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 600 }}>
              {quotaUsed}/{quotaLimit}
            </span>
          </div>
          <div className="progress-bar-track mb-3">
            <div className="progress-bar-fill" style={{ width: `${quotaPercent}%` }} />
          </div>
          <Link
            href="/billing"
            className="btn-primary w-full justify-center text-center"
            style={{ padding: "0.5rem", fontSize: "0.8rem" }}
          >
            Upgrade to Pro ✦
          </Link>
        </div>
      )}

      {plan === "pro" && (
        <div className="mx-3 mb-4 p-3 rounded-lg text-center" style={{ background: "rgba(189,157,255,0.06)", border: "1px solid rgba(189,157,255,0.12)" }}>
          <span className="gradient-text text-sm font-bold">✦ Pro Plan Active</span>
          <p className="text-xs mt-1" style={{ color: "var(--on-surface-variant)" }}>Unlimited screens</p>
        </div>
      )}

      {/* User section */}
      <div className="px-3 pt-3" style={{ borderTop: "1px solid rgba(72,71,77,0.2)" }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm" style={{ background: "var(--gradient-primary)", color: "#000" }}>
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--on-surface)" }}>
              {user?.email ?? "Loading..."}
            </p>
            <p className="text-xs capitalize" style={{ color: "var(--on-surface-variant)" }}>{plan} plan</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            style={{ color: "var(--on-surface-variant)", flexShrink: 0 }}
            className="hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
