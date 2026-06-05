"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton, SkeletonProfileCard } from "@/components/ui/skeleton";

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
      <div className="animate-fade-up">
        <div className="page-header mb-8">
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid gap-6">
          <SkeletonProfileCard />
          <SkeletonProfileCard />
        </div>
      </div>
    );
  }

  const usagePercentage = Math.min(100, Math.max(0, (quotaUsed / quotaLimit) * 100));

  return (
    <div className="animate-fade-up">
      <div className="page-header mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold tracking-tight text-lg mb-6 pb-4 border-b border-border">Account Information</h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="bg-primary/10 text-primary w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
                {profile?.email?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="text-xl font-medium text-foreground">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 rounded-md px-2 py-0.5">
                  {plan} Plan
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {profile?.fullName && (
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="text-sm text-foreground">{profile.fullName}</p>
                </div>
              )}
              {profile?.organizationName && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Organization</p>
                    <p className="text-sm text-foreground">{profile.organizationName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company Size</p>
                    <p className="text-sm text-foreground">{profile.organizationSize || "Unknown"}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="text-sm font-mono text-foreground">{user.uid}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-sm text-foreground">
                  {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold tracking-tight text-lg mb-6 pb-4 border-b border-border">Current Usage</h2>

            <div className="mb-2 flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Resume Screens</p>
                <p className="text-3xl font-bold text-foreground">
                  {quotaUsed} <span className="text-lg font-normal text-muted-foreground">/ {plan === "pro" ? "Unlimited" : quotaLimit}</span>
                </p>
              </div>
              <p className="text-sm font-medium text-primary">
                {plan === "pro" ? "No limit" : `${Math.round(usagePercentage)}% Used`}
              </p>
            </div>

            {plan === "free" && (
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden mt-4">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${usagePercentage > 80 ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}

            {plan === "free" && usagePercentage > 80 && (
              <p className="text-xs text-destructive mt-3 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                You are approaching your monthly limit. Upgrade to Pro for unlimited screens.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button
            variant="destructive"
            onClick={handleSignOut}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
