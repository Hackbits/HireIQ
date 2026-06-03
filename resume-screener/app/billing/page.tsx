"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import UpgradeModal from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loader" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="page-header mb-8">
        <div>
          <h1 className="font-display-family text-3xl font-bold tracking-tight">Billing & Plans</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {plan === "pro" ? "You're on the Pro plan" : "Choose the plan that works for you"}
          </p>
        </div>
      </div>

      {message && (
        <div
          className="mb-6 p-4 rounded-lg animate-fade-up"
          style={{
            background: message.type === "success" ? "color-mix(in oklch, var(--color-accent), transparent 80%)" : "color-mix(in oklch, var(--color-destructive), transparent 80%)",
            border: `1px solid ${message.type === "success" ? "color-mix(in oklch, var(--color-accent), transparent 60%)" : "color-mix(in oklch, var(--color-destructive), transparent 60%)"}`,
            color: message.type === "success" ? "var(--color-accent)" : "var(--color-destructive)",
          }}
        >
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <Card className={plan === "free" ? "border-primary/30" : ""}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display-family text-xl font-bold tracking-tight">Free</h2>
                <p className="font-display-family text-3xl font-bold mt-1">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              {plan === "free" && (
                <span className="micro-label bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
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

            <Button variant="secondary" className="w-full" disabled style={{ opacity: 0.5 }}>
              {plan === "free" ? "Current Plan" : "Downgrade unavailable"}
            </Button>
          </CardContent>
        </Card>

        <Card className={`relative overflow-hidden ${plan === "pro" ? "border-accent/30" : "border-primary/30"}`}>
          <div className="command-strip absolute top-0 right-0 px-3 py-1 text-xs font-bold text-black rounded-bl-xl">
            POPULAR
          </div>

          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display-family text-xl font-bold tracking-tight text-primary">Pro</h2>
                <p className="font-display-family text-3xl font-bold mt-1">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              {plan === "pro" && (
                <span className="micro-label bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1 mt-6">
                  Active
                </span>
              )}
            </div>

            <ul className="space-y-2.5 mb-6">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0 text-accent">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {plan === "pro" ? (
              <Button variant="primary" className="w-full" disabled style={{ opacity: 0.7 }}>
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
