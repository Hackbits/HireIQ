"use client";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

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

  const handleSimulateUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      // For development/demo: Simulate a Stripe payment and upgrade the user directly in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        plan: "pro",
        screensLimit: 999999,
      });
      
      // Simulate network delay for effect
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError("Failed to process upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md"
        onClick={!loading ? onClose : undefined}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#0f172a]/90 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(14,165,233,0.15)] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-sky-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Upgrade to Pro ✦</h2>
              <p className="text-sky-300 text-sm">Unlock unlimited AI power</p>
            </div>
            <button 
              onClick={onClose}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <span className="text-slate-300">HireIQ Pro Plan</span>
              <span className="text-xl font-bold text-white">$29<span className="text-sm font-normal text-slate-400">/mo</span></span>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" className="mt-0.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Unlimited resume screens
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" className="mt-0.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Priority AI processing & CSV export
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" className="mt-0.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Batch uploads (up to 50 at once)
              </li>
            </ul>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs text-center">
              Since Stripe is not yet configured, this button will simulate a successful payment and instantly upgrade your account for testing.
            </div>
            
            <button
              onClick={handleSimulateUpgrade}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Processing Upgrade...
                </>
              ) : (
                "Simulate Payment & Upgrade"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
