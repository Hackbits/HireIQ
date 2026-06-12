const requestCounts = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of requestCounts) {
    if (now > entry.resetAt) {
      requestCounts.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}
