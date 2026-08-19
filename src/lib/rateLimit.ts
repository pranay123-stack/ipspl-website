import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * RATE LIMITING
 * =============
 * In-memory counters do not work across serverless instances, so this uses
 * Upstash. Behind an interface with a no-op implementation, so the repo runs
 * locally without Redis credentials.
 *
 * If IPS-PL moves to Vercel Pro, Vercel Firewall does this at the platform
 * level — swap `createLimiter` for a pass-through and drop both deps.
 */
export interface RateLimitResult {
  ok: boolean;
  /** Requests permitted per window. */
  limit: number;
  /** Requests left in the current window. */
  remaining: number;
  /** Unix seconds at which the window resets. */
  reset: number;
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
  /** Named so a response can say which limiter produced the verdict. */
  readonly kind: "upstash" | "memory";
}

/** Requests per window, shared by both implementations. */
export const LIMIT = 5;
export const WINDOW_SECONDS = 10 * 60;

function createUpstashLimiter(url: string, token: string): RateLimiter {
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    // Generous for a human filling a form; tight enough to stop a script.
    limiter: Ratelimit.slidingWindow(LIMIT, `${WINDOW_SECONDS} s`),
    prefix: "ipspl:enquiry",
    analytics: false,
  });

  return {
    kind: "upstash",
    async check(key) {
      const { success, limit, remaining, reset } = await limiter.limit(key);
      return {
        ok: success,
        limit,
        remaining,
        reset: Math.ceil(reset / 1000),
        ...(success
          ? {}
          : { retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) }),
      };
    },
  };
}

/**
 * Fallback when Upstash is not configured.
 *
 * This deliberately replaces what used to be a no-op that allowed everything.
 * A single process holds its own counters, so on a multi-instance serverless
 * deployment the effective limit is the window multiplied by the number of
 * warm instances — real protection against a naive script, none against a
 * distributed one. That is strictly better than no limit, and the deployment
 * checklist still treats Upstash as a launch blocker.
 */
function createMemoryLimiter(): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    kind: "memory",
    async check(key) {
      const now = Date.now();
      const windowStart = now - WINDOW_SECONDS * 1000;
      const recent = (hits.get(key) ?? []).filter((t) => t > windowStart);

      // Bound the map so a spray of unique IPs cannot grow it without limit.
      if (hits.size > 10_000) hits.clear();

      const reset = Math.ceil(((recent[0] ?? now) + WINDOW_SECONDS * 1000) / 1000);
      if (recent.length >= LIMIT) {
        return {
          ok: false,
          limit: LIMIT,
          remaining: 0,
          reset,
          retryAfterSeconds: Math.max(1, reset - Math.ceil(now / 1000)),
        };
      }

      recent.push(now);
      hits.set(key, recent);
      return { ok: true, limit: LIMIT, remaining: LIMIT - recent.length, reset };
    },
  };
}

let cached: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (cached) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  cached = url && token ? createUpstashLimiter(url, token) : createMemoryLimiter();
  return cached;
}

/** Headers a client can read to back off politely. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(result.reset),
  };
  if (result.retryAfterSeconds !== undefined) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }
  return headers;
}

/** Client IP from the proxy chain. Vercel always sets x-forwarded-for. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
