import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HireIQ – AI-Powered Resume Screening",
    short_name: "HireIQ",
    description: "Screen hundreds of resumes in seconds using AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
