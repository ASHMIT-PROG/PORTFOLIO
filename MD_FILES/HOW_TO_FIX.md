# How To Fix & Change Everything On Your Portfolio

> Latest repair log (2026-10-15): [../HOW_TO_FIX.md](../HOW_TO_FIX.md).

> Complete guide. Every section of the website is covered below with the exact file path and what to change.

---

## Table of Contents

1. [Profile Section (Name, Role, Avatar, Banner)](#1-profile-section)
2. [About Section](#2-about-section)
3. [Social Links (GitHub, LinkedIn, X, Mail, Resume)](#3-social-links)
4. [Projects](#4-projects)
5. [Tech Stack](#5-tech-stack)
6. [GitHub Activity Calendar](#6-github-activity-calendar)
7. [Highlights / Testimonials](#7-highlights--testimonials)
8. [Call To Action ("Let's Talk")](#8-call-to-action)
9. [Quote at Bottom of Home Page](#9-quote)
10. [Experience Page (Internships)](#10-experience-page)
11. [Contact Page](#11-contact-page)
12. [Navigation Bar (Top Menu)](#12-navigation-bar)
13. [Footer](#13-footer)
14. [Colors & Theme (Light/Dark Mode)](#14-colors--theme)
15. [Images & Pictures](#15-all-images--pictures)
16. [SEO (Page Titles, Descriptions, Social Preview)](#16-seo)
17. [View Counter](#17-view-counter)
18. [Fonts](#18-fonts)
19. [Smooth Motion Graphics & Animations](#19-smooth-motion-graphics--animations)
20. [Past Fixes Log](#20-past-fixes-log)

---

## 1. Profile Section

> The top area with your banner, avatar photo, name, role, and education line.

**File:** `data/site.ts`

| What to change | What to edit in the file |
|----------------|------------------------|
| Your full name | `name: "Ashmit Sharma"` |
| Short name in navbar & footer | `wordmark: "Ashmit"` |
| Initials (shown if no avatar photo) | `initials: "AS"` |
| Your role/title | `role: "Backend & AI/ML Engineer"` |
| Education line | `education: "3rd-year B.Tech CSE at SRM IST"` |
| Location | `location: "[CHENNAI]"` (replace with your actual location) |
| Email | `email: "ashmitsha09@gmail.com"` |

**For the avatar photo and banner image → see [Section 15: Images](#15-all-images--pictures)**

---

## 2. About Section

> The bullet-point section on the home page that describes who you are and what you're focused on.

**File:** `data/site.ts` → look for `about: {`

```
about: {
  paragraphs: [
    [{ text: "I'm a " }, { text: "Computer Science undergraduate", emphasis: true }, ...],
    [{ text: "I've gained hands-on experience in " }, ...],
  ],
  focusLabel: "Currently, I'm focused on:",
  focus: [
    "Building end-to-end Machine Learning and Deep Learning projects",
    "Exploring Generative AI, RAG systems, AI Agents, and more",
    ...
  ],
},
```

**How to edit:**
- Each paragraph is an array of `{ text: "...", emphasis: true/false }` objects
- `emphasis: true` makes the text **bold and underlined**
- `focus` is a simple list of strings — add or remove items freely
- `focusLabel` is the heading before the focus list

---

## 3. Social Links

> The row of links (GitHub, LinkedIn, X, Mail, Resume) on the home page.

**File:** `data/socials.ts`

```js
export const socials = [
  { label: "GitHub", icon: "github", href: "https://github.com/ASHMIT-PROG" },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/ashmit-sharma-..." },
  { label: "X", icon: "x", href: "https://x.com/_ASHMIT__SHARMA" },
  { label: "Mail", icon: "mail", href: "mailto:ashmitsha09@gmail.com" },
  { label: "Resume", icon: "resume", href: "/resume.pdf" },
];
```

**How to edit:**
- Change any `href` to update the link URL
- The `icon` must be one of: `github`, `linkedin`, `x`, `mail`, `resume` (these are the only icons available)
- To add a new social, you'd also need to add its icon in `components/social-links.tsx` line 6

---

## 4. Projects

> Project cards on home page and `/projects` page.

**File:** `data/projects.ts`

**To add a new project**, copy this template and fill it in:

```js
{
  id: "my-project-slug",           // unique ID, used in URLs
  title: "My Project Name",
  tagline: "One-line summary",
  description: "Longer description of what it does",
  tech: ["Python", "FastAPI"],     // technologies used
  liveUrl: "https://myproject.com",         // optional — remove if no live site
  repoUrl: "https://github.com/ASHMIT-PROG/my-repo",  // optional
  demoVideoUrl: "https://...",              // optional
  image: "/projects/my-project-slug.webp", // optional — see Images section
  status: "live",                  // options: "live", "in-progress", "open-source", "research"
  featured: true,                  // true = shows on home page
  order: 2,                       // lower number = appears first
}
```

**To change project status labels** (like "Live", "In progress"):
`data/site.ts` → `projects.statuses`

**To change project page title/description:**
`data/site.ts` → `projects.title` and `projects.description`

---

## 4b. Remove the "Project Coming Soon" Placeholder Card

> The grey card with a `+` icon, "ROOM FOR WHAT'S NEXT", and "Project coming soon" text. It appears automatically when you have fewer than 2 projects.

**How it works:** In `components/project-card.tsx` line 29, the `ProjectGrid` component fills empty slots up to 2 cards:

```js
Array.from({ length: Math.max(0, 2 - projects.length) }, (_, i) => <ProjectSlot ... />)
```

So if you have 1 project, you get 1 placeholder. If you have 2+ projects, it disappears on its own.

### Option A: Add more projects (recommended)

Add at least **2 projects** in `data/projects.ts` and the placeholder goes away automatically. See [Section 4](#4-projects) for how.

### Option B: Remove it from the code entirely

**File:** `components/project-card.tsx`

1. **Delete the `ProjectSlot` component** (lines 25–27) — the entire `export function ProjectSlot() { ... }` block
2. **Remove the slot-filling logic** on line 29 — change:
   ```js
   {projects.map((project) => <ProjectCard ... />)}{Array.from({ length: Math.max(0, 2 - projects.length) }, (_, i) => <ProjectSlot key={`slot-${i}`} />)}
   ```
   to just:
   ```js
   {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
   ```
3. You can also remove the unused `Plus` import from line 1 (the other icons are still used)

**Optional cleanup in `data/site.ts`:** The strings `comingSoon`, `hint`, and `slotLabel` inside `projects: { ... }` (line 22) are no longer needed and can be deleted.

---

## 5. Tech Stack

> The animated tech chips on the home page (Python, Java, FastAPI, etc.)

**File:** `data/techstack.ts`

```js
export const techCategories = ["All", "Languages", "Backend", "AI & ML"] as const;

export const techstack = [
  { name: "Python", icon: "python", category: "Languages" },
  { name: "Java", icon: "java", category: "Languages" },
  ...
];
```

**How to edit:**
- Add a new tech by adding an object to the array
- `category` must match one of the categories in `techCategories`
- To add a **new category**, add it to `techCategories`

**⚠️ Important:** The `icon` name must have a matching import in `components/tech-stack.tsx` (line 4-5 and line 11). Available icons right now: `python`, `java`, `fastapi`, `node`, `pytorch`, `tensorflow`

**To add a new tech icon:**
1. Find the icon name from `react-icons` (e.g., `SiReact` from `react-icons/si`)
2. Add the import in `components/tech-stack.tsx` line 4
3. Add the mapping in line 11: `react: SiReact`
4. Use `icon: "react"` in `data/techstack.ts`

---

## 6. GitHub Activity Calendar

> The green contribution graph on the home page.

### Fix: "Activity is unavailable right now"

**Why:** The site needs a GitHub token to fetch your contributions. Without it, it shows a blank grid.

**How to fix:**

1. Go to **https://github.com/settings/tokens/new**
2. Give it a name like `portfolio`
3. Check ONLY the **`read:user`** box (under "user")
4. Click **"Generate token"**
5. Copy the token (starts with `ghp_...`)
6. Open **`.env.local`** in the project root
7. Paste your token:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```
8. **Restart the dev server** (Ctrl+C then `npm run dev`)

**File:** `.env.local` (project root)

### Change calendar colors

**File:** `components/github-calendar.tsx` → line 11

Look for `theme: { dark: [...], light: [...] }` — these are 5 colors from lightest to darkest.

Current colors are GitHub green. To change them, replace the hex codes.

### Change GitHub username

**File:** `data/site.ts` → `githubUsername: "ASHMIT-PROG"`

---

## 7. Highlights / Testimonials

> The scrolling marquee section on home page. Currently empty (hidden when empty).

**File:** `data/highlights.ts`

```js
export const highlights: Highlight[] = [
  // Add entries like this:
  {
    id: "person-1",
    name: "Person Name",
    handle: "@theirhandle",
    text: "What they said about you...",
    url: "https://link-to-original-post"
  },
];
```

This section automatically **hides itself** when the array is empty. Add at least one entry to make it show up.

---

## 8. Call To Action

> The "Have an idea?" section near the bottom of home page with "Let's Talk" button.

**File:** `data/site.ts` → `cta`

```js
cta: {
  text: "Have an idea, a question, or something interesting to build?",
  action: "Let's Talk"
},
```

Change `text` for the message and `action` for the button label.

---

## 9. Quote

> The quote at the very bottom of the home page.

**File:** `data/site.ts` → `quote`

```js
quote: { text: "Do First Feel and think Later", author: "Ashmit" },
```

**Note:** Remove the square brackets `[ ]` around the text and author — they show up literally on the website. Change to:
```js
quote: { text: "Do First Feel and think Later", author: "Ashmit" },
```

---

## 10. Experience Page

> The timeline of internships at `/experience`.

**File:** `data/experience.ts`

**To add a new internship**, add an object like this:

```js
{
  id: "unique-id",
  title: "Your Role",
  organization: "Company Name",
  type: "Internship",
  period: "Jun 2026 – Jul 2026 · 2 mos",
  location: "City, Country · Remote",
  description: "What you did there.",
  skills: ["Skill 1", "Skill 2"],
  icon: "work",   // "work" = briefcase icon, "education" = graduation cap icon
},
```

**To change page title/description:**
`data/site.ts` → `experience.title` and `experience.description`

---

## 11. Contact Page

> The contact form at `/contact`.

**For text/labels:** `data/site.ts` → `contact` section (all the labels, placeholders, error messages)

**For contact form to actually send emails**, you need Resend:
1. Sign up at https://resend.com
2. Get your API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_your_key_here
   RESEND_FROM_EMAIL=Portfolio <hello@your-domain.com>
   ```
4. Restart the dev server

Without Resend, the form falls back to opening the user's email app.

**File:** `.env.local`

---

## 12. Navigation Bar

> The top menu with Home, Projects, Experience, More dropdown.

**File:** `data/navigation.ts`

```js
// Main nav links (visible in the top bar)
export const navigation = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
];

// "More" dropdown items
export const moreNavigation = [
  { label: "Resume", href: "/resume.pdf", external: true },
];
```

**How to edit:**
- Add/remove items from either array
- `external: true` opens the link in a new tab and shows an arrow icon
- For the navbar component itself (styling, layout): `components/navbar.tsx`

---

## 13. Footer

> The bottom of every page with "Designed & Developed by" credit.

**File:** `data/site.ts` → `footer`

```js
footer: { credit: "Designed & Developed by", copyright: "All rights reserved." },
```

The year is auto-generated from the current date.

**For footer layout/styling:** `components/footer.tsx`

---

## 14. Colors & Theme

> Light mode and dark mode colors.

**File:** `app/globals.css` → top of the file

```css
:root {
  --background: #faf9f6;       /* page background (light mode) */
  --foreground: #20201e;       /* main text color */
  --muted: #eeede9;            /* subtle backgrounds (cards, inputs) */
  --muted-foreground: #64635e; /* secondary/grey text */
  --border: #d9d8d2;           /* all borders and dividers */
  --accent: #efeee9;           /* hover backgrounds */
  --primary: #20201e;          /* buttons, strong elements */
  --primary-foreground: #faf9f6; /* text on primary buttons */
  --popover: #fdfcf9;          /* dropdown/popup background */
  --ring: #8b8b80;             /* focus ring color */
}

.dark {
  --background: #0e0e0d;       /* page background (dark mode) */
  --foreground: #f4f3f0;       /* main text color */
  /* ... same variables but dark values ... */
}
```

Change any hex value to change that color across the entire site.

**Banner gradient colors** (the green decorative banner):
`app/globals.css` → search for `.banner-art` (around line 67-69)

**Project card gradient:**
`app/globals.css` → search for `.project-gradient` (around line 82)

---

## 15. All Images & Pictures

| Image | Where to put it | Format | File path |
|-------|----------------|--------|-----------|
| **Profile avatar** | `public/avatar.webp` | `.webp` | Replace this file to change avatar |
| **Top banner** | `public/banner.webp` | `.webp` | Replace this file to change banner |
| **Resume PDF** | `public/resume.pdf` | `.pdf` | Replace this file to update resume |
| **Project thumbnail** | `public/projects/project-id.webp` | `.webp` | Create folder if needed |

### How to change the profile avatar (the photo next to your name)

1. **Get your photo** — any `.jpg`, `.png`, or `.webp` image will work
2. **Convert to `.webp`** — go to https://squoosh.app → drag your image → select **WebP** format → download
3. **Rename** the downloaded file to exactly **`avatar.webp`**
4. **Replace** the file at `public/avatar.webp` — just copy your new `avatar.webp` into the `public/` folder and overwrite the old one
5. **Hard-refresh your browser** — press `Ctrl + Shift + R` (browsers cache images, a normal refresh may still show the old one)

**That's it.** The code in `components/profile.tsx` automatically picks up whatever image is at `public/avatar.webp`. The alt text is set in `data/site.ts` → `avatar: { src: "/avatar.webp", alt: "Ashmit Sharma" }`.

**If it's still not showing your photo:**
- Make sure the file is named exactly `avatar.webp` (not `avatar (1).webp` or `Avatar.webp`)
- Make sure it's in the `public/` folder at the project root, not inside a subfolder
- Try opening `http://localhost:3000/avatar.webp` directly in your browser — if you see the old image, clear your browser cache

**How to convert images to `.webp`:**
Use https://squoosh.app → drag image → select WebP format → download

**For project thumbnails**,  also add `image: "/projects/your-file.webp"` in `data/projects.ts`

**If no avatar/banner file exists:** the site shows a fallback automatically (initials for avatar, green gradient for banner). The code checks if the file exists in `lib/assets.ts`.

**Social preview image** (when sharing link on WhatsApp, Twitter, etc.):
This is auto-generated from code, not a file. Edit `app/opengraph-image.tsx` to change it.

---

## 16. SEO

> Page titles, descriptions, and search engine stuff.

**Page titles and descriptions:**
`data/site.ts` → each section has `title` and `description`

**Site-wide meta title template:**
`app/layout.tsx` → line 17: `title: { default: "Ashmit Sharma — Portfolio", template: "%s — Ashmit Sharma" }`

**Robots.txt rules:** `app/robots.ts`
**Sitemap:** `app/sitemap.ts`
**Canonical URLs:** set in each page's `metadata` export

---

## 17. View Counter

> Shows total page views in the top-right of the profile section. Disabled by default.

**To enable:**
1. Set up an Upstash Redis database at https://upstash.com
2. Add to `.env.local`:
   ```
   ENABLE_VIEW_COUNTER=true
   UPSTASH_REDIS_REST_URL=your_url
   UPSTASH_REDIS_REST_TOKEN=your_token
   ```
3. Restart the dev server

**File:** `.env.local`

---

## 18. Fonts

> The site uses 3 Google Fonts.

**File:** `app/layout.tsx` (lines 11-13)

- **Inter** — body text
- **Instrument Serif** — headings (the fancy serif font)
- **JetBrains Mono** — code/monospace text

To change fonts, update the import and `variable` name in `app/layout.tsx`.

---

## 19. Smooth Motion Graphics & Animations

> All the smooth transitions, hover effects, and scroll animations across the portfolio.

**Files:** `app/globals.css`, `app/page.tsx`, `components/scroll-reveal.tsx`

### What's animated

| Element | Effect | Where to customize |
|---------|--------|--------------------|
| **Section entrances** | ScrollReveal owns opacity and position; duplicate CSS page-enter rules were removed on 2026-10-15 | `components/scroll-reveal.tsx` |
| **Scroll reveal** | Sections animate into view when scrolled to (powered by Framer Motion) | `app/page.tsx` → `<ScrollReveal>` wrappers, `components/scroll-reveal.tsx` for config |
| **Profile avatar** | Scales up on hover with a soft shadow | `app/globals.css` → `.profile-avatar:hover` |
| **Social links** | Lift up and get background highlight on hover | `app/globals.css` → `.social-grid > a:hover` |
| **Project cards** | Lift up 4px on hover, thumbnail zooms in smoothly | `app/globals.css` → `.project-card:hover`, `.group:hover .project-gradient` |
| **Tech chips** | Bounce/rotate on hover (Framer Motion), border glow + shadow on CSS hover | `components/tech-stack.tsx` → `whileHover`, `app/globals.css` → `.tech-chip:hover` |
| **Filter buttons** | Subtle lift on hover | `app/globals.css` → `.filter-button:hover` |
| **Experience cards** | Slide right 6px + left accent bar on hover | `app/globals.css` → `.experience-preview-card:hover` |
| **Skill badges** | Lift up + color change on hover | `app/globals.css` → `.experience-preview-card .inline-flex:hover` |
| **Nav links** | Underline expands from center on hover | `app/globals.css` → `.nav-link::before` and `.nav-link:hover::before` |
| **Mobile nav** | Slides right on hover | `app/globals.css` → `.mobile-nav-link:hover` |
| **CTA button** | Lifts up with shadow on hover | `app/globals.css` → `[data-slot="button"].rounded-full:hover` |
| **Icon links** | Scale up on hover | `app/globals.css` → `.icon-link:hover` |
| **Form inputs** | Focus ring with glow on focus | `app/globals.css` → `.form-input:focus` |
| **Highlights marquee** | Continuous horizontal scroll, pauses on hover | `app/globals.css` → `.marquee-track` |

### How to adjust animation speed

All CSS transitions use `cubic-bezier(0.22, 1, 0.36, 1)` for a smooth, natural feel. To speed up or slow down:
- Change `transition` duration values (e.g., `0.3s` → `0.5s` for slower)
- Change `duration` prop on `<ScrollReveal>` components (currently `0.6`)

### How to disable all animations

Animations automatically respect `prefers-reduced-motion`. Users with reduced motion enabled in their OS will see instant transitions. The CSS rule at the bottom of `app/globals.css` handles this.

To manually disable all animations:
- Remove all `<ScrollReveal>` wrappers in `app/page.tsx`
- ScrollReveal and StaggerItem respect the OS reduced-motion preference; CSS also disables hover movement. There is no separate main page-enter animation.

---

## 20. Past Fixes Log

> What was changed and when, so you remember later.

| Date | What was fixed | File changed |
|------|---------------|-------------|
| 2026-10-13 | Replaced placeholder experience with real LinkedIn internships (ISL + IIIT Allahabad) | `data/experience.ts` |
| 2026-10-13 | Added "Built a Night-to-Day Image Translation model using Pix2Pix GAN" to IIITA description | `data/experience.ts` |
| 2026-10-13 | Removed Achievements section from experience page | `app/experience/page.tsx` |
| 2026-10-13 | Removed Achievements from "More" dropdown | `data/navigation.ts` |
| 2026-10-13 | Changed GitHub activity calendar from grey to GitHub green | `components/github-calendar.tsx` |
| 2026-10-13 | Fixed GitHub activity "unavailable" by creating `.env.local` with `GITHUB_TOKEN` | `.env.local` |
| 2026-10-13 | Removed decorative dot above name in profile section | `components/profile.tsx` — removed the `<Circle>` icon and its import |
| 2026-10-13 | Changed project status from "in-progress" to "live" | `data/projects.ts` |
| 2026-10-13 | Added quote: "Do First Feel and think Later" — Ashmit | `data/site.ts` |
| 2026-10-13 | Changed location to [CHENNAI] | `data/site.ts` |
| 2026-10-14 | Moved Experience section to appear right after GitHub Activity on home page | `app/page.tsx` |
| 2026-10-14 | Added smooth hover animation on profile avatar (scale + shadow) | `app/globals.css` |
| 2026-10-14 | Added smooth hover lift on social links, project cards, experience cards | `app/globals.css` |
| 2026-10-14 | Added nav link hover underline animation (expands from center) | `app/globals.css` |
| 2026-10-14 | Added experience card slide-right + left accent bar on hover | `app/globals.css` |
| 2026-10-14 | Added skill badge hover effect (lift + color) | `app/globals.css` |
| 2026-10-14 | Enhanced tech chip hover (border glow + shadow) | `app/globals.css` |
| 2026-10-14 | Enhanced page-enter stagger animation (10 steps, smoother easing) | `app/globals.css` |
| 2026-10-14 | Added form input focus glow effect | `app/globals.css` |
| 2026-10-14 | Enhanced ScrollReveal durations for smoother scroll animations | `app/page.tsx` |
| 2026-10-14 | Wrapped Highlights section in ScrollReveal | `app/page.tsx` |
| 2026-10-14 | Added CTA button hover lift + shadow | `app/globals.css` |
| 2026-10-14 | Added mobile nav slide-right on hover | `app/globals.css` |
| 2026-10-14 | Documented all motion graphics in HOW_TO_FIX.md Section 19 | `MD_FILES/HOW_TO_FIX.md` |

---

## 🔄 After Any Change

- **Changed a `.ts` or `.tsx` file** → page auto-refreshes (no restart needed)
- **Changed `.env.local`** → you MUST restart the dev server (Ctrl+C then `npm run dev`)
- **Added an image to `public/`** → just refresh the page in your browser


## Repair verification — 2026-10-15

See [the current fix log](../HOW_TO_FIX.md) for all repairs, commands, and verification limits. The server has been started on port 3000. The original guide and history above are preserved.
