"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, RefreshCw, Star, Users } from "lucide-react";
import type { ContactSocial } from "@/data/socials";
import type { GitHubProfile } from "@/lib/github-profile";
import { FallbackImage } from "@/components/fallback-image";


let githubRequest: Promise<GitHubProfile> | null = null;
let githubExpires = 0;
function loadGitHub() {
  if (!githubRequest || Date.now() >= githubExpires) {
    githubExpires = Date.now() + 300_000;
    githubRequest = fetch("/api/contact/github", { signal: AbortSignal.timeout(15000) }).then(async (response) => {
      if (!response.ok) throw new Error("GitHub unavailable");
      return await response.json() as GitHubProfile;
    }).catch((error) => { githubRequest = null; throw error; });
  }
  return githubRequest;
}

export function GitHubProfilePreview({ item, titleId }: { item: ContactSocial; titleId: string }) {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    void loadGitHub().then((data) => { if (!cancelled) setProfile(data); }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [attempt]);

  if (!item.preview) return null;
  return <>
    <div className="contact-github-tabs" aria-hidden="true"><span>Overview</span><span>Repositories {profile?.public_repos ?? ""}</span></div>
    {profile ? <>
      <div className="contact-preview-identity contact-stagger">
        <FallbackImage src={profile.avatar_url} alt={profile.name || profile.login} sizes="64px" className="contact-preview-avatar"><span>{profile.login.slice(0, 2)}</span></FallbackImage>
        <div className="min-w-0"><h3 id={titleId} className="contact-preview-title">{profile.name || profile.login}</h3><p className="contact-preview-handle">{profile.login}</p></div>
      </div>
      {profile.bio && <p className="contact-preview-bio">{profile.bio}</p>}
      <div className="contact-github-stats"><span><Users aria-hidden="true" />{profile.followers} followers · {profile.following} following</span><span><BookOpen aria-hidden="true" />{profile.public_repos} public repositories</span></div>
      {profile.repos.length > 0 && <div className="contact-github-repos"><p>Recently updated</p>{profile.repos.map((repo) => <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"><span className="contact-repo-name"><BookOpen aria-hidden="true" />{repo.name}<ArrowUpRight aria-hidden="true" /></span>{repo.description && <span className="contact-repo-description">{repo.description}</span>}<span className="contact-repo-meta">{repo.language}<span><Star aria-hidden="true" />{repo.stargazers_count}</span></span></a>)}</div>}
      <p className="contact-live-status" title="Current public API data; cached briefly between visits."><span aria-hidden="true" className="contact-live-dot" />From GitHub · checked {new Date(profile.fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
    </> : <div className="contact-provider-fallback"><h3 id={titleId}>{item.preview.title}</h3><p>{item.preview.handle}</p><p role="status">{failed ? "GitHub couldn’t load its current profile. Open the profile directly or try again." : "Loading current GitHub profile…"}</p>{failed && <button type="button" className="contact-secondary-action" onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}><RefreshCw aria-hidden="true" />Try again</button>}</div>}
    <div className="contact-preview-actions"><a className="contact-primary-action" href={item.href} target="_blank" rel="noopener noreferrer">View GitHub Profile<ArrowUpRight aria-hidden="true" /></a></div>
  </>;
}
