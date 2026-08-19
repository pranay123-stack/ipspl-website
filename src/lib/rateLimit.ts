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
export interface RateLimiter {
  check(key: string): Promise<{ ok: boolean; retryAfterSeconds?: number }>;
}

function createUpstashLimiter(url: string, token: string): RateLimiter {
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    // Generous for a human filling a form; tight enough to stop a script.
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "ipspl:enquiry",
    analytics: false,
  });

  return {
    async check(key) {
      const { success, reset } = await limiter.limit(key);
      return success
        ? { ok: true }
        : { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
    },
  };
}

/** Local development: always allows. */
function createNoopLimiter(): RateLimiter {
  return { async check() { return { ok: true }; } };
}

let cached: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (cached) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  cached = url && token ? createUpstashLimiter(url, token) : createNoopLimiter();
  return cached;
}

/** Client IP from the proxy chain. Vercel always sets x-forwarded-for. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
