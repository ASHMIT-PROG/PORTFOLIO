"use client";
import { useEffect, useState } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { site } from "@/data/site";
import type { Contribution } from "@/lib/github";

export function GitHubCalendar() {
  const { resolvedTheme } = useTheme();
  const [activity, setActivity] = useState<Contribution[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // Stop a stalled request while allowing time for both server-side sources.
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    let cancelled = false;
    async function refresh() {
      try {
        const response = await fetch("/api/github", { signal: controller.signal });
        if (!response.ok) throw new Error("GitHub activity unavailable");
        const result = await response.json() as { contributions: Contribution[] };
        if (!Array.isArray(result.contributions) || !result.contributions.length) throw new Error("Empty calendar");
        if (!cancelled) {
          setActivity(result.contributions);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        window.clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      }
    }
    void refresh();
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  const hasActivity = Boolean(activity?.length);
  const stats = activity?.length ? [
    { label: "Contributions", value: activity.reduce((sum, day) => sum + day.count, 0) },
    { label: "Active days", value: activity.filter((day) => day.count > 0).length },
    { label: "Best day", value: Math.max(...activity.map((day) => day.count)) },
  ] : [];

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="font-medium">@{site.githubUsername}</p><p className="mt-1 text-sm text-muted-foreground">A year of building, learning, and contributing.</p></div>
      <a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">{site.activity.link}<ArrowUpRight aria-hidden="true" className="size-4" /></a>
    </div>
    {hasActivity && <dl className="grid grid-cols-3 gap-3">{stats.map((stat) => <div key={stat.label} className="rounded-xl border border-border p-3 sm:p-4"><dd className="text-2xl font-semibold tabular-nums sm:text-3xl">{stat.value.toLocaleString("en-US")}</dd><dt className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</dt></div>)}</dl>}
    {hasActivity ? <div className="calendar-scroll" tabIndex={0} role="region" aria-label={site.activity.label}><ActivityCalendar data={activity!} blockSize={13} blockMargin={4} blockRadius={3} fontSize={13} colorScheme={resolvedTheme === "light" ? "light" : "dark"} theme={{ dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"], light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"] }} labels={{ totalCount: site.activity.total, legend: { less: site.activity.less, more: site.activity.more } }} /></div> : <div role="img" aria-label={loading ? "Loading GitHub activity" : site.activity.unavailableLabel} className="calendar-placeholder">{Array.from({ length: 371 }, (_, i) => <span key={i} />)}</div>}
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
      <p role="status">{loading ? "Updating activity…" : failed ? (hasActivity ? "Showing the last available activity. Try refreshing shortly." : site.activity.unavailable) : "Contributions over the past year"}</p>
      <button type="button" disabled={loading} onClick={() => { setLoading(true); setAttempt((value) => value + 1); }} className="inline-flex min-h-11 items-center gap-2 hover:text-foreground disabled:opacity-50"><RefreshCw aria-hidden="true" className={`size-3.5 ${loading ? "motion-safe:animate-spin" : ""}`} />{hasActivity ? "Refresh activity" : "Try again"}</button>
    </div>
  </div>;
}
