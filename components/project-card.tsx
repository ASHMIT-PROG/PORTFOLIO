import { ArrowUpRight, Globe, Play, Plus, Sprout } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { site } from "@/data/site";
import type { Project } from "@/data/projects";
import { FallbackImage } from "@/components/fallback-image";

function Thumbnail({ project }: { project: Project }) {
  const fallback = <div className="project-gradient"><div className="project-thumbnail-grid" /><div className="project-preview-content"><Sprout aria-hidden="true" className="size-10 stroke-[1.2]" /><span className="project-preview-title font-display">{project.title}</span><span className="max-w-64 text-xs tracking-wide opacity-75">{project.tagline}</span></div></div>;
  return project.image ? <FallbackImage src={project.image} alt={`${project.title} — ${site.projects.preview}`} sizes="(max-width: 767px) 90vw, 450px" className="project-thumbnail">{fallback}</FallbackImage> : <div className="project-thumbnail" aria-label={project.title}>{fallback}</div>;
}
export function ProjectCard({ project }: { project: Project }) {
  const primaryUrl = project.liveUrl || project.repoUrl || project.demoVideoUrl;
  return <article className="project-card group">
    {primaryUrl ? <a href={primaryUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} — ${project.liveUrl ? site.projects.website : site.projects.repository}`} className="block rounded-xl"><Thumbnail project={project} /></a> : <Thumbnail project={project} />}
    {project.badge && <span className="mt-3 inline-flex rounded-full border border-border px-2.5 py-1 text-xs">{project.badge}</span>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-[22px] font-semibold tracking-tight">{project.title}</h3><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className={`size-1.5 rounded-full ${project.status === "live" ? "bg-emerald-500" : "bg-muted-foreground"}`} />{site.projects.statuses[project.status]}</span></div>
    <p className="mt-0.5 text-sm text-muted-foreground">{project.tagline}</p><p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{project.description}</p>
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6"><ul className="flex flex-wrap gap-1.5">{project.tech.map((tech) => <li key={tech} className="rounded-lg border border-border bg-muted/50 px-2 py-1 text-xs">{tech}</li>)}</ul><div className="flex items-center gap-1 text-muted-foreground">
      {project.demoVideoUrl && <a className="icon-link" href={project.demoVideoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${site.projects.demo}: ${project.title}`}><Play aria-hidden="true" className="size-5" /></a>}
      {project.liveUrl && <a className="icon-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${site.projects.website}: ${project.title}`}><Globe aria-hidden="true" className="size-5" /></a>}
      {project.repoUrl && <a className="icon-link" href={project.repoUrl} target="_blank" rel="noopener noreferrer" aria-label={`${site.projects.repository}: ${project.title}`}><SiGithub aria-hidden="true" className="size-5" /></a>}
    </div></div>
  </article>;
}
export function ProjectSlot() {
  return <article className="project-card"><div className="project-thumbnail slot-thumbnail"><div className="project-thumbnail-grid" /><span className="relative flex size-14 items-center justify-center rounded-full border border-foreground/15"><Plus aria-hidden="true" className="size-6 stroke-1 text-muted-foreground" /></span><span className="relative mt-5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">{site.projects.slotLabel}</span></div><h3 className="mt-4 flex items-center justify-between text-[22px] font-semibold tracking-tight">{site.projects.comingSoon}<ArrowUpRight aria-hidden="true" className="size-5 text-muted-foreground/40" /></h3><p className="mt-2 font-mono text-xs leading-6 text-muted-foreground">{site.projects.hint}</p></article>;
}
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}{Array.from({ length: Math.max(0, 2 - projects.length) }, (_, i) => <ProjectSlot key={`slot-${i}`} />)}</div>;
}
