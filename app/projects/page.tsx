import type { Metadata } from "next";
import { site } from "@/data/site";
import { PageHeading } from "@/components/page-heading";
import { ProjectBrowser } from "@/components/project-browser";
export const metadata: Metadata = { title: site.projects.title, description: site.projects.description, alternates: { canonical: "/projects" } };
export default function ProjectsPage() { return <><PageHeading title={site.projects.title} description={site.projects.description} /><ProjectBrowser /></>; }
