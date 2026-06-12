"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import UpgradeModal from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton, SkeletonBillingCards } from "@/components/ui/skeleton";

const PRO_FEATURES = [
  "Unlimited resume screens",
  "Priority AI processing",
  "CSV export for all candidates",
  "Batch upload (50+ resumes)",
  "Advanced candidate analytics",
  "Email support",
];

const FREE_FEATURES = [
  "20 resume screens/month",
  "AI scoring (0–100)",
  "Skill gap analysis",
  "2-sentence AI summaries",
  "Basic dashboard",
];

function BillingContent() {
  const { user, loading, plan, refreshUserData } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success === "true") {
      setMessage({ type: "success", text: "Welcome to Pro! Your plan has been upgraded." });
      refreshUserData();
    } else if (canceled === "true") {
      setMessage({ type: "error", text: "Checkout was canceled. You can try again anytime." });
    }
  }, [searchParams, refreshUserData]);

  const handleUpgrade = async () => {
    setIsModalOpen(true);
  };

  const handleUpgradeSuccess = async () => {
    setIsModalOpen(false);
    setMessage({ type: "success", text: "Welcome to Pro! Your account has been upgraded." });
    await refreshUserData();
  };

  if (loading) {
    return (
      <div className="animate-fade-up">
        <div className="page-header mb-8">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <SkeletonBillingCards />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="page-header mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Plans</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {plan === "pro" ? "You're on the Pro plan" : "Choose the plan that works for you"}
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md animate-fade-up ${message.type === "success" ? "bg-success/10 border border-success/20 text-success" : "bg-destructive/10 border border-destructive/20 text-destructive"}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-bold tracking-tight text-xl">Free</h2>
                <p className="text-3xl font-bold mt-1">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              {plan === "free" && (
                <span className="text-xs text-muted-foreground border border-border rounded-md px-2 py-0.5">
                  Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-2.5 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0 text-muted-foreground">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full" disabled>
              {plan === "free" ? "Current Plan" : "Downgrade unavailable"}
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 absolute top-0 right-0 rounded-bl-md">
            POPULAR
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-primary">Pro</h2>
                <p className="text-3xl font-bold mt-1">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              {plan === "pro" && (
                <span className="text-xs text-primary bg-primary/10 rounded-md px-2 py-0.5">
                  Active
                </span>
              )}
            </div>

            <ul className="space-y-2.5 mb-6">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0 text-primary">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {plan === "pro" ? (
              <Button variant="primary" className="w-full" disabled>
                Pro Plan Active
              </Button>
            ) : (
              <Button
                id="upgrade-pro-btn"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleUpgrade}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <div className="loader" style={{ width: 18, height: 18 }} />
                ) : (
                  "Upgrade to Pro"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <p className="text-xs text-center text-muted-foreground">
          Payments are processed securely via Stripe. Cancel anytime from your Stripe Customer Portal.
          <br />
          Questions? Email us at support@hireiq.app
        </p>
      </div>

      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUpgradeSuccess}
      />
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}
