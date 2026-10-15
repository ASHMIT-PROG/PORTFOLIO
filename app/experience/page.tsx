import type { Metadata } from "next";
import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { experience, type Experience } from "@/data/experience";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: site.experience.title, description: site.experience.description, alternates: { canonical: "/experience" } };

const icons = { work: BriefcaseBusiness, education: GraduationCap };

function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="timeline">
      {items.map((entry) => {
        const Icon = icons[entry.icon];
        return (
          <li key={entry.id} className="relative pb-10 pl-16 last:pb-0">
            <span className="absolute top-0 left-0 flex size-11 items-center justify-center rounded-xl border border-border bg-background">
              <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
            </span>

            <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
              <h2 className="text-lg font-semibold sm:text-xl">{entry.title}</h2>
              <span className="font-mono text-xs text-muted-foreground">{entry.period}</span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {entry.organization} · {entry.type}
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
              {entry.location}
            </p>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">{entry.description}</p>

            {entry.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function ExperiencePage() {
  return (
    <>
      <PageHeading title={site.experience.title} description={site.experience.description} />
      <div className="page-column px-5 py-10 sm:px-6">
        <Timeline items={experience} />
      </div>
    </>
  );
}
