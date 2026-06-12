"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onSuccess }: UpgradeModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to process upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={!loading ? onClose : undefined}
      ></div>

      <Card className="relative w-full max-w-md overflow-hidden">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-bold tracking-tight text-2xl mb-1">Upgrade to Pro</h2>
              <p className="text-muted-foreground text-sm">Unlock unlimited AI power</p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
              <span className="text-foreground">HireIQ Pro Plan</span>
              <span className="text-xl font-bold text-foreground">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 text-primary">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Unlimited resume screens
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 text-primary">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Priority AI processing & CSV export
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 text-primary">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Batch uploads (up to 50 at once)
              </li>
            </ul>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            className="w-full bg-primary text-primary-foreground"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? "Redirecting to Stripe..." : "Upgrade to Pro — $29/mo"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
