"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, profile, loading, plan, quotaUsed, quotaLimit, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center bg-[var(--background)]">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  const usagePercentage = Math.min(100, Math.max(0, (quotaUsed / quotaLimit) * 100));

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        <div className="page-header mb-8">
          <div>
            <h1 className="page-title text-white">Your Profile</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Account Details */}
          <div className="card bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Account Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                {profile?.email?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Email Address</p>
                <p className="text-xl font-medium text-white">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
                  {plan} Plan
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {profile?.fullName && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-slate-400 mb-1">Full Name</p>
                  <p className="text-sm text-slate-300">{profile.fullName}</p>
                </div>
              )}
              {profile?.organizationName && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm text-slate-400 mb-1">Organization</p>
                    <p className="text-sm text-slate-300">{profile.organizationName}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm text-slate-400 mb-1">Company Size</p>
                    <p className="text-sm text-slate-300">{profile.organizationSize || "Unknown"}</p>
                  </div>
                </div>
              )}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm text-slate-400 mb-1">User ID</p>
                <p className="text-sm font-mono text-slate-300">{user.uid}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm text-slate-400 mb-1">Member Since</p>
                <p className="text-sm text-slate-300">
                  {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="card bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Current Usage</h2>
            
            <div className="mb-2 flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-slate-300 mb-1">Resume Screens</p>
                <p className="text-3xl font-bold text-white">
                  {quotaUsed} <span className="text-lg font-normal text-slate-500">/ {plan === "pro" ? "Unlimited" : quotaLimit}</span>
                </p>
              </div>
              <p className="text-sm font-medium text-sky-400">
                {plan === "pro" ? "No limit" : `${Math.round(usagePercentage)}% Used`}
              </p>
            </div>
            
            {plan === "free" && (
              <div className="w-full h-3 bg-[#1e293b] rounded-full overflow-hidden mt-4">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${usagePercentage > 80 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]'}`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}
            
            {plan === "free" && usagePercentage > 80 && (
              <p className="text-xs text-red-400 mt-3 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                You are approaching your monthly limit. Upgrade to Pro for unlimited screens.
              </p>
            )}
          </div>

          {/* Danger Zone */}
          <div className="mt-8">
            <button 
              onClick={handleSignOut}
              className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 hover:text-red-300 transition-colors flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
