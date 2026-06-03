"use client";
// app/billing/page.tsx - Billing & plan management
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import UpgradeModal from "@/components/UpgradeModal";

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
      setMessage({ type: "success", text: "🎉 Welcome to Pro! Your plan has been upgraded." });
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
    setMessage({ type: "success", text: "🎉 Welcome to Pro! Your account has been upgraded." });
    await refreshUserData();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center">
          <div className="loader" style={{ width: 40, height: 40 }} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="page-header mb-8">
          <div>
            <h1 className="page-title">Billing & Plans</h1>
            <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              {plan === "pro" ? "You&apos;re on the Pro plan ✦" : "Choose the plan that works for you"}
            </p>
          </div>
        </div>

        {/* Status messages */}
        {message && (
          <div
            className="mb-6 p-4 rounded-lg fade-in"
            style={{
              background: message.type === "success" ? "rgba(74,222,128,0.1)" : "rgba(255,110,132,0.1)",
              border: `1px solid ${message.type === "success" ? "rgba(74,222,128,0.2)" : "rgba(255,110,132,0.2)"}`,
              color: message.type === "success" ? "#4ade80" : "var(--error)",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Plan comparison */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Free Plan */}
          <div
            className="card"
            style={{
              border: plan === "free" ? "1px solid rgba(189,157,255,0.3)" : "1px solid rgba(72,71,77,0.2)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-manrope)" }}>Free</h2>
                <p className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-manrope)" }}>$0<span className="text-sm font-normal" style={{ color: "var(--on-surface-variant)" }}>/mo</span></p>
              </div>
              {plan === "free" && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(189,157,255,0.1)", color: "var(--primary)" }}>
                  Current Plan
                </span>
              )}
            </div>

            <ul className="space-y-2.5 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--on-surface-variant)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 flex-shrink-0" style={{ color: "var(--on-surface-variant)" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button disabled className="btn-secondary w-full justify-center" style={{ opacity: 0.5, cursor: "default" }}>
              {plan === "free" ? "Current Plan" : "Downgrade unavailable"}
            </button>
          </div>

          {/* Pro Plan */}
          <div
            className="card relative overflow-hidden"
            style={{
              border: plan === "pro" ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(189,157,255,0.3)",
              boxShadow: "0 0 30px rgba(124,58,237,0.1)",
            }}
          >
            {/* Popular badge */}
            <div
              className="absolute top-0 right-0 px-3 py-1 text-xs font-bold"
              style={{ background: "var(--gradient-primary)", color: "#000", borderRadius: "0 8px 0 8px" }}
            >
              POPULAR
            </div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-manrope)" }}>Pro ✦</h2>
                <p className="text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-manrope)" }}>$29<span className="text-sm font-normal" style={{ color: "var(--on-surface-variant)" }}>/mo</span></p>
              </div>
              {plan === "pro" && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)", marginTop: "1.5rem" }}>
                  ✓ Active
                </span>
              )}
            </div>

            <ul className="space-y-2.5 mb-6">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--on-surface)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {plan === "pro" ? (
              <button disabled className="btn-primary w-full justify-center" style={{ opacity: 0.7, cursor: "default" }}>
                ✦ Pro Plan Active
              </button>
            ) : (
              <button
                id="upgrade-pro-btn"
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="btn-primary w-full justify-center"
                style={{ padding: "0.875rem" }}
              >
                {checkoutLoading ? (
                  <div className="loader" style={{ width: 18, height: 18, borderTopColor: "#000" }} />
                ) : (
                  "Upgrade to Pro →"
                )}
              </button>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <p className="text-xs text-center" style={{ color: "var(--on-surface-variant)" }}>
            Payments are processed securely via Stripe. Cancel anytime from your Stripe Customer Portal.
            <br />
            Questions? Email us at support@hireiq.app
          </p>
        </div>
      </main>
      
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
