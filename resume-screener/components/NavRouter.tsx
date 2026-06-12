"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import LandingNavbar from "./LandingNavbar";
import Navbar from "./Navbar";

export default function NavRouter() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user && (pathname === "/" || pathname === "/login" || pathname === "/signup")) {
    return <LandingNavbar />;
  }

  return <Navbar />;
}
