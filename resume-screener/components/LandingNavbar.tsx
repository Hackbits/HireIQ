"use client";
import React from "react";
import Link from "next/link";

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-card border-b border-border">
      <div className="container mx-auto px-4 h-13 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground text-xs font-bold rounded-md w-8 h-8 flex items-center justify-center">
            HQ
          </div>
          <span className="text-sm font-bold tracking-tight">
            <span className="text-foreground">Hire</span><span className="text-primary">IQ</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#products" className="text-muted-foreground hover:text-foreground transition-colors">
            Products
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            href="/login"
            className="bg-primary text-primary-foreground font-semibold rounded-md px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
