# 🏗️ Project Flow — Ashmit's Portfolio

> A complete, structured breakdown of how every piece of the portfolio works — from the first request to the final pixel on screen.

---

## Table of Contents

- [1. Big Picture Overview](#1-big-picture-overview)
- [2. Tech Stack at a Glance](#2-tech-stack-at-a-glance)
- [3. Folder Structure Explained](#3-folder-structure-explained)
- [4. Application Startup Flow](#4-application-startup-flow)
- [5. Data Layer — The Single Source of Truth](#5-data-layer--the-single-source-of-truth)
- [6. Page-by-Page Breakdown](#6-page-by-page-breakdown)
  - [6.1 Home Page (/)](#61-home-page-)
  - [6.2 Projects Page (/projects)](#62-projects-page-projects)
  - [6.3 Experience Page (/experience)](#63-experience-page-experience)
  - [6.4 Contact Page (/contact)](#64-contact-page-contact)
  - [6.5 404 — Not Found](#65-404--not-found)
- [7. Component Architecture](#7-component-architecture)
- [8. API Routes — The Backend Layer](#8-api-routes--the-backend-layer)
- [9. Styling System](#9-styling-system)
- [10. SEO & Metadata Flow](#10-seo--metadata-flow)
- [11. External Services & Environment Variables](#11-external-services--environment-variables)
- [12. Request Lifecycle — Full Picture](#12-request-lifecycle--full-picture)

---

## 1. Big Picture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                                │
│  ┌───────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Home (/) │  │ /projects  │  │ /experience  │  │  /contact    │  │
│  └─────┬─────┘  └─────┬──────┘  └──────┬───────┘  └──────┬───────┘  │
└────────┼───────────────┼───────────────┼──────────────────┼──────────┘
         │               │               │                  │
         ▼               ▼               ▼                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      NEXT.js 16 SERVER                               │
│                                                                      │
│  ┌─────────────────────────────────────────┐                         │
│  │         Root Layout (layout.tsx)        │  ← Wraps EVERY page     │
│  │  • Google Fonts (Inter, Instrument      │                         │
│  │    Serif, JetBrains Mono)               │                         │
│  │  • Theme Provider (dark/light)          │                         │
│  │  • Framer Motion Config                 │                         │
│  │  • Navbar + Footer                      │                         │
│  └─────────────────────────────────────────┘                         │
│                                                                      │
│  ┌─────────────────┐  ┌────────────────────┐                         │
│  │  API: /contact  │  │   API: /views      │                         │
│  │  (Resend email) │  │  (Redis counter)   │                         │
│  └────────┬────────┘  └────────┬───────────┘                         │
└───────────┼─────────────────────┼────────────────────────────────────┘
            │                     │
            ▼                     ▼
     ┌──────────┐          ┌──────────┐        ┌──────────────┐
     │  Resend  │          │  Redis   │        │ GitHub API   │
     │  (Email) │          │ (Upstash)│        │ (GraphQL)    │
     └──────────┘          └──────────┘        └──────────────┘
```

**In simple terms:** This is a personal portfolio website built with Next.js 16. When someone visits the site, Next.js renders the page on the server (SSR), sends the HTML to the browser, and then React "hydrates" interactive parts (like the theme toggle, filters, and contact form) on the client side.

---

## 2. Tech Stack at a Glance

| Layer            | Technology                                         | Why it's used                                       |
| ---------------- | -------------------------------------------------- | --------------------------------------------------- |
| **Framework**    | Next.js 16 (App Router)                            | Server-side rendering, file-based routing, API routes |
| **Language**     | TypeScript 6                                       | Type safety across the entire codebase              |
| **UI Library**   | React 19                                           | Component-based UI development                      |
| **Styling**      | Tailwind CSS 4 + Vanilla CSS                       | Utility-first styling with custom component styles  |
| **Animations**   | Framer Motion 14                                   | Smooth micro-animations on tech chips & layouts     |
| **Icons**        | Lucide React + React Icons (SI/FA)                 | Consistent icon system                              |
| **UI Primitives**| Radix UI (Dialog, Dropdown, Slot)                  | Accessible, unstyled headless components            |
| **Validation**   | Zod 4                                              | Schema validation for contact form & GitHub data    |
| **Email**        | Resend                                             | Transactional emails from the contact form          |
| **Database**     | Upstash Redis (optional)                           | View counter persistence & rate limiting            |
| **Theming**      | next-themes                                        | Dark/light mode with zero-flash switching           |
| **Calendar**     | react-activity-calendar                            | GitHub contribution heatmap visualization           |
| **Package Mgr**  | pnpm                                               | Fast, disk-efficient package management             |

---

## 3. Folder Structure Explained

```
portfolio/
│
├── app/                          # 🟢 Next.js App Router — all routes live here
│   ├── layout.tsx                # Root layout: fonts, providers, navbar, footer
│   ├── page.tsx                  # Home page (/)
│   ├── globals.css               # Global styles, design tokens, component CSS
│   ├── not-found.tsx             # Custom 404 page
│   ├── icon.tsx                  # Dynamic favicon (serves avatar.webp)
│   ├── opengraph-image.tsx       # Dynamic OG image generated at build time
│   ├── robots.ts                 # Search engine rules
│   ├── sitemap.ts                # XML sitemap for SEO
│   │
│   ├── projects/
│   │   └── page.tsx              # /projects — all projects with filters
│   ├── experience/
│   │   └── page.tsx              # /experience — timeline of internships
│   ├── contact/
│   │   └── page.tsx              # /contact — form + email link
│   ├── [section]/                # (Empty) Reserved dynamic route
│   │
│   └── api/                      # 🔵 Server-only API endpoints
│       ├── contact/route.ts      # POST /api/contact — sends email via Resend
│       └── views/route.ts        # POST /api/views — increments view counter
│
├── components/                   # 🟡 Reusable React components
│   ├── navbar.tsx                # Sticky header with navigation + mobile sheet
│   ├── footer.tsx                # Page footer with credit & copyright
│   ├── profile.tsx               # Hero: banner + avatar + name + role
│   ├── section.tsx               # Reusable section wrapper with heading + border
│   ├── page-heading.tsx          # Title + description header for sub-pages
│   ├── social-links.tsx          # Grid of social links (GitHub, LinkedIn, etc.)
│   ├── project-card.tsx          # Project card + empty slot + grid wrapper
│   ├── project-browser.tsx       # Client-side project filtering on /projects
│   ├── tech-stack.tsx            # Animated tech chips with category filters
│   ├── github-calendar.tsx       # GitHub contribution heatmap
│   ├── highlights.tsx            # Auto-scrolling marquee of testimonials
│   ├── contact-form.tsx          # Contact form with validation & fallback
│   ├── view-counter.tsx          # Live visitor count badge
│   ├── theme-toggle.tsx          # Dark/light mode toggle button
│   ├── fallback-image.tsx        # next/image wrapper with graceful fallback
│   ├── providers.tsx             # ThemeProvider + MotionConfig wrapper
│   │
│   └── ui/                       # Primitive UI components (Radix-based)
│       ├── button.tsx            # Button with variants (CVA)
│       ├── dropdown-menu.tsx     # Dropdown for "More" nav
│       └── sheet.tsx             # Slide-out panel for mobile nav
│
├── data/                         # 🟠 Static data — the single source of truth
│   ├── site.ts                   # ALL text content, labels, and personal info
│   ├── projects.ts               # Project entries + sorting logic
│   ├── experience.ts             # Internship/job entries
│   ├── navigation.ts             # Nav links (Home, Projects, Experience, More)
│   ├── socials.ts                # Social media links
│   ├── techstack.ts              # Technologies with categories
│   └── highlights.ts             # Testimonials / highlights (currently empty)
│
├── lib/                          # 🔴 Utility functions & service integrations
│   ├── github.ts                 # Fetches GitHub contribution data (GraphQL)
│   ├── redis.ts                  # Upstash Redis HTTP client
│   ├── rate-limit.ts             # Rate limiter (Redis or in-memory fallback)
│   ├── contact-schema.ts         # Zod schema + mailto builder for contact form
│   ├── request.ts                # Request helpers (origin check, body parser)
│   ├── assets.ts                 # Checks if a public asset file exists
│   ├── site-url.ts               # Resolves canonical site URL
│   └── utils.ts                  # cn() — Tailwind class merging
│
├── public/                       # Static files served as-is
│   ├── avatar.webp               # Profile photo
│   └── banner.webp               # Banner image
│
├── MD_FILES/                     # 📝 Documentation
│   ├── FILE_MAP.md               # File-by-file reference
│   ├── HOW_TO_FIX.md             # Troubleshooting guide
│   └── PROJECT_FLOW.md           # ← You are here!
│
├── package.json                  # Dependencies & scripts
├── next.config.ts                # Next.js config (minimal — just disables X-Powered-By)
├── tsconfig.json                 # TypeScript config with @ path alias
├── postcss.config.mjs            # PostCSS → Tailwind CSS 4
├── .env.example                  # Template for environment variables
└── .env.local                    # Your actual secrets (git-ignored)
```

---

## 4. Application Startup Flow

Here's what happens when you run `pnpm dev`:

```
pnpm dev
   │
   ▼
next dev                                    ← Starts the Next.js dev server
   │
   ├── 1. Reads next.config.ts              ← { poweredByHeader: false }
   ├── 2. Loads postcss.config.mjs          ← Hooks up Tailwind CSS 4
   ├── 3. Loads .env.local                  ← Environment secrets
   ├── 4. Compiles globals.css              ← Design tokens + component styles
   ├── 5. Registers Google Fonts            ← Inter, Instrument Serif, JetBrains Mono
   ├── 6. Builds layout.tsx                 ← Root layout with providers
   │
   └── Server is ready at http://localhost:3000
```

**First request flow:**

```
Browser → GET /
   │
   ▼
Next.js matches app/page.tsx
   │
   ├── layout.tsx wraps the page
   │     ├── Injects fonts via CSS variables
   │     ├── Wraps children in <Providers>
   │     │     ├── ThemeProvider (dark mode by default)
   │     │     └── MotionConfig (respects prefers-reduced-motion)
   │     ├── Renders <Navbar />
   │     ├── Renders <main>{children}</main>  ← page.tsx goes here
   │     └── Renders <Footer />
   │
   ├── page.tsx (async Server Component)
   │     ├── Calls getContributions()  ← fetches GitHub GraphQL API
   │     ├── Renders all home page sections
   │     └── Returns full HTML to client
   │
   ▼
Browser receives HTML → React hydrates interactive components
```

---

## 5. Data Layer — The Single Source of Truth

All content is centralized in the `data/` folder. **No text is hardcoded inside components.** This makes it trivial to update any label, description, or personal info in one place.

### How data flows into the UI

```
data/site.ts ─────────┬──→ layout.tsx (metadata, SEO)
                      ├──→ page.tsx (section titles, about text, CTA)
                      ├──→ navbar.tsx (wordmark, nav labels)
                      ├──→ footer.tsx (credit, copyright)
                      ├──→ contact-form.tsx (labels, placeholders, messages)
                      ├──→ profile.tsx (name, role, education, avatar)
                      └──→ Almost every component

data/projects.ts ─────┬──→ page.tsx (home — first 4 projects)
                      └──→ project-browser.tsx (/projects — all + filters)

data/experience.ts ───────→ experience/page.tsx (timeline entries)

data/navigation.ts ───────→ navbar.tsx (nav links + "More" dropdown)

data/socials.ts ──────────→ social-links.tsx (GitHub, LinkedIn, X, Email, Resume)

data/techstack.ts ────────→ tech-stack.tsx (filterable animated chips)

data/highlights.ts ───────→ highlights.tsx (marquee testimonials — empty for now)
```

### Key data files explained

| File | What it holds | Example |
|------|--------------|---------|
| `site.ts` | **Everything textual** — your name, role, email, all section titles, all form labels, error messages, quote, CTA text | `site.name` → "Ashmit Sharma" |
| `projects.ts` | Array of `Project` objects with id, title, tagline, tech stack, URLs, status | Each project is a typed object |
| `experience.ts` | Array of `Experience` objects with title, org, period, description, skills | Sorted chronologically |
| `navigation.ts` | Main nav items + "More" dropdown items | Home, Projects, Experience + Resume |
| `socials.ts` | Social platform entries with icon keys | GitHub, LinkedIn, X, Mail, Resume |
| `techstack.ts` | Tech entries grouped by category | Python → "Languages", PyTorch → "AI & ML" |
| `highlights.ts` | Testimonial entries (currently empty array → component auto-hides) | — |

---

## 6. Page-by-Page Breakdown

### 6.1 Home Page (`/`)

**File:** `app/page.tsx` — an **async Server Component**

This is the main landing page. It fetches data on the server and renders multiple sections in sequence:

```
┌──────────────────────────────────────────────┐
│ 🖼️  Profile Section                          │
│   Banner image + Avatar + Name + Role        │
│   + Education + Location + View Counter      │
├──────────────────────────────────────────────┤
│ 📖  About Section                            │
│   Bullet-point bio with emphasized keywords  │
│   + "Currently focused on" list              │
├──────────────────────────────────────────────┤
│ 🔗  Contact Section (Social Links)           │
│   Grid: GitHub, LinkedIn, X, Mail, Resume    │
├──────────────────────────────────────────────┤
│ 🚀  Projects Section (first 4)               │
│   2-column grid of ProjectCards              │
│   + "View all →" link to /projects           │
├──────────────────────────────────────────────┤
│ 🛠️  Tech Stack Section                       │
│   Category filter buttons + animated chips   │
├──────────────────────────────────────────────┤
│ 📊  GitHub Activity Section                  │
│   Contribution heatmap calendar              │
├──────────────────────────────────────────────┤
│ ⭐  Highlights Section (if data exists)      │
│   Auto-scrolling marquee of testimonials     │
├──────────────────────────────────────────────┤
│ 💬  CTA Section ("Scrolled Too Far")         │
│   "Let's Talk" button → links to /contact    │
├──────────────────────────────────────────────┤
│ 💭  Quote Section                            │
│   Inspirational quote with author            │
└──────────────────────────────────────────────┘
```

**Server-side data fetching:**
```typescript
export const revalidate = 86400; // Re-fetch every 24 hours (ISR)
const contributions = await getContributions(); // GitHub GraphQL API
```

**How `getContributions()` works (inside `lib/github.ts`):**
1. Checks if `GITHUB_TOKEN` env var exists → returns `null` if not
2. Sends a POST to `https://api.github.com/graphql` with a contribution query
3. Validates the response with a Zod schema
4. Maps the raw GitHub data to a simple `{ date, count, level }[]` format
5. The data is cached for 24 hours via `next: { revalidate: 86400 }`

---

### 6.2 Projects Page (`/projects`)

**File:** `app/projects/page.tsx`

```
┌──────────────────────────────────────────────┐
│ 📌  PageHeading                              │
│   "Projects" + description                   │
├──────────────────────────────────────────────┤
│ 🔍  ProjectBrowser (client component)        │
│   ┌────────────────────────────────────┐     │
│   │  Filter Bar: All | React | TS | ...│     │
│   ├────────────────────────────────────┤     │
│   │  ProjectGrid                       │     │
│   │    ProjectCard × N                 │     │
│   │    ProjectSlot × (2 - N) fill slots│     │
│   └────────────────────────────────────┘     │
└──────────────────────────────────────────────┘
```

**How filtering works:**
1. `ProjectBrowser` is a **client component** (`"use client"`)
2. It extracts all unique tech tags from the projects array
3. When a filter button is clicked, it updates local `useState`
4. Projects are filtered by tech tag and re-rendered instantly
5. If fewer than 2 projects match, `ProjectSlot` placeholders fill the grid

---

### 6.3 Experience Page (`/experience`)

**File:** `app/experience/page.tsx`

```
┌──────────────────────────────────────────────┐
│ 📌  PageHeading                              │
│   "Experience" + description                 │
├──────────────────────────────────────────────┤
│ 📋  Timeline                                 │
│   ┌─ 💼 Summer Intern — IIITA               │
│   │  Period + Location + Description         │
│   │  [Deep Learning] ← skill badges         │
│   │                                          │
│   └─ 💼 Summer Intern — India Space Lab      │
│      Period + Location + Description         │
│      [Deep Learning] [Drone Tech] [CV]...    │
└──────────────────────────────────────────────┘
```

**How the Timeline works:**
- Purely a **Server Component** — no client-side JS needed
- Maps over the `experience[]` array from `data/experience.ts`
- Each entry gets an icon (💼 for work, 🎓 for education)
- A dashed vertical line connects entries via CSS `::before` pseudo-element

---

### 6.4 Contact Page (`/contact`)

**File:** `app/contact/page.tsx`

```
┌──────────────────────────────────────────────┐
│ 📌  PageHeading                              │
│   "Let's talk." + description                │
├──────────────────────────────────────────────┤
│ ✉️  Direct Email Link                        │
│   ashmitsha09@gmail.com →                    │
├──────────────────────────────────────────────┤
│ 📝  ContactForm (client component)           │
│   Name + Email + Message                     │
│   + Honeypot field (anti-spam)               │
│   + Submit button                            │
└──────────────────────────────────────────────┘
```

**Contact form flow — the full journey of a message:**

```
User fills form → clicks "Send message"
   │
   ▼
ContactForm.submit() runs
   │
   ├── 1. Parse with Zod schema (contactSchema)
   │     ├── Name: 2-80 chars, no newlines
   │     ├── Email: valid format, max 254 chars
   │     ├── Message: 10-5000 chars
   │     └── Website: honeypot (must be empty)
   │
   ├── 2. Validation fails?
   │     └── Show inline errors, focus first bad field, STOP
   │
   ├── 3. Email not enabled? (no RESEND_API_KEY)
   │     └── Build a mailto: link → user opens their email app
   │
   ├── 4. POST /api/contact with JSON body
   │     │
   │     ▼
   │   API Route (app/api/contact/route.ts):
   │     ├── Check same-origin (CSRF protection)
   │     ├── Parse & validate body with Zod
   │     ├── Honeypot filled? → silently return OK (trap bots)
   │     ├── Rate limit check (5 messages per 10 min per IP)
   │     ├── Send email via Resend API
   │     └── Return { ok: true } or error
   │
   ├── 5. Success? → Show "Thanks" message, reset form
   ├── 6. Rate limited? → Show "Too many messages" + mailto fallback
   └── 7. Any error? → Show error + mailto fallback
```

**Two-layer validation:**
- **Client-side:** Zod validates before sending (instant feedback)
- **Server-side:** Zod validates again (never trust the client!)

---

### 6.5 404 — Not Found

**File:** `app/not-found.tsx`

Simple page with a heading, message, and a "Back home" button. Uses text from `site.notFound`.

---

## 7. Component Architecture

### Server vs Client Components

Next.js 16 renders components on the server by default. Only components that need browser APIs (useState, useEffect, event handlers) are marked `"use client"`.

| Component | Type | Why? |
|-----------|------|------|
| `layout.tsx` | Server | Just renders HTML structure |
| `page.tsx` (home) | Server (async) | Fetches GitHub data on server |
| `profile.tsx` | Server (async) | Checks if avatar/banner files exist |
| `section.tsx` | Server | Pure layout wrapper |
| `page-heading.tsx` | Server | Pure layout wrapper |
| `footer.tsx` | Server | No interactivity needed |
| `social-links.tsx` | Server | Static link rendering |
| `project-card.tsx` | Server | Static cards (links are plain `<a>`) |
| `navbar.tsx` | **Client** | Uses `usePathname()` for active link detection |
| `providers.tsx` | **Client** | ThemeProvider and MotionConfig need context |
| `theme-toggle.tsx` | **Client** | Toggle requires `useTheme()` hook |
| `tech-stack.tsx` | **Client** | Filter state + Framer Motion animations |
| `project-browser.tsx` | **Client** | Filter state for project tags |
| `github-calendar.tsx` | **Client** | `useTheme()` for calendar color scheme |
| `highlights.tsx` | **Client** | Pause/play state for marquee |
| `contact-form.tsx` | **Client** | Form state, submission, validation |
| `view-counter.tsx` | **Client** | useEffect to POST to /api/views |
| `fallback-image.tsx` | **Client** | onError state for image fallback |

### Component Hierarchy

```
RootLayout
├── Providers
│   ├── ThemeProvider (next-themes)
│   └── MotionConfig (framer-motion)
│
├── skip-link (accessibility)
├── Navbar
│   ├── Logo (Link to /)
│   ├── Desktop Nav
│   │   ├── NavLink × 3 (Home, Projects, Experience)
│   │   └── DropdownMenu ("More" → Resume)
│   ├── ThemeToggle
│   └── Mobile Nav (Sheet)
│       ├── NavLink × 3
│       └── Resume link
│
├── <main> ← page content injected here
│   │
│   ├── HOME (/)
│   │   ├── Profile
│   │   │   ├── FallbackImage (banner)
│   │   │   ├── FallbackImage (avatar)
│   │   │   └── ViewCounter
│   │   ├── Section "About"
│   │   ├── Section "Contact" → SocialLinks
│   │   ├── Section "Projects" → ProjectGrid
│   │   │   ├── ProjectCard × 4
│   │   │   └── ProjectSlot (if < 2 projects)
│   │   ├── TechStack (standalone section)
│   │   ├── Section "GitHub Activity" → GitHubCalendar
│   │   ├── Highlights (auto-hides if empty)
│   │   ├── Section "CTA"
│   │   └── Section "Quote"
│   │
│   ├── PROJECTS (/projects)
│   │   ├── PageHeading
│   │   └── ProjectBrowser
│   │       └── ProjectGrid
│   │
│   ├── EXPERIENCE (/experience)
│   │   ├── PageHeading
│   │   └── Timeline
│   │
│   └── CONTACT (/contact)
│       ├── PageHeading
│       ├── Email link
│       └── ContactForm
│
└── Footer
```

---

## 8. API Routes — The Backend Layer

### POST `/api/contact`

**File:** `app/api/contact/route.ts`

**Purpose:** Receives contact form submissions and sends an email via Resend.

```
Request ──→ Origin check ──→ Parse body ──→ Validate (Zod)
                                                │
                              ┌─────────────────┤
                              ▼                 ▼
                        Honeypot filled?    Valid data
                        Return OK silently     │
                                               ▼
                                        Rate limit check
                                        (5 req / 10 min)
                                               │
                              ┌────────────────┤
                              ▼                ▼
                         Over limit?      Under limit
                         429 + Retry       │
                                           ▼
                                     Resend configured?
                              ┌────────────────┤
                              ▼                ▼
                         No → fallback    Yes → send email
                         (mailto link)         │
                                        ┌──────┤
                                        ▼      ▼
                                     Error?  Success!
                                     502     { ok: true }
```

**Security measures:**
- **Origin check:** `sameOrigin()` verifies the request comes from the same domain (CSRF protection)
- **Body size limit:** `readLimitedJson()` caps the body at 24KB, reads it in chunks
- **Honeypot field:** A hidden `website` field — bots fill it, humans don't. If filled → silently return OK
- **Rate limiting:** SHA-256 hashed IP → max 5 messages per 10 minutes
- **Zod validation:** Server-side re-validation of all fields

### POST `/api/views`

**File:** `app/api/views/route.ts`

**Purpose:** Tracks portfolio view count using Redis.

```
Request ──→ Origin check ──→ Feature enabled? ──→ Rate limit (60/hr)
                                   │
                            ┌──────┤
                            ▼      ▼
                         No → null  Yes
                                    │
                                    ▼
                             Already counted?
                          (cookie: portfolio-viewed)
                            ┌──────┤
                            ▼      ▼
                          Yes    No
                          GET    INCR  ← Redis commands
                            │      │
                            ▼      ▼
                        Return count + set cookie
```

**Smart deduplication:** Uses a `portfolio-viewed` cookie (24h TTL) so the same visitor only increments once per day.

---

## 9. Styling System

### Design Token Architecture

The project uses a **two-layer theming system:**

**Layer 1 — CSS Custom Properties** (`globals.css` `:root` and `.dark`):
```css
:root {
  --background: #faf9f6;     /* Warm off-white */
  --foreground: #20201e;     /* Near-black */
  --muted: #eeede9;          /* Subtle grey */
  --border: #d9d8d2;         /* Soft border */
  /* ... */
}

.dark {
  --background: #0e0e0d;     /* Deep dark */
  --foreground: #f4f3f0;     /* Off-white text */
  /* ... all tokens flip */
}
```

**Layer 2 — Tailwind CSS 4 Theme** (`@theme inline`):
```css
@theme inline {
  --color-background: var(--background);
  --font-sans: var(--font-inter);
  --font-display: var(--font-instrument-serif);
  /* Maps CSS vars → Tailwind utilities */
}
```

This means `bg-background` automatically uses the correct color for light/dark mode.

### Typography System

| Font | CSS Variable | Usage |
|------|-------------|-------|
| **Inter** | `--font-inter` | Body text, UI elements |
| **Instrument Serif** | `--font-instrument-serif` | Headings, wordmark, section titles (`.section-heading`, `.font-display`) |
| **JetBrains Mono** | `--font-jetbrains-mono` | Code, timestamps, tech hints |

### Key CSS Components (defined in `globals.css`)

| Class | What it does |
|-------|-------------|
| `.page-column` | Centers content with max-width 1000px + dashed side borders |
| `.blueprint-section` | Adds dashed top/bottom borders + top margin |
| `.section-heading` | Serif font, responsive size (2rem → 2.5rem) |
| `.nav-link` / `.is-active` | Navigation links with active dot indicator |
| `.project-grid` | 2-column grid that collapses to 1 column on mobile |
| `.project-card` | Card with dashed border between odd/even items |
| `.project-gradient` | Green gradient background for project thumbnails |
| `.portfolio-banner` | Hero banner with complex multi-layer gradient art |
| `.profile-avatar` | Rounded square avatar with border and initials fallback |
| `.social-grid` | 5-column grid (2 on mobile) with dashed dividers |
| `.tech-chip` | Pill-shaped button for tech stack items |
| `.filter-button` | Toggle button with pressed state styling |
| `.form-input` | Styled input/textarea with error state |
| `.marquee-mask` / `.marquee-track` | Infinite scrolling highlight cards |
| `.timeline` | Vertical timeline with dashed connector line |
| `.skip-link` | Accessibility skip-to-content link |
| `.calendar-placeholder` | Skeleton grid for loading GitHub calendar |

### Responsive Breakpoints

| Breakpoint | What changes |
|-----------|-------------|
| `< 640px` (sm) | Smaller avatar (88px), smaller about text |
| `< 768px` (md) | Single-column project grid, 2-column social grid, mobile nav appears |
| `≥ 768px` | Wider page column padding |
| `prefers-reduced-motion` | Disables all animations, marquee wraps instead of scrolling |

---

## 10. SEO & Metadata Flow

### Static Metadata

Defined in `layout.tsx` and each page file:

```
layout.tsx (global defaults)
├── title: "Ashmit Sharma — Portfolio"
├── template: "%s — Ashmit Sharma"       ← sub-pages use this
├── description: site.description
├── metadataBase: getSiteUrl()
├── openGraph: title, description, siteName
└── twitter: card, title, description

page.tsx → alternates: { canonical: "/" }
projects/page.tsx → title: "Projects", canonical: "/projects"
experience/page.tsx → title: "Experience", canonical: "/experience"
contact/page.tsx → title: "Contact", canonical: "/contact"
```

### Dynamic SEO Assets

| File | Generates | How |
|------|----------|-----|
| `icon.tsx` | **Favicon** | Reads `public/avatar.webp` and serves it with long-lived cache headers |
| `opengraph-image.tsx` | **OG Image** (1200×630) | Uses `ImageResponse` to render a branded card with name, role, and GitHub URL |
| `robots.ts` | **robots.txt** | Allows all crawlers, disallows `/api/`, points to sitemap |
| `sitemap.ts` | **sitemap.xml** | Lists all 4 pages with monthly change frequency |

### Site URL Resolution (`lib/site-url.ts`)

```
Priority order:
1. NEXT_PUBLIC_SITE_URL env var (if set)
2. VERCEL_PROJECT_PRODUCTION_URL (auto-set by Vercel)
3. VERCEL_URL (auto-set by Vercel)
4. http://localhost:3000 (fallback for dev)
```

---

## 11. External Services & Environment Variables

```
┌──────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT VARIABLES                      │
├──────────────────────────┬───────────────────────────────────┤
│  Variable                │  Purpose                          │
├──────────────────────────┼───────────────────────────────────┤
│  GITHUB_TOKEN            │  GitHub GraphQL API access        │
│                          │  (read-only, server-only)         │
│                          │  Missing → shows placeholder      │
├──────────────────────────┼───────────────────────────────────┤
│  RESEND_API_KEY          │  Resend email service             │
│  RESEND_FROM_EMAIL       │  Sender address on verified       │
│                          │  domain                           │
│                          │  Missing → mailto: fallback       │
├──────────────────────────┼───────────────────────────────────┤
│  ENABLE_VIEW_COUNTER     │  "true" to enable counter         │
│  UPSTASH_REDIS_REST_URL  │  Upstash Redis endpoint           │
│  UPSTASH_REDIS_REST_TOKEN│  Upstash auth token               │
│                          │  Missing → counter hidden          │
├──────────────────────────┼───────────────────────────────────┤
│  KV_REST_API_URL         │  Alternative to Upstash (Vercel   │
│  KV_REST_API_TOKEN       │  KV naming convention)            │
├──────────────────────────┼───────────────────────────────────┤
│  NEXT_PUBLIC_SITE_URL    │  Canonical URL override           │
│                          │  (public, optional)               │
└──────────────────────────┴───────────────────────────────────┘
```

**Graceful degradation:** Every external service is optional. The site works perfectly with zero environment variables — it just shows fallback UIs:
- No `GITHUB_TOKEN` → skeleton calendar placeholder
- No `RESEND_*` → "Open email draft" (mailto: link)
- No Redis → view counter hidden entirely
- No `SITE_URL` → auto-detects from Vercel or uses localhost

---

## 12. Request Lifecycle — Full Picture

Here's what happens when a user visits `https://your-portfolio.com/` for the first time:

```
                         ┌────────────────────────┐
                         │    DNS + TLS + CDN      │
                         │  (Vercel Edge Network)  │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
           1. ROUTING    │  Next.js App Router     │
                         │  Match: app/page.tsx    │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
           2. LAYOUT     │  layout.tsx executes    │
                         │  • Metadata generated   │
                         │  • Font CSS injected    │
                         │  • Providers set up      │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
           3. DATA       │  page.tsx (server)      │
                         │  • getContributions()   │
                         │    → GitHub GraphQL API │
                         │  • hasPublicAsset()     │
                         │    → checks avatar/     │
                         │      banner existence   │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
           4. RENDER     │  Server Components      │
                         │  rendered to HTML       │
                         │  • Profile, Sections,   │
                         │    Cards, Footer, etc.  │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
           5. STREAM     │  HTML streamed to       │
                         │  browser                │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
           6. HYDRATE    │  React hydrates client  │
                         │  components:            │
                         │  • Navbar (active state) │
                         │  • ThemeToggle          │
                         │  • TechStack (filters)  │
                         │  • GitHubCalendar       │
                         │  • ViewCounter          │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
           7. CLIENT     │  Client-side JS runs:   │
              EFFECTS    │  • ViewCounter POSTs    │
                         │    to /api/views        │
                         │  • Theme resolved       │
                         │  • Marquee starts       │
                         └────────────────────────┘
```

### ISR (Incremental Static Regeneration)

```typescript
export const revalidate = 86400; // in page.tsx
```

This means:
- The **first visit** generates and caches the page
- **Subsequent visits** within 24 hours get the cached version instantly
- After 24 hours, the **next visit** triggers a background regeneration
- The stale page is served immediately while the new one builds

---

> **💡 Quick Reference: "I want to change X, where do I go?"**
>
> | Change | File |
> |--------|------|
> | My name, role, email | `data/site.ts` |
> | Add a new project | `data/projects.ts` |
> | Add work experience | `data/experience.ts` |
> | Add a tech to the stack | `data/techstack.ts` |
> | Change nav links | `data/navigation.ts` |
> | Update social links | `data/socials.ts` |
> | Change colors/theme | `app/globals.css` (`:root` and `.dark`) |
> | Change a section layout | Corresponding component in `components/` |
> | Add a new page | Create `app/your-page/page.tsx` + add to `navigation.ts` |
> | Update profile pic | Replace `public/avatar.webp` |
> | Update banner | Replace `public/banner.webp` |

---

*Last updated: October 2026*
