"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LandingNavbar() {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="command-strip w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(199,155,55,0.3)] group-hover:shadow-[0_0_25px_rgba(199,155,55,0.5)] transition-all">
            HQ
          </div>
          <span className="font-display-family text-xl font-bold tracking-tight text-foreground">HireIQ</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors">Products</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-6 h-6 rounded-full command-strip flex items-center justify-center text-xs font-bold text-black">
                  {profile?.email?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  Profile
                </span>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="command-strip text-black font-semibold rounded-full px-5 py-2.5 text-sm hover:shadow-[0_0_30px_rgba(199,155,55,0.4)] hover:-translate-y-0.5 transition-all">
              Get Started
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border animate-fade-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#products"
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium"
            >
              Products
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium"
            >
              Pricing
            </a>
            {user && (
              <>
                <hr className="border-border" />
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
