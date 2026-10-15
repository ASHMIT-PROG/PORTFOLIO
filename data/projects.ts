export type Project = {
  id: string; title: string; tagline: string; description: string; tech: string[];
  liveUrl?: string; repoUrl?: string; demoVideoUrl?: string; image?: string;
  status: "live" | "in-progress" | "open-source" | "research";
  badge?: string; // Only a verified, real metric.
  featured: boolean; order: number;
};

// Verified against this repository's README, package.json, and homepage metadata.
export const projects: Project[] = [{
  id: "crop-success-compass", title: "Crop Success Compass",
  tagline: "An interactive crop-planning prototype.",
  description: "Explore crop suitability by location and season, with interactive maps and a plant-photo upload flow. Prediction and identification results currently use demo data.",
  tech: ["React", "TypeScript", "Tailwind CSS", "Leaflet"],
  liveUrl: "https://crop-vision-success-finder.lovable.app",
  repoUrl: "https://github.com/ASHMIT-PROG/crop-success-compass",
  status: "live", featured: true, order: 1,
}];

// Copy this complete example into the array and replace every TODO:
// {
//   id: "TODO-project-slug",
//   title: "TODO project title",
//   tagline: "TODO short summary",
//   description: "TODO factual description",
//   tech: ["TODO technology"],
//   liveUrl: "https://TODO.example.com", // Optional; omit for backend/research projects.
//   repoUrl: "https://github.com/ASHMIT-PROG/TODO",
//   demoVideoUrl: "https://TODO.example.com/demo",
//   image: "/projects/TODO-project-slug.webp", // Optional; defaults to a gradient.
//   status: "in-progress",
//   badge: "TODO verified metric", // Omit until you have a real metric.
//   featured: true,
//   order: 2,
// }
export function sortedProjects(items: Project[] = projects) {
  return [...items].sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
}
