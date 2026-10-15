import { site } from "@/data/site";
import { getContributions } from "@/lib/github";

export const runtime = "nodejs";
// Allow both eight-second upstream attempts to finish on Vercel.
export const maxDuration = 30;

export async function GET() {
  const contributions = await getContributions(site.githubUsername);
  if (!contributions?.length) {
    return Response.json({ error: "GitHub activity is temporarily unavailable." }, {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    });
  }
  return Response.json({ contributions }, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600" },
  });
}
