import { NextRequest, NextResponse } from "next/server";
import { redisCommand, redisConfigured } from "@/lib/redis";
import { checkRateLimit } from "@/lib/rate-limit";
import { sameOrigin } from "@/lib/request";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ count: null }, { status: 403 });
  if (process.env.ENABLE_VIEW_COUNTER !== "true" || !redisConfigured()) return NextResponse.json({ count: null });
  try {
    if (!await checkRateLimit(request, "views", 60, 3600)) return NextResponse.json({ count: null }, { status: 429 });
    const counted = request.cookies.get("portfolio-viewed")?.value === "1";
    const result = await redisCommand<number | string | null>([counted ? "GET" : "INCR", "portfolio:views:total"]);
    const count = Number(result || 0);
    if (!Number.isSafeInteger(count) || count < 0) throw new Error("Invalid count");
    const response = NextResponse.json({ count }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set("portfolio-viewed", "1", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 86400, path: "/" });
    return response;
  } catch { return NextResponse.json({ count: null }, { status: 503 }); }
}
