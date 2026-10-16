import { site } from "@/data/site";

export type ContactIcon = "github" | "linkedin" | "x" | "mail" | "resume";
export type ContactSocial = {
  label: string;
  icon: ContactIcon;
  href: string;
  preview?: {
    title: string;
    eyebrow: string;
    actionLabel: string;
    handle?: string;
    headline?: string;
    bio?: string;
    avatar?: { src: string; alt: string };
    fileType?: string;
    downloadName?: string;
  };
};

// Fallback labels only; social previews load current data from the provider.
const xUrl = "https://x.com/_ASHMIT__SHARMA";

export const socials: ContactSocial[] = [
  { label: "GitHub", icon: "github", href: site.githubUrl, preview: {
    title: site.name, eyebrow: "GitHub / Current profile", handle: `@${site.githubUsername}`,
    actionLabel: "View GitHub Profile",
  } },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/ashmit-sharma-9a69b1325/?isSelfProfile=true" },
  { label: "X", icon: "x", href: xUrl },
  { label: "Mail", icon: "mail", href: `mailto:${site.email}`, preview: {
    title: "Let’s build something together.", eyebrow: "Mail / Start a conversation",
    handle: site.email, bio: site.cta.text, actionLabel: "Send Email",
  } },
  { label: "Resume", icon: "resume", href: site.resumeUrl, preview: {
    title: `${site.name} — Resume`, eyebrow: "Resume / The document", headline: site.role,
    bio: "A closer look at my experience and background.", fileType: "PDF", downloadName: "Ashmit-Sharma-Resume.pdf",
    actionLabel: "View Resume",
  } },
];
