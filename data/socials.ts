import { site } from "@/data/site";
export const socials = [
  { label: "GitHub", icon: "github", href: site.githubUrl },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/ashmit-sharma-9a69b1325/" },
  { label: "X", icon: "x", href: "https://x.com/_ASHMIT__SHARMA" },
  { label: "Mail", icon: "mail", href: `mailto:${site.email}` },
  { label: "Resume", icon: "resume", href: site.resumeUrl },
] as const;
