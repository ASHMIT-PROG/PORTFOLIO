import { site } from "@/data/site";

export type NavigationItem = { label: string; href: string; external?: boolean };

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
];

export const moreNavigation: NavigationItem[] = [
  { label: "Resume", href: site.resumeUrl, external: true },
];

export const navigationLabels = {
  main: "Main navigation",
  mobile: "Mobile navigation",
  more: "More",
  open: "Open navigation menu",
  close: "Close navigation menu",
  description: "Explore the portfolio and other links.",
  light: "Switch to light mode",
  dark: "Switch to dark mode",
  skip: "Skip to content",
} as const;
