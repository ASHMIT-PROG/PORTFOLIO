import { sortedProjects } from "@/data/projects";
import { ProjectGrid } from "@/components/project-card";

export function ProjectBrowser() {
  return <div className="page-column"><ProjectGrid projects={sortedProjects()} /></div>;
}
