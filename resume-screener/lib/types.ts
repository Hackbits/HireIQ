// lib/types.ts - Shared TypeScript types for the entire app

export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  organizationName?: string;
  organizationSize?: string;
  plan: "free" | "pro";
  screensUsed: number;
  screensLimit: number;
  createdAt?: any; // Firestore Timestamps
}

export interface Job {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: any;
  candidateCount?: number;
}

export interface Candidate {
  id: string;
  jobId?: string;
  name: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  recommendation: "strong_fit" | "possible_fit" | "not_fit";
  processedAt: any;
}

export type RecommendationFilter = "all" | "strong_fit" | "possible_fit" | "not_fit";
