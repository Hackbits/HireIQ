"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PlanGateProps {
  children: React.ReactNode;
}

export default function PlanGate({ children }: PlanGateProps) {
  const { plan, quotaUsed, quotaLimit } = useAuth();

  if (plan === "pro") return <>{children}</>;

  if (quotaUsed < quotaLimit) return <>{children}</>;

  return (
    <Card className="text-center py-12 border-primary/20">
      <CardContent>
        <div className="bg-primary/10 text-primary rounded-xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <h3 className="font-bold tracking-tight text-2xl mb-2">
          Monthly Quota Reached
        </h3>
        <p className="text-muted-foreground text-sm mb-1">
          You&apos;ve used all <strong>{quotaLimit}</strong> free resume screens this month.
        </p>
        <p className="text-muted-foreground text-sm mb-8">
          Upgrade to Pro for unlimited screens, priority processing, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/billing">
            <Button variant="primary" size="lg">
              Upgrade to Pro
            </Button>
          </Link>
          <span className="text-muted-foreground text-xs">Quota resets monthly</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <div className="p-4 rounded-lg bg-muted/50 text-left">
            <p className="font-semibold mb-2 text-sm">Free</p>
            <ul className="space-y-1">
              <li className="text-xs text-muted-foreground">✓ 20 screens/month</li>
              <li className="text-xs text-muted-foreground">✓ AI scoring</li>
              <li className="text-xs text-muted-foreground">✓ Basic reports</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-left">
            <p className="font-semibold mb-2 text-sm text-primary">Pro</p>
            <ul className="space-y-1">
              <li className="text-xs text-muted-foreground">✓ Unlimited screens</li>
              <li className="text-xs text-muted-foreground">✓ Priority AI</li>
              <li className="text-xs text-muted-foreground">✓ CSV export</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
