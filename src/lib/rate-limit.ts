// Rate limiting for the contact form.
// - With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set (Vercel env), limits are shared by
//   every serverless instance: 3 messages per 10 minutes per IP, 30 per day site-wide.
// - Without them, a per-instance in-memory fallback applies the per-IP limit. Best effort only
//   (each instance keeps its own count), but it stops casual hammering with zero setup.
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export type LimitResult = { ok: true } | { ok: false; retryAfter: number }; // seconds

const PER_IP = { count: 3, windowMs: 10 * 60 * 1000 };

const upstash =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? (() => {
        const redis = Redis.fromEnv();
        return {
          ip: new Ratelimit({ redis, prefix: 'contact:ip', limiter: Ratelimit.slidingWindow(PER_IP.count, '10 m') }),
          daily: new Ratelimit({ redis, prefix: 'contact:all', limiter: Ratelimit.fixedWindow(30, '1 d') }),
        };
      })()
    : null;

// ---------------------------------------------------------------- in-memory fallback
const hits = new Map<string, number[]>();

function memoryLimit(key: string): LimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < PER_IP.windowMs);
  if (recent.length >= PER_IP.count) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((recent[0] + PER_IP.windowMs - now) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    // Keep memory bounded on a long-lived instance.
    for (const [k, v] of hits) if (!v.some((t) => now - t < PER_IP.windowMs)) hits.delete(k);
  }
  return { ok: true };
}

/** The visitor's IP as Vercel (or any proxy) reports it. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown').trim();
}

export async function limitContact(ip: string): Promise<LimitResult> {
  if (!upstash) return memoryLimit(ip);
  try {
    const [perIp, all] = await Promise.all([upstash.ip.limit(ip), upstash.daily.limit('site')]);
    if (!perIp.success) return { ok: false, retryAfter: Math.max(1, Math.ceil((perIp.reset - Date.now()) / 1000)) };
    if (!all.success) return { ok: false, retryAfter: Math.max(1, Math.ceil((all.reset - Date.now()) / 1000)) };
    return { ok: true };
  } catch {
    // Redis unreachable: degrade to the per-instance limit rather than blocking real messages.
    return memoryLimit(ip);
  }
}
