import { z } from "zod";

const githubUrl = z.url().refine((value) => new URL(value).origin === "https://github.com");
const count = z.number().int().nonnegative();
const profileSchema = z.object({
  login: z.string(), name: z.string().nullable(), bio: z.string().nullable(),
  avatar_url: z.url().refine((value) => new URL(value).origin === "https://avatars.githubusercontent.com"),
  html_url: githubUrl, public_repos: count, followers: count, following: count,
});
const reposSchema = z.array(z.object({
  id: count, name: z.string(), description: z.string().nullable(), html_url: githubUrl,
  language: z.string().nullable(), stargazers_count: count,
}));

export type GitHubProfile = z.infer<typeof profileSchema> & {
  repos: z.infer<typeof reposSchema>;
  fetchedAt: string;
};

export async function getGitHubProfile(username: string): Promise<GitHubProfile | null> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "ashmit-portfolio-profile" };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  const options = { headers, cache: "no-store" as const, signal: AbortSignal.timeout(8000) };
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, options);
    if (!response.ok) return null;
    const profile = profileSchema.safeParse(await response.json());
    if (!profile.success || profile.data.login.toLowerCase() !== username.toLowerCase()) return null;
    let repos: GitHubProfile["repos"] = [];
    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=3&type=owner`, options);
      if (response.ok) {
        const parsed = reposSchema.safeParse(await response.json());
        if (parsed.success) repos = parsed.data;
      }
    } catch { /* Profile remains useful when the optional repository request fails. */ }
    return { ...profile.data, repos, fetchedAt: new Date().toISOString() };
  } catch {
    return null;
  }
}
