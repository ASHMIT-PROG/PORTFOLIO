# Portfolio fixes — 2026-10-15

Repairs from the “fix all the issues and run it” request. The full editing guide and
older history remain in [MD_FILES/HOW_TO_FIX.md](MD_FILES/HOW_TO_FIX.md).

## Issues fixed

| Issue | Fix | Files |
| --- | --- | --- |
| Build failed: default export missing for `/icon` | Changed the ordinary `GET` handler to the default function required for a Next.js metadata icon; declared WebP content type. | `app/icon.tsx` |
| Favicon updates could remain cached for a year | Replaced immutable one-year caching with one-hour caching and revalidation. | `app/icon.tsx` |
| Three TypeScript errors in animation wrappers | Used `HTMLMotionProps` instead of incompatible native drag/animation event types, including reduced-motion rendering. | `components/scroll-reveal.tsx` |
| Strict lint failed | Removed the unused `Experience` type import. | `components/experience-preview.tsx` |
| CSS and Motion competed for section opacity/position | Removed the duplicate persistent `page-enter` animation. ScrollReveal now owns the entrance effects. | `app/globals.css` |
| Reduced-motion preference missed stagger children and hover movement | Disabled child movement/delays and CSS hover transforms when reduced motion is requested. | `components/scroll-reveal.tsx`, `app/globals.css` |
| Sections could be invisible without JavaScript | Added a no-script style restoring the server-rendered reveal content's opacity and position. | `app/layout.tsx` |
| Fixed thumbnail text/icon sizes could clip in narrow cards | Added bounded container-relative title, icon, spacing, and padding sizes. | `components/project-card.tsx`, `app/globals.css` |
| Rounded dots and badges inherited CTA hover effects | Scoped lift/shadow styles to actual Button components. | `app/globals.css` |
| A failed image prevented loading a replacement URL | Track the failed source rather than a permanent failure flag; a new URL gets a load attempt. Also migrated deprecated Next image `priority` to `preload`. | `components/fallback-image.tsx` |
| Pasted email addresses with outer whitespace failed | Trim before validation in the shared client/server schema. | `lib/contact-schema.ts` |
| “Open email draft” button only prepared the draft | Renamed that button to “Prepare email draft”; the resulting mailto link remains “Open email draft”. | `components/contact-form.tsx`, `data/site.ts` |
| `application/jsonp` passed the JSON content-type check | Match the complete media type while supporting case differences and charset parameters. | `lib/request.ts` |
| Strict Mode could send duplicate visitor increments | Share in-flight requests across mounts; cleanup ignores the unmounted consumer instead of aborting and repeating a server increment. Failures remain retryable. This is client request deduplication, not cross-device visitor identification. | `lib/view-count.ts`, `components/view-counter.tsx` |
| Type checking depended on generated route types already existing | Run `next typegen` before `tsc --noEmit`. | `package.json` |
| Loopback dev assets could fail origin checks | Added `127.0.0.1` to development origins alongside Next's default localhost support. | `next.config.ts` |
| Location and quote retained editing brackets | Removed brackets while preserving Chennai, the quote, and its attribution. | `data/site.ts` |
| README still described obsolete Phase 1 placeholders | Updated actual pages, run commands, checks, configuration, and deployment guidance; corrected the animation guide. | `README.md`, `MD_FILES/HOW_TO_FIX.md` |
| No repeatable checks for the validation and view-request bugs | Added seven built-in Node tests and safe local HTTP smoke checks. Declared the package's existing ESM format to remove Node's ambiguous-module warning. | `tests/*.test.mjs`, `scripts/check-site.mjs`, `package.json` |
| Local preview refused connections | Started the missing Next.js server on loopback port 3000 and verified HTTP responses. Keep its process running. | Runtime; `README.md` |

## Verification commands

Final result: lint passed with zero warnings; generated route types and TypeScript
passed; all 7 regression tests passed; the production build generated all 12 pages
successfully; all local HTTP smoke checks passed. The development server remains
running on port 3000.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
# Requires a running server:
npm run check:site
```

HTTP checks cover Home, Projects, Experience, Contact, icon, Open Graph image,
robots, sitemap, avatar, banner, missing-page 404, invalid/malformed/oversized contact
payloads, incorrect media types, cross-origin rejection, email trimming, honeypot,
and the configured email-app fallback. They do not send email or increment visitor
counts. Seven unit tests additionally cover actual UTF-8 byte limits and concurrent
view requests, failures, retries, and invalid counts.

## Run / restart

```powershell
cd D:\CODING\Projects\portfolio
npm run dev -- --hostname 127.0.0.1
```

Open [localhost:3000](http://localhost:3000) or [127.0.0.1:3000](http://127.0.0.1:3000).
Reload an old error page. Closing the server process stops the preview.

## Remaining inputs and verification limits

- `public/resume.pdf` is missing. Per the original request, Resume links retain that
  URL until the real file is supplied. No resume was invented.
- The current configuration uses the email-app fallback. Live Resend delivery and
  Redis-backed counters were not exercised against external services.
- Browser automation's security policy blocked the existing preview tab. Compilation
  and HTTP checks pass, but visual checks at mobile/tablet/desktop widths and
  interactive keyboard/theme verification could not be completed in this repair run.
  Reload the preview to inspect those; no policy bypass was attempted.
- The icon reads the supplied `public/avatar.webp`; retain it when building.
  Asset changes in a deployed static build require a rebuild.
- This task does not publish or deploy the site.
