import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireIQ – AI-Powered Resume Screening",
  description:
    "Screen hundreds of resumes in seconds using AI. Score candidates, identify skill gaps, and hire smarter with HireIQ.",
  keywords: ["resume screening", "AI recruitment", "HR tech", "ATS", "hiring"],
  openGraph: {
    title: "HireIQ – AI-Powered Resume Screening",
    description: "Screen hundreds of resumes in seconds using AI.",
    type: "website",
  },
};

import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="bg-[var(--background)] text-[var(--on-background)] antialiased">
        <AuthProvider>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
