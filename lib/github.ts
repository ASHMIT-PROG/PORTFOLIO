import { z } from "zod";

export type Contribution = { date: string; count: number; level: number };
const daySchema = z.object({ date: z.iso.date(), contributionCount: z.number().int().nonnegative(), contributionLevel: z.enum(["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"]) });
const responseSchema = z.object({ data: z.object({ user: z.object({ contributionsCollection: z.object({ contributionCalendar: z.object({ totalContributions: z.number().int().nonnegative(), weeks: z.array(z.object({ contributionDays: z.array(daySchema) })) }) }) }) }) });
const contributionsSchema = z.array(z.object({ date: z.iso.date(), count: z.number().int().nonnegative(), level: z.number().int().min(0).max(4) })).min(1);
const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

async function getAuthenticatedContributions(username: string, token: string): Promise<Contribution[] | null> {
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "portfolio-contributions" },
      body: JSON.stringify({ query: "query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}", variables: { login: username } }),
      // Cache only validated responses at /api/github, never upstream error payloads.
      cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.warn(`[github] GraphQL returned HTTP ${response.status}; trying the public calendar.`);
      return null;
    }
    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success) {
      console.warn("[github] Invalid GraphQL contribution data; trying the public calendar.");
      return null;
    }
    return parsed.data.data.user.contributionsCollection.contributionCalendar.weeks.flatMap((week) => week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount, level: levels[day.contributionLevel] })));
  } catch {
    console.warn("[github] GraphQL request failed; trying the public calendar.");
    return null;
  }
}

function readAttributes(tag: string): Record<string, string> {
  return Object.fromEntries(Array.from(tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g), (match) => [match[1], match[2] ?? match[3]]));
}

function parsePublicContributions(html: string): Contribution[] | null {
  // GitHub's public calendar stores dates/levels on cells and counts in linked tooltips.
  const counts = new Map<string, number>();
  for (const tooltip of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = readAttributes(tooltip[1]).for;
    const count = tooltip[2].trim().match(/^(No|[\d,]+) contributions?\b/);
    if (id && count) counts.set(id, count[1] === "No" ? 0 : Number(count[1].replaceAll(",", "")));
  }

  const days = [];
  for (const cell of html.matchAll(/<td\b([^>]*)>/g)) {
    const attributes = readAttributes(cell[1]);
    if (!attributes["data-date"]) continue;
    days.push({
      date: attributes["data-date"],
      count: counts.get(attributes.id),
      level: /^[0-4]$/.test(attributes["data-level"] ?? "") ? Number(attributes["data-level"]) : NaN,
    });
  }

  const parsed = contributionsSchema.safeParse(days);
  if (!parsed.success) return null;
  // HTML rows are grouped by weekday; the calendar component needs chronological order.
  const contributions = parsed.data.sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(contributions.map((day) => day.date)).size !== contributions.length) return null;
  return contributions;
}

async function getPublicContributions(username: string): Promise<Contribution[] | null> {
  try {
    const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: { Accept: "text/html", "Accept-Language": "en-US", "User-Agent": "portfolio-contributions" },
      cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.warn(`[github] Public calendar returned HTTP ${response.status}.`);
      return null;
    }
    const contributions = parsePublicContributions(await response.text());
    if (!contributions) console.warn("[github] Public calendar contained invalid or missing contribution data.");
    return contributions;
  } catch {
    console.warn("[github] Public calendar request failed.");
    return null;
  }
}

export async function getContributions(username: string): Promise<Contribution[] | null> {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    const contributions = await getAuthenticatedContributions(username, token);
    if (contributions?.length) return contributions;
  }
  return getPublicContributions(username);
}
