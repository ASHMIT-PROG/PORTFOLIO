import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { site, type TextPart } from "@/data/site";
import { sortedProjects } from "@/data/projects";
import { Profile } from "@/components/profile";
import { SocialLinks } from "@/components/social-links";
import { ProjectGrid } from "@/components/project-card";
import { TechStack } from "@/components/tech-stack";
import { GitHubCalendar } from "@/components/github-calendar";
import { ExperiencePreview } from "@/components/experience-preview";
import { Highlights } from "@/components/highlights";
import { getContributions } from "@/lib/github";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = { alternates: { canonical: "/" } };
export const revalidate = 86400;
export default async function Home() {
  const contributions = await getContributions();
  return (
    <>
      <Profile />
      <ScrollReveal direction="up" delay={0.05} duration={0.6}>
        <Section title={site.sections.about} id="about"><ul className="about-list">{site.about.paragraphs.map((paragraph, index) => <li key={index}>{paragraph.map((part: TextPart, i) => part.emphasis ? <strong key={i} className="font-semibold underline decoration-muted-foreground/60 underline-offset-2">{part.text}</strong> : <span key={i}>{part.text}</span>)}</li>)}<li><p>{site.about.focusLabel}</p><ul className="mt-3 space-y-1.5 text-[15px] leading-7 text-muted-foreground sm:text-base">{site.about.focus.map((item) => <li key={item}>{item}</li>)}</ul></li></ul></Section>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.08} duration={0.6}>
        <Section title={site.sections.contact} id="contact" contentClassName="p-0 sm:p-0"><SocialLinks /></Section>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.06} duration={0.6}>
        <Section title={site.sections.projects} id="projects" action={<Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">{site.projects.viewAll}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>} contentClassName="p-0 sm:p-0"><ProjectGrid projects={sortedProjects().slice(0, 4)} /></Section>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.06} duration={0.6}>
        <TechStack />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.06} duration={0.6}>
        <Section title={site.sections.activity} id="github-activity" contentClassName="py-6 sm:px-8"><GitHubCalendar data={contributions} /></Section>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.06} duration={0.6}>
        <ExperiencePreview />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.06} duration={0.6}>
        <Highlights />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.06} duration={0.6}>
        <Section title={site.sections.cta} id="lets-talk" contentClassName="py-16 text-center sm:py-20"><p className="text-base leading-7 text-muted-foreground sm:text-xl">{site.cta.text}</p><Button asChild className="mt-6 h-12 min-w-52 rounded-full px-8 text-base"><Link href="/contact">{site.cta.action}<ArrowRight aria-hidden="true" className="ml-2" /></Link></Button></Section>
      </ScrollReveal>
      <ScrollReveal direction="up" delay={0.12} distance={16} duration={0.7}>
        <Section id="quote" contentClassName="py-14 text-center sm:py-16"><Quote aria-hidden="true" className="mx-auto mb-6 size-8 fill-muted-foreground/50 text-muted-foreground/50" /><blockquote className="mx-auto max-w-2xl font-display text-3xl italic leading-relaxed text-muted-foreground sm:text-5xl">{site.quote.text}</blockquote><div className="mt-7 flex items-center justify-center gap-4"><span className="h-px w-10 bg-border" /><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">{site.quote.author}</p><span className="h-px w-10 bg-border" /></div></Section>
      </ScrollReveal>
    </>
  );
}
