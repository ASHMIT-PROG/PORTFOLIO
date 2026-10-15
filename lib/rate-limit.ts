import { createHash } from "node:crypto";
import { redisCommand, redisConfigured } from "@/lib/redis";
const buckets = new Map<string, { count: number; expires: number }>();
const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";

export async function checkRateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  // Vercel supplies this header at its proxy. Outside Vercel use a shared bucket;
  // arbitrary client-supplied forwarded headers are never trusted.
  const address = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown" : "local";
  const key = `portfolio:${scope}:${createHash("sha256").update(address).digest("hex")}`;
  if (redisConfigured()) return (await redisCommand<number>(["EVAL", script, 1, key, windowSeconds])) <= limit;
  const now = Date.now();
  for (const [id, bucket] of buckets) if (bucket.expires <= now) buckets.delete(id);
  const bucket = buckets.get(key) || { count: 0, expires: now + windowSeconds * 1000 };
  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count <= limit;
}
