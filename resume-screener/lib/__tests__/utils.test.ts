import { describe, it, expect } from "vitest";
import { cn, toDate } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
});

describe("toDate", () => {
  it("converts ISO string to Date", () => {
    const d = toDate("2024-01-15T10:30:00Z");
    expect(d).toBeInstanceOf(Date);
    expect(d.getFullYear()).toBe(2024);
  });

  it("passes through Date objects", () => {
    const now = new Date();
    expect(toDate(now)).toBe(now);
  });

  it("handles null/undefined gracefully", () => {
    expect(toDate(null)).toBeInstanceOf(Date);
    expect(toDate(undefined)).toBeInstanceOf(Date);
  });
});
