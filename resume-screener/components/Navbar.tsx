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

  // Close dropdown when clicking outside
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
    <header className="fixed top-0 z-50 w-full bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] transition-all">
            HQ
          </div>
          <span className="font-bold text-xl tracking-tight text-white drop-shadow-md">HireIQ</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {isPublicPage && !user ? (
            <>
              <a href="/#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="/#products" className="text-slate-300 hover:text-white transition-colors">Products</a>
            </>
          ) : user ? (
            <>
              <Link href="/dashboard" className={`${pathname.includes("/dashboard") ? "text-sky-400 font-bold" : "text-slate-300 hover:text-white"} transition-colors`}>
                Dashboard
              </Link>
              <Link href="/billing" className={`${pathname.includes("/billing") ? "text-sky-400 font-bold" : "text-slate-300 hover:text-white"} transition-colors flex items-center gap-2`}>
                Billing
                {plan === "pro" && <span className="bg-sky-500/20 text-sky-400 text-[10px] uppercase px-1.5 py-0.5 rounded font-bold">Pro</span>}
              </Link>
            </>
          ) : null}
        </nav>

        {/* Right Side / Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
              
              {/* Quota Indicator (Hidden on mobile) */}
              {plan === "free" && (
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-[10px] text-slate-400 mb-0.5">Free Plan ({quotaUsed}/{quotaLimit})</span>
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500" style={{ width: `${quotaPercent}%` }}></div>
                  </div>
                </div>
              )}

              {/* Profile Avatar & Dropdown */}
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-1.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {profile?.email?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-12 right-0 w-56 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white truncate">{profile?.fullName || profile?.organizationName || user.email}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/dashboard" 
                      className="block md:hidden px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/billing" 
                      className="block md:hidden px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Billing
                    </Link>
                  </div>
                  
                  <div className="border-t border-white/5 pt-2">
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
