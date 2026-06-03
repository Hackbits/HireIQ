"use client";
// app/dashboard/layout.tsx - Layout for authenticated dashboard pages
import { AuthProvider } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
