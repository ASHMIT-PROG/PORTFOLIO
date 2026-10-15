import { z } from "zod";
import { site } from "@/data/site";

export type Contribution = { date: string; count: number; level: number };
const daySchema = z.object({ date: z.iso.date(), contributionCount: z.number().int().nonnegative(), contributionLevel: z.enum(["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"]) });
const responseSchema = z.object({ data: z.object({ user: z.object({ contributionsCollection: z.object({ contributionCalendar: z.object({ totalContributions: z.number().int().nonnegative(), weeks: z.array(z.object({ contributionDays: z.array(daySchema) })) }) }) }) }) });
const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

export async function getContributions(): Promise<Contribution[] | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: "query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}", variables: { login: site.githubUsername } }),
      next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success) return null;
    return parsed.data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap((week) => week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount, level: levels[day.contributionLevel] })));
  } catch { return null; }
}
