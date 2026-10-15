# Portfolio File Map

> Quick reference so you know exactly which file to open when you want to change something.

---

## 📁 Data Files — `data/`

These are the **single source of truth** for all content. Edit these first when updating text, links, or entries.

| File | What It Controls | Common Edits |
|------|-----------------|--------------|
| `data/site.ts` | Your name, role, email, avatar, banner, about section text, page titles/descriptions, button labels, quote, and all UI copy | Change your name, role, bio, email, quote |
| `data/experience.ts` | Experience / internship entries on `/experience` | Add/remove/edit internships — each entry has: `title`, `organization`, `type`, `period`, `location`, `description`, `skills` |
| `data/projects.ts` | Project cards shown on home page and `/projects` | Add/remove projects — each has: `title`, `tagline`, `description`, `tech`, `liveUrl`, `repoUrl`, `status`, etc. |
| `data/navigation.ts` | Top navbar links + "More" dropdown items | Add/remove nav links, change the "More" dropdown menu items |
| `data/socials.ts` | Social links (GitHub, LinkedIn, X, Mail, Resume) shown in the contact section | Update social URLs or add new social platforms |
| `data/techstack.ts` | Tech stack icons on the home page | Add/remove technologies and categories |
| `data/highlights.ts` | Testimonials / highlights marquee on home page | Add real testimonials with source URLs |

---

## 📄 Pages — `app/`

Each folder = a route on your site.

| File | Route | What It Shows |
|------|-------|--------------|
| `app/page.tsx` | `/` (Home) | Profile banner, about, contact links, projects preview, tech stack, GitHub activity, highlights, CTA, quote |
| `app/experience/page.tsx` | `/experience` | Timeline of internships/experience from `data/experience.ts` |
| `app/projects/page.tsx` | `/projects` | Full grid of all projects from `data/projects.ts` |
| `app/contact/page.tsx` | `/contact` | Contact form |
| `app/not-found.tsx` | 404 page | "Page not found" message |
| `app/layout.tsx` | All pages | Root layout — wraps every page with navbar, footer, fonts, theme provider |
| `app/globals.css` | All pages | All styles — colors (light/dark), component styles, layout utilities, animations |
| `app/icon.tsx` | Browser tab | Favicon / tab icon |
| `app/opengraph-image.tsx` | Social sharing | OG image when you share links on social media |
| `app/robots.ts` | SEO | `robots.txt` rules |
| `app/sitemap.ts` | SEO | Sitemap generation |

---

## 🧩 Components — `components/`

Reusable UI pieces used across pages.

| File | What It Renders |
|------|----------------|
| `components/navbar.tsx` | Top navigation bar + mobile hamburger menu + "More" dropdown |
| `components/footer.tsx` | Bottom footer with credits |
| `components/profile.tsx` | Hero section — banner image, avatar, name, role, education |
| `components/page-heading.tsx` | Page title + description used on `/experience`, `/projects`, `/contact` |
| `components/section.tsx` | Reusable section wrapper with heading and dashed borders |
| `components/project-card.tsx` | Individual project card + the project grid |
| `components/project-browser.tsx` | Project filtering (by tech) on `/projects` |
| `components/social-links.tsx` | Social link icons grid |
| `components/tech-stack.tsx` | Tech stack section with filter buttons and animated icons |
| `components/github-calendar.tsx` | GitHub contribution calendar |
| `components/highlights.tsx` | Marquee / testimonials carousel |
| `components/contact-form.tsx` | Contact form with validation |
| `components/theme-toggle.tsx` | Light / dark mode toggle button |
| `components/view-counter.tsx` | Page view counter |
| `components/fallback-image.tsx` | Image with fallback when image file is missing |
| `components/providers.tsx` | Theme provider wrapper |

### UI Primitives — `components/ui/`

| File | What It Is |
|------|-----------|
| `components/ui/button.tsx` | Button component |
| `components/ui/dropdown-menu.tsx` | Dropdown menu (used in "More" nav) |
| `components/ui/sheet.tsx` | Slide-out sheet (used for mobile nav) |

---

## 🔧 Utilities — `lib/`

| File | Purpose |
|------|---------|
| `lib/utils.ts` | `cn()` helper for merging class names |
| `lib/github.ts` | Fetches GitHub contribution data |
| `lib/assets.ts` | Checks if public assets (avatar, banner) exist |
| `lib/site-url.ts` | Resolves site URL for metadata |
| `lib/contact-schema.ts` | Zod schema for contact form validation |
| `lib/request.ts` | Request utilities |
| `lib/rate-limit.ts` | Rate limiting for contact form API |
| `lib/redis.ts` | Redis client (for view counter / rate limiting) |

---

## 📂 Other Root Files

| File | Purpose |
|------|---------|
| `public/` | Static assets — put images here (avatar.webp, banner.webp, resume.pdf, project screenshots) |
| `.env.example` | Example environment variables |
| `next.config.ts` | Next.js configuration |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `postcss.config.mjs` | PostCSS config |
| `eslint.config.mjs` | ESLint config |

---

## 🔄 Common Tasks — Quick Reference

| I want to... | Edit this file |
|--------------|---------------|
| Change my name / role / bio | `data/site.ts` |
| Update the "About" section text | `data/site.ts` → `about.paragraphs` and `about.focus` |
| Add a new internship / experience | `data/experience.ts` — add a new object to the array |
| Add a new project | `data/projects.ts` — copy the template at the bottom of the file |
| Change nav links | `data/navigation.ts` |
| Update social links | `data/socials.ts` |
| Change the quote | `data/site.ts` → `quote.text` and `quote.author` |
| Change colors / theme | `app/globals.css` → `:root` (light) and `.dark` (dark) |
| Add a new tech to the stack | `data/techstack.ts` |
| Change the resume link | `data/site.ts` → `resumeUrl` |
| Upload a new avatar | Replace `public/avatar.webp` |
| Upload a new banner | Replace `public/banner.webp` |
| Change page titles / SEO | `data/site.ts` → relevant section's `title` and `description` |
