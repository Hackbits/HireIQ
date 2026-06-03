"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LandingNavbar() {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  {profile?.email?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:block">
                  Profile
                </span>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-primary-foreground font-semibold rounded-md px-4 py-2 text-sm hover:bg-primary/90 transition-colors">
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
        <div className="md:hidden bg-card border-b border-border animate-fade-up">
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
