"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, profile, plan, quotaUsed, quotaLimit, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push("/");
  };

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
  const quotaPercent = plan === "pro" ? 0 : Math.min((quotaUsed / quotaLimit) * 100, 100);

  return (
    <header className="fixed top-0 z-50 w-full bg-card border-b border-border">
      <div className="container mx-auto px-4 h-13 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground text-xs font-bold rounded-md w-8 h-8 flex items-center justify-center">
            HQ
          </div>
          <span className="text-sm font-bold tracking-tight"><span className="text-foreground">Hire</span><span className="text-primary">IQ</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {isPublicPage && !user ? (
            <>
              <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/#products" className="text-muted-foreground hover:text-foreground transition-colors">Products</Link>
            </>
          ) : user ? (
            <>
              <Link href="/dashboard" className={`${pathname.includes("/dashboard") ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"} transition-colors`}>
                Dashboard
              </Link>
              <Link href="/billing" className={`${pathname.includes("/billing") ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"} transition-colors flex items-center gap-2`}>
                Billing
                {plan === "pro" && <span className="bg-primary/20 text-primary text-[10px] uppercase px-1.5 py-0.5 rounded font-bold">Pro</span>}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
              {plan === "free" && (
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="micro-label mb-0.5">Free Plan ({quotaUsed}/{quotaLimit})</span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${quotaPercent}%` }}></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-1.5 py-1.5 rounded-md bg-card border border-border hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {profile?.email?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-12 right-0 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50 animate-scale-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">{profile?.fullName || profile?.organizationName || user.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block md:hidden px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/billing"
                      className="block md:hidden px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Billing
                    </Link>
                  </div>

                  <div className="border-t border-border pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-primary-foreground font-semibold rounded-md px-4 py-2 text-sm hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
