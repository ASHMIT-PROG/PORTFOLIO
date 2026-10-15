"use client";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import type { Contribution } from "@/lib/github";

export function GitHubCalendar({ data }: { data: Contribution[] | null }) {
  const { resolvedTheme } = useTheme();
  if (!data?.length) return <div><div role="img" aria-label={site.activity.unavailableLabel} className="calendar-placeholder">{Array.from({ length: 371 }, (_, i) => <span key={i} />)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"><p>{site.activity.unavailable}</p><a href={site.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-foreground">{site.activity.link}<ArrowUpRight aria-hidden="true" className="size-4" /></a></div></div>;
  return <div className="calendar-scroll" tabIndex={0} role="region" aria-label={site.activity.label}><ActivityCalendar data={data} blockSize={13} blockMargin={4} blockRadius={3} fontSize={13} colorScheme={resolvedTheme === "light" ? "light" : "dark"} theme={{ dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"], light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"] }} labels={{ totalCount: site.activity.total, legend: { less: site.activity.less, more: site.activity.more } }} /></div>;
}
