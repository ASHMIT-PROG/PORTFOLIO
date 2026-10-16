import { site } from "@/data/site";
import { getGitHubProfile } from "@/lib/github-profile";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const profile = await getGitHubProfile(site.githubUsername);
  if (!profile) return Response.json({ error: "GitHub’s current profile is temporarily unavailable." }, {
    status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" },
  });
  return Response.json(profile, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=60" } });
}
