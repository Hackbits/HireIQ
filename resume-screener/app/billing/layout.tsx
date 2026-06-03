"use client";
// app/billing/layout.tsx - Layout for billing page with auth
import { AuthProvider } from "@/lib/auth-context";

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
