"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LandingNavbar() {
  const { user, profile } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full bg-[#030712]/60 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] transition-all">
            HQ
          </div>
          <span className="font-bold text-xl tracking-tight text-white drop-shadow-md">HireIQ</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors drop-shadow">Features</a>
          <a href="#products" className="hover:text-white transition-colors drop-shadow">Products</a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {profile?.email?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-slate-200 hidden sm:block">
                  Profile
                </span>
              </Link>
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
