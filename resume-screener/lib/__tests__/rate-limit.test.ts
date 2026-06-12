import { describe, it, expect, vi, afterEach } from "vitest";
import { checkRateLimit } from "../rate-limit";

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit", () => {
  it("allows first request", () => {
    const result = checkRateLimit("test-key", 3, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("allows requests within limit", () => {
    checkRateLimit("key-a", 3, 60_000);
    checkRateLimit("key-a", 3, 60_000);
    const result = checkRateLimit("key-a", 3, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("blocks when exceeding limit", () => {
    checkRateLimit("key-b", 2, 60_000);
    checkRateLimit("key-b", 2, 60_000);
    const result = checkRateLimit("key-b", 2, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks keys independently", () => {
    checkRateLimit("user-1", 1, 60_000);
    const r1 = checkRateLimit("user-1", 1, 60_000);
    expect(r1.allowed).toBe(false);

    const r2 = checkRateLimit("user-2", 1, 60_000);
    expect(r2.allowed).toBe(true);
  });

  it("resets after window expires", () => {
    vi.useFakeTimers();

    checkRateLimit("key-c", 1, 60_000);
    const blocked = checkRateLimit("key-c", 1, 60_000);
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(60_001);

    const reset = checkRateLimit("key-c", 1, 60_000);
    expect(reset.allowed).toBe(true);
  });

  it("returns correct resetAt timestamp", () => {
    vi.useFakeTimers();
    const now = Date.now();

    const result = checkRateLimit("key-d", 5, 30_000);
    expect(result.resetAt).toBe(now + 30_000);
  });
});
