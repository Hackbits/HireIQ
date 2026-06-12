// lib/types.ts - Shared TypeScript types for the entire app
import type { Timestamp } from "firebase/firestore";

/** Timestamp values from Firestore or ISO strings when created locally */
export type TimestampLike = Timestamp | string | number | Date;

export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  organizationName?: string;
  organizationSize?: string;
  plan: "free" | "pro";
  screensUsed: number;
  screensLimit: number;
  createdAt?: TimestampLike;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: TimestampLike;
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
  processedAt: TimestampLike;
}

export type RecommendationFilter = "all" | "strong_fit" | "possible_fit" | "not_fit";
