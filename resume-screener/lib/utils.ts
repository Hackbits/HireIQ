import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Convert a Firestore Timestamp, ISO string, number, or Date to a Date object */
export function toDate(value: unknown): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "object" && "toDate" in (value as Record<string, unknown>)) {
    return (value as { toDate(): Date }).toDate();
  }
  return new Date(value as string | number);
}
