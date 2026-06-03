import type { Metadata } from "next";
import { IBM_Plex_Sans, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-code",
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
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${fraunces.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <div className="pt-16">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
