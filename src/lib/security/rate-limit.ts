import { lt, sql } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { rateLimits } from "@/lib/db/schema";
import type * as schema from "@/lib/db/schema";

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };
export type RateLimitPolicy = { max: number; windowMs: number };

export const DEFAULT_RATE_LIMIT: RateLimitPolicy = { max: 5, windowMs: 10 * 60 * 1000 };

/** Reads overrides from the environment, ignoring anything that is not a positive number. */
export function rateLimitFromEnv(env: Record<string, string | undefined>): RateLimitPolicy {
  const max = Number(env.RATE_LIMIT_MAX);
  const seconds = Number(env.RATE_LIMIT_WINDOW_SECONDS);
  return {
    max: max > 0 ? max : DEFAULT_RATE_LIMIT.max,
    windowMs: seconds > 0 ? seconds * 1000 : DEFAULT_RATE_LIMIT.windowMs,
  };
}

/**
 * Fixed-window limiter stored in the database: serverless instances share no
 * memory, so an in-process counter would be per-instance and easy to bypass.
 * The upsert is a single atomic statement, which keeps concurrent hits honest.
 */
export async function consumeRateLimit(
  db: LibSQLDatabase<typeof schema>,
  key: string,
  policy: RateLimitPolicy,
  now = Date.now(),
): Promise<RateLimitResult> {
  const windowStartedBefore = now - policy.windowMs;

  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, windowStart: new Date(now) })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.windowStart} <= ${windowStartedBefore} THEN 1 ELSE ${rateLimits.count} + 1 END`,
        windowStart: sql`CASE WHEN ${rateLimits.windowStart} <= ${windowStartedBefore} THEN ${now} ELSE ${rateLimits.windowStart} END`,
      },
    })
    .returning();

  if (!row) throw new Error("Rate limit upsert returned no row");

  // Opportunistic cleanup: expired keys hold (hashed) IPs and should not linger.
  if (Math.random() < 0.05) {
    await db.delete(rateLimits).where(lt(rateLimits.windowStart, new Date(windowStartedBefore)));
  }

  const elapsed = now - row.windowStart.getTime();
  return {
    allowed: row.count <= policy.max,
    retryAfterSeconds: Math.max(1, Math.ceil((policy.windowMs - elapsed) / 1000)),
  };
}
