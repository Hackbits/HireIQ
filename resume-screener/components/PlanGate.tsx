"use client";
// components/PlanGate.tsx - Quota check component
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface PlanGateProps {
  children: React.ReactNode;
}

export default function PlanGate({ children }: PlanGateProps) {
  const { plan, quotaUsed, quotaLimit } = useAuth();

  // Pro users always have access
  if (plan === "pro") return <>{children}</>;

  // Free users who have remaining quota
  if (quotaUsed < quotaLimit) return <>{children}</>;

  // Over quota — show upgrade wall
  return (
    <div className="card text-center py-12" style={{ border: "1px solid rgba(189,157,255,0.15)" }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(189,157,255,0.1)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-manrope)" }}>
        Monthly Quota Reached
      </h3>
      <p className="mb-1" style={{ color: "var(--on-surface-variant)", fontSize: "0.9rem" }}>
        You&apos;ve used all <strong>{quotaLimit}</strong> free resume screens this month.
      </p>
      <p className="mb-8" style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
        Upgrade to Pro for unlimited screens, priority processing, and more.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Link href="/billing" className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}>
          ✦ Upgrade to Pro
        </Link>
        <span style={{ color: "var(--on-surface-variant)", fontSize: "0.8rem" }}>Quota resets monthly</span>
      </div>

      {/* Mini comparison */}
      <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <div className="p-4 rounded-lg text-left" style={{ background: "var(--surface-container-high)" }}>
          <p className="font-semibold mb-2 text-sm">Free</p>
          <ul className="space-y-1">
            <li className="text-xs" style={{ color: "var(--on-surface-variant)" }}>✓ 20 screens/month</li>
            <li className="text-xs" style={{ color: "var(--on-surface-variant)" }}>✓ AI scoring</li>
            <li className="text-xs" style={{ color: "var(--on-surface-variant)" }}>✓ Basic reports</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg text-left" style={{ background: "rgba(189,157,255,0.08)", border: "1px solid rgba(189,157,255,0.2)" }}>
          <p className="font-semibold mb-2 text-sm gradient-text">Pro ✦</p>
          <ul className="space-y-1">
            <li className="text-xs" style={{ color: "var(--on-surface-variant)" }}>✓ Unlimited screens</li>
            <li className="text-xs" style={{ color: "var(--on-surface-variant)" }}>✓ Priority AI</li>
            <li className="text-xs" style={{ color: "var(--on-surface-variant)" }}>✓ CSV export</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
