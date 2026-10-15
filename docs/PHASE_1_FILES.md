# Phase 1 — Complete source files

All authored source and configuration files are reproduced below without elisions. The generated dependency lockfile is available separately at D:/CODING/Projects/portfolio/pnpm-lock.yaml.

## D:\CODING\Projects\portfolio\.gitignore

````
node_modules/
.next/
out/
.vercel/
.env*
!.env.example
*.tsbuildinfo
next-env.d.ts
.qa/
*.log

````

## D:\CODING\Projects\portfolio\AGENTS.md

````
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

````

## D:\CODING\Projects\portfolio\app\[section]\page.tsx

````
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";

type SectionName = keyof typeof site.placeholders;
function isSection(value: string): value is SectionName { return value in site.placeholders; }
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(site.placeholders).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return isSection(section) ? { title: site.placeholders[section].title } : {};
}

export default async function PlaceholderPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  const content = site.placeholders[section];
  return (
    <section id={section === "experience" ? "achievements" : undefined} className="border-b border-dashed border-border">
      <div className="page-column min-h-[60svh] px-5 py-16 sm:px-6 sm:py-24">
        <h1 className="font-display text-5xl tracking-tight sm:text-6xl">{content.title}</h1>
        <p className="mt-6 max-w-lg leading-7 text-muted-foreground">{content.text}</p>
        {section === "contact" && <Button asChild className="mt-8 rounded-full"><a href={`mailto:${site.email}`}>{site.email}<ArrowUpRight aria-hidden="true" /></a></Button>}
      </div>
    </section>
  );
}

````

## D:\CODING\Projects\portfolio\app\globals.css

````
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: #faf9f6;
  --foreground: #20201e;
  --muted: #eeede9;
  --muted-foreground: #64635e;
  --border: #d9d8d2;
  --accent: #efeee9;
  --primary: #20201e;
  --primary-foreground: #faf9f6;
  --popover: #fdfcf9;
  --popover-foreground: #20201e;
  --ring: #8b8b80;
  --radius: 0.625rem;
  color-scheme: light;
}

.dark {
  --background: #0e0e0d;
  --foreground: #f4f3f0;
  --muted: #171716;
  --muted-foreground: #999994;
  --border: #292927;
  --accent: #1b1b19;
  --primary: #f4f3f0;
  --primary-foreground: #151513;
  --popover: #131312;
  --popover-foreground: #f4f3f0;
  --ring: #a7a79b;
  color-scheme: dark;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-ring: var(--ring);
  --font-sans: var(--font-inter);
  --font-display: var(--font-instrument-serif);
  --font-mono: var(--font-jetbrains-mono);
  --radius-lg: var(--radius);
}

@layer base {
  * { border-color: var(--border); }
  html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
  body { margin: 0; background: var(--background); color: var(--foreground); }
  button, a, input, textarea { -webkit-tap-highlight-color: transparent; }
  button, [role="button"] { cursor: pointer; }
  :focus-visible { outline: 2px solid var(--ring); outline-offset: 5px; }
  ::selection { background: var(--foreground); color: var(--background); }
}

@layer components {
  .page-column { width: calc(100% - 32px); max-width: 1000px; margin-inline: auto; border-inline: 1px dashed var(--border); }
  .blueprint-section { border-block: 1px dashed var(--border); margin-top: 24px; }
  .section-heading { font-family: var(--font-instrument-serif), Georgia, serif; font-size: clamp(2rem, 4vw, 2.5rem); line-height: 1.1; letter-spacing: -0.025em; }
  .nav-link { position: relative; display: inline-flex; align-items: center; min-height: 44px; color: var(--muted-foreground); font-size: 15px; transition: color 150ms ease; }
  .nav-link:hover, .nav-link.is-active { color: var(--foreground); }
  .nav-link.is-active { font-weight: 600; }
  .nav-link.is-active::after { content: ""; position: absolute; bottom: 1px; left: calc(50% - 2px); width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
  .mobile-nav-link { padding: 12px; min-height: 52px; font-size: 18px; border-radius: 6px; }
  .mobile-nav-link:hover { background: var(--accent); }
  .mobile-nav-link.is-active::after { left: auto; right: 14px; bottom: calc(50% - 2px); }
  .skip-link { position: fixed; z-index: 100; top: 8px; left: 16px; padding: 10px 16px; background: var(--foreground); color: var(--background); border-radius: 6px; transform: translateY(-160%); }
  .skip-link:focus { transform: translateY(0); }
}

@media (min-width: 768px) {
  .page-column { width: calc(100% - 48px); }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}

````

## D:\CODING\Projects\portfolio\app\layout.tsx

````
import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { site } from "@/data/site";
import { navigationLabels } from "@/data/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} — Portfolio`, template: `%s — ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} ${mono.variable} font-sans antialiased`}>
        <Providers>
          <div className="relative flex min-h-svh flex-col">
            <div aria-hidden="true" className="page-column pointer-events-none absolute inset-y-0 inset-x-0 -z-0" />
            <a href="#main-content" className="skip-link">{navigationLabels.skip}</a>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="relative flex-1 outline-none">{children}</main>
            <div className="relative"><Footer /></div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

````

## D:\CODING\Projects\portfolio\app\not-found.tsx

````
import Link from "next/link";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <div className="page-column px-5 py-24 sm:px-6"><h1 className="section-heading">{site.notFound.title}</h1><p className="my-6 text-muted-foreground">{site.notFound.text}</p><Button asChild><Link href="/">{site.notFound.action}</Link></Button></div>;
}

````

## D:\CODING\Projects\portfolio\app\page.tsx

````
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <section className="border-b border-dashed border-border">
        <div className="page-column px-5 py-16 sm:px-6 sm:py-24">
          <p className="mb-8 font-mono text-[10px] tracking-[0.18em] text-muted-foreground sm:text-xs">{site.foundation.eyebrow}</p>
          <h1 className="font-display text-6xl leading-[1.05] tracking-tight sm:text-7xl">{site.name}</h1>
          <p className="mt-4 text-base font-medium tracking-wide text-muted-foreground sm:text-xl">{site.role}</p>
          <p className="mt-10 font-display text-3xl italic sm:text-4xl">{site.foundation.heading}</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{site.foundation.note}</p>
        </div>
      </section>
      <Section title={site.foundation.sectionHeading} id="foundation">
        <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{site.foundation.description}</p>
        <Button asChild className="mt-7 rounded-full px-6"><a href={`mailto:${site.email}`}>{site.foundation.action}<ArrowUpRight aria-hidden="true" /></a></Button>
      </Section>
    </>
  );
}

````

## D:\CODING\Projects\portfolio\components.json

````
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}

````

## D:\CODING\Projects\portfolio\components\footer.tsx

````
import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="blueprint-section mt-auto">
      <div className="page-column px-5 py-12 text-center text-sm leading-7 text-muted-foreground sm:py-14">
        <p>{site.footer.credit} <Link href="/" className="font-semibold text-foreground hover:underline underline-offset-4">{site.wordmark}</Link></p>
        <p>© {new Date().getFullYear()} {site.footer.copyright}</p>
      </div>
    </footer>
  );
}

````

## D:\CODING\Projects\portfolio\components\navbar.tsx

````
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { moreNavigation, navigation, navigationLabels, type NavigationItem } from "@/data/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function NavLink({ item, mobile = false, ...props }: { item: NavigationItem; mobile?: boolean } & Omit<React.ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  const active = item.href === "/" ? pathname === "/" : pathname === item.href;
  return (
    <Link {...props} href={item.href} aria-current={active ? "page" : undefined} className={cn("nav-link", mobile && "mobile-nav-link", active && "is-active")}>
      {item.label}
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-dashed border-border bg-background/90 backdrop-blur-xl">
      <div className="page-column flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="font-display text-[38px] leading-none tracking-tight" aria-label={`${site.wordmark} — ${navigation[0].label}`}>
          {site.wordmark}
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <nav aria-label={navigationLabels.main} className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => <NavLink key={item.href} item={item} />)}
            <DropdownMenu>
              <DropdownMenuTrigger className="group nav-link flex items-center gap-2 data-[state=open]:text-foreground">
                {navigationLabels.more}<ChevronDown aria-hidden="true" className="size-4 transition-transform group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {moreNavigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
                      {item.label}{item.external && <ArrowUpRight aria-hidden="true" className="ml-auto size-4" />}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={navigationLabels.open}><Menu aria-hidden="true" /></Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex items-center justify-between">
                  <SheetTitle className="font-display text-4xl">{site.wordmark}</SheetTitle>
                  <SheetClose asChild><Button variant="ghost" size="icon" aria-label={navigationLabels.close}><X aria-hidden="true" /></Button></SheetClose>
                </div>
                <SheetDescription className="sr-only">{navigationLabels.description}</SheetDescription>
                <nav aria-label={navigationLabels.mobile} className="mt-8 flex flex-col gap-2">
                  {navigation.map((item) => <SheetClose asChild key={item.href}><NavLink item={item} mobile /></SheetClose>)}
                  <div className="my-4 border-t border-dashed border-border" />
                  {moreNavigation.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} className="flex min-h-12 items-center justify-between rounded-md px-3 text-muted-foreground hover:bg-accent hover:text-foreground">
                        {item.label}<ArrowUpRight aria-hidden="true" className="size-4" />
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

````

## D:\CODING\Projects\portfolio\components\providers.tsx

````
"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}

````

## D:\CODING\Projects\portfolio\components\section.tsx

````
import { cn } from "@/lib/utils";

export function Section({ title, id, children, className }: { title?: string; id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={title && id ? `${id}-heading` : undefined} className={cn("blueprint-section", className)}>
      {title && <div className="border-b border-dashed border-border"><div className="page-column px-5 py-4 sm:px-6"><h2 id={id ? `${id}-heading` : undefined} className="section-heading">{title}</h2></div></div>}
      <div className="page-column px-5 py-8 sm:px-6 sm:py-10">{children}</div>
    </section>
  );
}

````

## D:\CODING\Projects\portfolio\components\theme-toggle.tsx

````
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { navigationLabels } from "@/data/navigation";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="text-foreground">
      <Sun aria-hidden="true" className="hidden dark:block" />
      <Moon aria-hidden="true" className="block dark:hidden" />
      <span className="sr-only hidden dark:block">{navigationLabels.light}</span>
      <span className="sr-only block dark:hidden">{navigationLabels.dark}</span>
    </Button>
  );
}

````

## D:\CODING\Projects\portfolio\components\ui\button.tsx

````
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        outline: "border border-border bg-background hover:bg-accent",
      },
      size: { default: "h-11 px-5", icon: "size-11" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

````

## D:\CODING\Projects\portfolio\components\ui\dropdown-menu.tsx

````
"use client";

import * as React from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownPrimitive.Root;
const DropdownMenuTrigger = DropdownPrimitive.Trigger;

function DropdownMenuContent({ className, sideOffset = 10, ...props }: React.ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content sideOffset={sideOffset} className={cn("z-50 min-w-44 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl outline-none motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=open]:zoom-in-95", className)} {...props} />
    </DropdownPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof DropdownPrimitive.Item>) {
  return <DropdownPrimitive.Item className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground outline-none focus:bg-accent focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props} />;
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };

````

## D:\CODING\Projects\portfolio\components\ui\sheet.tsx

````
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;

function SheetContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content className={cn("fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-dashed border-border bg-background p-6 shadow-2xl motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:slide-in-from-right motion-safe:data-[state=open]:duration-200", className)} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };

````

## D:\CODING\Projects\portfolio\data\navigation.ts

````
import { site } from "@/data/site";

export type NavigationItem = { label: string; href: string; external?: boolean };

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
];

export const moreNavigation: NavigationItem[] = [
  { label: "Achievements", href: "/experience#achievements" },
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

````

## D:\CODING\Projects\portfolio\data\site.ts

````
export const site = {
  name: "Ashmit Sharma",
  wordmark: "Ashmit",
  initials: "AS",
  role: "Backend & AI/ML Engineer",
  email: "ashmitsha09@gmail.com",
  location: "[location TODO]",
  education: "3rd-year B.Tech CSE at SRM IST",
  description:
    "Ashmit Sharma — Backend & AI/ML Engineer and 3rd-year B.Tech CSE student at SRM Institute of Science and Technology, Kattankulatham.",
  resumeUrl: "/resume.pdf",
  footer: {
    credit: "Designed & Developed by",
    copyright: "All rights reserved.",
  },
  foundation: {
    eyebrow: "PORTFOLIO / UNDER CONSTRUCTION",
    heading: "A space for what I build.",
    note: "TODO — The home page arrives in phase 2.",
    sectionHeading: "The foundation",
    description:
      "TODO — Projects, experience, and more will take shape here. For now, explore the navigation and switch between light and dark.",
    action: "Get in touch",
  },
  placeholders: {
    projects: { title: "Projects", text: "TODO — Project cards and filters arrive in phase 3." },
    experience: { title: "Experience", text: "TODO — The experience timeline and achievements arrive in phase 3." },
    contact: { title: "Contact", text: "TODO — The contact form arrives in phase 3. You can reach me by email in the meantime." },
  },
  notFound: {
    title: "Page not found",
    text: "This page doesn't exist. Head back to the home page.",
    action: "Back home",
  },
} as const;

````

## D:\CODING\Projects\portfolio\eslint.config.mjs

````
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "next-env.d.ts", ".qa/**"]),
]);

````

## D:\CODING\Projects\portfolio\lib\utils.ts

````
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

````

## D:\CODING\Projects\portfolio\next.config.ts

````
import type { NextConfig } from "next";

const nextConfig: NextConfig = { poweredByHeader: false };

export default nextConfig;

````

## D:\CODING\Projects\portfolio\package.json

````
{
  "name": "ashmit-portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "1.3.0",
    "@radix-ui/react-dropdown-menu": "2.2.0",
    "@radix-ui/react-slot": "1.5.0",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "framer-motion": "14.1.0",
    "lucide-react": "1.55.0",
    "next": "16.4.0",
    "next-themes": "0.4.6",
    "react": "19.3.0",
    "react-activity-calendar": "3.2.1",
    "react-dom": "19.3.0",
    "react-icons": "5.7.0",
    "resend": "6.32.1",
    "tailwind-merge": "3.7.0",
    "zod": "4.6.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.3.3",
    "@types/node": "26.6.5",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "eslint": "9.39.5",
    "eslint-config-next": "16.4.0",
    "tailwindcss": "4.3.3",
    "tw-animate-css": "1.4.0",
    "typescript": "6.0.3"
  }
}

````

## D:\CODING\Projects\portfolio\pnpm-workspace.yaml

````
allowBuilds:
  unrs-resolver: false

````

## D:\CODING\Projects\portfolio\postcss.config.mjs

````
const config = { plugins: { "@tailwindcss/postcss": {} } };

export default config;

````

## D:\CODING\Projects\portfolio\public\.gitkeep

````


````

## D:\CODING\Projects\portfolio\README.md

````
# Ashmit Sharma — Portfolio

## Phase 1 of 5

The foundation is complete: Next.js App Router, TypeScript, Tailwind CSS,
shadcn-style Radix primitives, dark and light themes, responsive navigation,
and a shared footer. The 1000px column, serif typography, and dashed dividers
follow the supplied visual reference. Personal copy lives in `data/site.ts`;
navigation lives in `data/navigation.ts`.

The home page currently shows a temporary foundation preview. Projects,
experience, and contact have explicit TODO route shells. They are not the
finished pages. Resume intentionally points to `/resume.pdf`; add your file at
`public/resume.pdf` when ready. No projects, metrics, or testimonials have been invented.

## Run locally

Use Node.js 22 or newer (verified with Node.js 24).

Dependencies are already installed in this workspace. Run:

```powershell
cd D:\CODING\Projects\portfolio
npm run dev
```

Open http://localhost:3000. Expect a near-black page, Ashmit wordmark, desktop
navigation or mobile menu, theme toggle, dashed dividers, TODO content, and footer.

For a fresh checkout, install the locked dependencies with pnpm before running:

```powershell
pnpm install --frozen-lockfile
npm run dev
```

The system npm installation on this computer was missing `promise-retry` for
registry/install commands. Dependencies were installed with bundled pnpm.
The `npm run` scripts work. `pnpm-lock.yaml` records the dependency tree.
TypeScript 6 is pinned because the installed ESLint parser does not support TypeScript 7.
ESLint 9 is pinned to the peer range supported by Next.js's React, import, and accessibility plugins.
`unrs-resolver` uses its prebuilt binary; its optional build script is disabled.

## Verification

```powershell
npm run lint
npm run typecheck
npm run build
```

Browser checks cover 360px, 768px, and 1280px, theme persistence, desktop dropdown,
mobile navigation dismissal, and Escape handling. These are phase 1 checks;
Lighthouse auditing is planned for the completed website.

## Main files

- `app/layout.tsx`: fonts, metadata, providers, and shared layout.
- `app/globals.css`: theme tokens, borders, focus, and reduced-motion styling.
- `app/page.tsx`: temporary phase 1 preview.
- `app/[section]/page.tsx`: temporary route shells, replaced in phase 3.
- `components/navbar.tsx`: desktop navigation and accessible mobile sheet.
- `components/theme-toggle.tsx`: persisted theme switching.
- `components/section.tsx`: reusable section framing.
- `components/footer.tsx`: shared credit and copyright.
- `components/ui/`: local shadcn-style Button, DropdownMenu, and Sheet primitives.
- `components.json`: configuration for adding more shadcn/ui components.
- `data/site.ts`, `data/navigation.ts`: editable content.

## Remaining phases

2. Complete home page, fallback imagery, project slots, stack chips, and quote placeholder.
3. Projects, experience, contact form, remaining data files, and add-project guide.
4. GitHub activity, optional view counter, environment variables, and complete SEO.
5. Final polish, accessibility/performance verification, and Vercel deployment guide.

Work pauses after each phase until you say `next`. No site has been deployed.

````

## D:\CODING\Projects\portfolio\tsconfig.json

````
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}

````

