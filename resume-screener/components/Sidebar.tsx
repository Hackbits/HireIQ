"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

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
    <aside className="w-60 min-h-screen bg-card border-r border-border flex flex-col flex-shrink-0">
      <div className="px-5 mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="bg-primary/10 text-primary rounded-md w-8 h-8 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight">
            hire<span className="text-primary">IQ</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors rounded-md mx-2",
                isActive && "bg-primary/10 text-primary font-medium"
              )}
            >
              <span>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {plan === "free" && (
        <div className="mx-3 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="micro-label">
              Screens used
            </span>
            <span className="text-xs font-semibold text-primary">
              {quotaUsed}/{quotaLimit}
            </span>
          </div>
          <div className="bg-secondary rounded-full overflow-hidden mb-3 h-2">
            <div className="bg-primary rounded-full h-full" style={{ width: `${quotaPercent}%` }} />
          </div>
          <Link
            href="/billing"
            className="bg-primary text-primary-foreground font-semibold rounded-md w-full text-center block py-2 text-xs hover:bg-primary/90 transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      {plan === "pro" && (
        <div className="mx-3 mb-4 px-3 py-2 rounded-lg bg-success/10 border border-success/20 text-center">
          <span className="micro-label text-success">Pro Plan Active</span>
          <p className="text-xs mt-1 text-muted-foreground">Unlimited screens</p>
        </div>
      )}

      <div className="px-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/30">
          <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold text-sm">
            {user?.email?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate text-foreground">
              {user?.email ?? "Loading..."}
            </p>
            <p className="text-xs capitalize text-muted-foreground">{plan} plan</p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
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
