"use client";
import { AuthProvider } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto planner-bg">
          <div className="container mx-auto max-w-375 px-4 py-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
