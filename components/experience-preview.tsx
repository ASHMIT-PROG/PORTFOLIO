"use client";

import Link from "next/link";
import { BriefcaseBusiness, GraduationCap, MapPin, ArrowUpRight } from "lucide-react";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import { Section } from "@/components/section";
import { StaggerReveal, StaggerItem } from "@/components/scroll-reveal";

const icons = { work: BriefcaseBusiness, education: GraduationCap };

export function ExperiencePreview() {
  if (experience.length === 0) return null;

  return (
    <Section
      title={site.sections.experience ?? "Experience"}
      id="experience-preview"
      action={
        <Link
          href="/experience"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          View all
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      }
      contentClassName="p-0 sm:p-0"
    >
      <StaggerReveal className="experience-preview-grid">
        {experience.map((entry) => {
          const Icon = icons[entry.icon];
          return (
            <StaggerItem key={entry.id} className="experience-preview-card">
              <div className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                  <Icon aria-hidden="true" className="size-[18px] text-muted-foreground" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-base font-semibold">{entry.title}</h3>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {entry.period}
                    </span>
                  </div>

                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {entry.organization} · {entry.type}
                  </p>

                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin aria-hidden="true" className="size-3 shrink-0" />
                    {entry.location}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {entry.description}
                  </p>

                  {entry.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerReveal>
    </Section>
  );
}
