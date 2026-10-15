"use client";
import { useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { highlights } from "@/data/highlights";
import { site } from "@/data/site";
import { Section } from "@/components/section";

export function Highlights() {
  const [paused, setPaused] = useState(false);
  if (!highlights.length) return null;
  return <Section title={site.sections.highlights} id="highlights" action={<button type="button" className="icon-link" aria-label={paused ? site.highlights.play : site.highlights.pause} onClick={() => setPaused(!paused)}>{paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}</button>} contentClassName="overflow-hidden px-0 sm:px-0">
    <div className="marquee-mask"><div className="marquee-track" style={{ animationPlayState: paused ? "paused" : undefined }}>{[0, 1].map((copy) => <div className={`marquee-group ${copy ? "marquee-copy" : ""}`} key={copy} aria-hidden={copy ? true : undefined}>{highlights.map((highlight) => <a href={highlight.url} key={highlight.id} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined} className="w-80 shrink-0 rounded-xl border border-border bg-muted/40 p-5"><div className="flex items-center justify-between gap-3"><strong className="text-sm">{highlight.name}</strong><ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground" /></div><p className="mt-1 text-xs text-muted-foreground">{highlight.handle}</p><p className="mt-4 text-sm leading-6">{highlight.text}</p></a>)}</div>)}</div></div>
  </Section>;
}
