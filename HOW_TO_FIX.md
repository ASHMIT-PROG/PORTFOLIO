# Maintaining the Contact previews

This guide describes the Contact row on the home page. The site uses Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide, and React Icons. The existing serif headings, theme variables, dashed grid, and responsive layout are reused. No package dependencies were added. GitHub uses current public API data. Mail and Resume retain previews. LinkedIn and X are ordinary profile links with no hover/focus preview, preview buttons, or third-party widget scripts.

## A. Project structure

Files created or modified for this feature:

| File | Purpose |
| --- | --- |
| `components/social-links.tsx` | Existing server entry point. Checks whether the configured local resume exists, then renders the interactive row. |
| `components/contact-links.tsx` | New shared client component: Contact items, one interactive preview, hover/focus state, dismissal, portal, animation, email copy, and document presentation. |
| `components/contact-profile-preview.tsx` | Current GitHub profile card, loaded only when opened. Handles GitHub loading failures. |
| `data/socials.ts` | Central list of destinations, preview copy, optional images, action labels, and resume metadata. Imports shared identity values from `data/site.ts`. |
| `lib/contact-preview.ts` | Positioning function and `copyContactEmail` clipboard helper, which returns a safe success/failure result. |
| `lib/github-profile.ts` | Fetches and validates public GitHub profile data and three recently updated public repositories. Reuses the optional server-only `GITHUB_TOKEN`. |
| `app/api/contact/github/route.ts` | Runtime profile endpoint. Caches successful responses briefly; errors are not cached. |
| `next.config.ts` | Allows actual GitHub avatar images from `avatars.githubusercontent.com`. |
| `app/contact-previews.css` | Scoped Contact styles, icon/arrow feedback, grid/light details, stagger, and reduced motion. |
| `app/globals.css` | Imports Contact styles and adapts the existing responsive grid selectors to the item wrappers. |
| `tests/contact-preview.test.mjs` | Tests positioning near the header/edges, short/narrow screens, and clipboard success/unavailable/denied paths. |
| `tests/github-profile.test.mjs` | Tests live-profile validation, upstream errors, account mismatch, safe URLs, and optional repository failures. |
| `HOW_TO_FIX.md` | This guide. |

Existing integration points:

- `app/page.tsx` already renders `<SocialLinks />` inside `<Section id="contact">`. Neither that page nor its other sections needed changing.
- `components/fallback-image.tsx` renders lazy-loaded Next Image avatars with initials underneath if loading fails.
- `data/site.ts` stores the shared name, role, email, GitHub identity, avatar, and resume URL.
- `lib/assets.ts` provides the existing server-side local asset check.
- `components/providers.tsx` already configures theme switching and user motion preferences.

The preview is portaled into `document.body`. This avoids clipping and incorrect coordinates from the home page's animated `ScrollReveal` ancestors. It uses one non-modal `role="dialog"`; it does not trap focus or lock page scrolling.

## B. How to change profile links

1. **GitHub:** edit `site.githubUrl` and `site.githubUsername` in `data/site.ts`. Current values are `https://github.com/ASHMIT-PROG` and `ASHMIT-PROG`. Keep these values consistent; the username also serves the existing contribution calendar.
2. **LinkedIn:** edit the LinkedIn entry's `href` in `data/socials.ts`. It points to `https://www.linkedin.com/in/ashmit-sharma-9a69b1325/?isSelfProfile=true`. The owner-specific query does not grant visitors access to private account content.
3. **X:** edit `xUrl` in `data/socials.ts`, currently `https://x.com/_ASHMIT__SHARMA`. The preview handle is derived from its URL path, so use a profile URL without extra path segments.
4. **Email:** edit `site.email` in `data/site.ts`, currently `ashmitsha09@gmail.com`. The Mail destination, displayed address, and copy action all follow it automatically. The separate contact form also uses this shared value.
5. **Resume:** edit `site.resumeUrl` in `data/site.ts`. For `/resume.pdf`, put the real file at `public/resume.pdf`. Do not include `public` in the browser URL. For `/documents/resume.pdf`, use `public/documents/resume.pdf`. An HTTPS URL can be used for an externally hosted file.

For example, these are the actual shared keys:

```ts
githubUsername: "ASHMIT-PROG",
githubUrl: "https://github.com/ASHMIT-PROG",
email: "ashmitsha09@gmail.com",
resumeUrl: "/resume.pdf",
```

Local resume availability is checked by the server entry point. **At implementation time, `public/resume.pdf` was absent.** The row therefore opens an honest unavailable preview instead of sending users to a 404, and the view action is disabled. Add the real asset and rebuild/redeploy to enable viewing and downloading. Hosted resume URLs allow viewing, but the download action is deliberately limited to an available same-origin local file; cross-origin hosts control download behavior themselves.

External profile/view links open a new tab with `rel="noopener noreferrer"`. Mail uses `mailto:` in the same browsing context. There is no need to duplicate any destination in the JSX.

## C. How to update preview content

Each entry in `socials` has a typed `preview` object. A social entry supplies fallback identity and action labels; its actual profile details come from the provider:

```ts
preview: {
  title: site.name,
  eyebrow: "GitHub / Code & projects",
  handle: `@${site.githubUsername}`,
  actionLabel: "View GitHub Profile",
}
```

- **Profile name:** `preview.title` is the accessible/loading label. Actual GitHub names come from its API. LinkedIn and X have no preview configuration.
- **Username:** edit `preview.handle` for the fallback label. GitHub derives it from `site.githubUsername`; LinkedIn and X have no preview handles. The displayed live GitHub username comes directly from its API.
- **Professional headline/bio:** edit these on the actual social platforms. GitHub renders its public API bio only when present. `preview.headline` and `preview.bio` remain used for Mail/Resume and any future static card, not as substitutes for current social data.
- **Avatar:** GitHub uses the current API avatar URL, allowed by `next.config.ts`. Update images on the respective platforms. `site.avatar` is still the portfolio's own image and generic-card fallback configuration. No screenshot crop is used as a profile preview.
- **Action text:** edit `preview.actionLabel`. The arrow is rendered separately and should not be added to the string.
- **Resume title/type:** edit its `preview.title`, `preview.fileType` (currently `PDF`), and `preview.downloadName` (currently `Ashmit-Sharma-Resume.pdf`). Keep the type consistent with the real asset.

**Current data:** GitHub loads from `/api/contact/github` when first opened and shares a five-minute client request cache. Its API supplies the avatar, name, bio, public repository count, followers/following, and three recently updated repositories. These are not claimed to be pinned repositories. Public counts can differ from the owner's signed-in screenshot because private repositories are excluded. Successful HTTP responses use a 60-second browser / 300-second CDN cache; failures use `no-store` and can be retried. Profile loading never blocks the home-page build.

LinkedIn and X deliberately omit `preview` in `data/socials.ts`. `ContactLinks` renders the entire icon/label/arrow as one direct external anchor. Hovering or focusing either link closes any other active preview. Their widget implementations, loaders, globals, and styles have been removed.

Reference: [GitHub public user API](https://docs.github.com/en/rest/users/users#get-a-user).

## D. How to customize animations

In `components/contact-links.tsx`:

| Setting | Current value / effect |
| --- | --- |
| `motionSettings.enter` | `0.32` seconds for the shared card entrance. |
| `motionSettings.exit` | `0.18` seconds for exit. |
| `motionSettings.stagger` | `0.035` seconds between content details. |
| `motionSettings.ease` | `[0.22, 1, 0.36, 1]`, shared refined easing. |
| Outer `initial` / `animate` | Opacity 0 → 1, vertical offset 10 → 0px, scale .97 → 1. |
| Inner keyed `motion.div` | 8px directional switch and .22s fade; the outer dialog remains a single shared element. |
| `CLOSE_DELAY` | `180`ms bridge between the item and preview. Increase slightly if slow pointer movement closes it too soon. |

In `app/contact-previews.css`:

- `--contact-feedback: 200ms` controls row, border, icon, and arrow feedback.
- `--contact-ease` controls CSS motion easing; update it alongside the Motion curve if desired.
- `.contact-item[data-active="true"] .contact-preview-toggle` uses `rotate(-3deg) scale(1.045)`. Change these values for hover scale/rotation.
- `--contact-glow` is a 9% foreground mix; reduce it for a quieter glow. The active item's `::after` border uses `.45` opacity.
- `.contact-item-arrow` moves `translate(2px, -2px)` when active.
- `contact-detail-in` controls the 320ms CSS content fade/5px rise. `contact-grid-in` and `contact-light-in` provide a short decorative reveal, with no perpetual animation.
- `.contact-preview` controls the card border, radius, blur, background, and shadow. Theme colors come from existing CSS variables, so light mode stays usable.

Positioning is in `lib/contact-preview.ts`: `margin = 12`, `gap = 14`, preferred widths of 480px for GitHub and 360px for other preview cards (passed by `ContactLinks`). The component calculates `topInset` from the sticky header plus 12px. It measures the rendered card, repositions on resize/scroll and content resize, and closes if the source item scrolls offscreen. If neither side fits, it uses the larger space and constrains the height with internal scrolling so the card does not cover its source item. Opening never inserts space into the page. Keep the portal outside the section and `overflow: auto` on `.contact-preview`.

`useReducedMotion()` removes Motion transforms and durations. The scoped reduced-motion CSS disables decorative keyframes and icon/arrow transforms. The site's existing global media query also removes transition durations. Preserve both paths when adding effects.

## E. Common issues and fixes

| Problem | Likely cause | How to fix |
| --- | --- | --- |
| Preview does not appear | Hydration, `active`, or pointer/focus handler issue | Check `ContactLinks` in `components/contact-links.tsx`, its `open()` handler, and browser errors. Icon preview buttons become available after hydration; normal destination links are server-rendered. |
| Preview disappears while moving into the card | Pointer gap, premature timer, or blur overriding hover | Increase `CLOSE_DELAY` slightly; check `pointerInside`, `cancelClose`, `scheduleClose`, and both elements' pointer handlers. The close timer must preserve a hovered item/card even when keyboard focus changes. Keep the card interactive. |
| Preview stays open | Keyboard focus is still inside the dialog | This intentionally protects keyboard actions. Use Escape, Close, Tab out, or an outside click. Inspect `document.activeElement` if it appears stuck. |
| Wrong profile opens | Incorrect centralized destination | Correct `data/socials.ts`, or the imported `site.githubUrl`, `site.email`, or `site.resumeUrl`. |
| Resume does not load | Asset absent, wrong case, or wrong deployment path | Verify `public/resume.pdf`, `site.resumeUrl`, and a successful GET to the URL. Rebuild after adding the file. Never create a fake PDF to bypass the unavailable state. |
| Resume download is absent | Missing local asset or external URL | Add the actual same-origin asset; external URLs only show View because a cross-origin `download` attribute is unreliable. |
| Avatar does not appear | Invalid image path or disallowed remote source | Replace the local image, check the network response and Next Image configuration, or remove `preview.avatar` to use the icon fallback. Initials remain when loading fails. |
| Preview is clipped | Portal removed, dimensions incorrect, or CSS overflow changed | Keep `createPortal(..., document.body)`. Check `positionContactPreview`, header inset, viewport width, `.contact-preview` max height, and its internal scrolling. |
| Mobile interaction fails | Relying on hover or hiding the icon buttons | Tap the rounded-square **icon** to preview, then use card actions. The text link always navigates. Keep `onClick`, focus support, and the explicit Close control. |
| Animation is choppy | Heavy blur, layout animation, or unnecessary work | Keep transforms/opacity, avoid animated dimensions/position, reduce blur/shadow, and retain the requestAnimationFrame throttle and observer cleanup. |
| Email copy does not work | Clipboard API unavailable, denied, or insecure context | Use HTTPS or localhost. `copyContactEmail()` catches errors; `EmailCopy.copy()` announces a selectable-address fallback. Select the displayed address and copy manually; Send Email still works. |
| Styling breaks on deployment | Missing stylesheet import, asset case mismatch, or stale build | Check `app/globals.css` imports `./contact-previews.css`, verify asset filename case, inspect build logs, and redeploy current source. |
| Keyboard focus jumps or dialog reopens after Escape | Focus restoration re-triggers an item's focus handler | Preserve `suppressFocus` in `close(true)`. Avoid automatically focusing the dialog for hover or ordinary Tab focus. |
| Card moves after an avatar loads | Image dimensions changed | Keep the fixed avatar box (64px for GitHub, 52px for generic cards) and the card's `ResizeObserver`; images should never change the box dimensions. |
| Default production build reports a Turbopack CSS worker panic | Turbopack's worker exits before connecting in this environment | The default build encountered this during verification. Use the bundled supported fallback `npm run build -- --webpack` (or `node node_modules/next/dist/bin/next build --webpack`). Do not remove Contact CSS or change the package script to hide it; compare the normal build again after updating/fixing the local Next.js runtime. |
| LinkedIn or X has no preview | Expected direct-link behavior | These entries intentionally omit `preview`. Their entire icon, label, and arrow navigate to the configured profile. They do not load widget scripts. |
| GitHub current profile fails | GitHub rate limit, rejected optional token, timeout, or invalid upstream data | Check `/api/contact/github`. HTTP 503 is deliberately uncached. The existing optional server-only `GITHUB_TOKEN` can raise the public API rate limit; never expose it with a `NEXT_PUBLIC_` prefix. The endpoint requests only public profile/repository information. |

Copy feedback resets after 3 seconds and uses `role="status"`. Closing clears timers and positioning/event listeners. Do not replace success text with a color-only signal.

## F. Deployment checklist

From the project root:

```sh
npm install          # Only needed when dependencies are not already installed
npm run dev         # Next.js development server, normally http://localhost:3000
npm run lint        # ESLint; warnings are errors
npm run typecheck   # next typegen, then tsc --noEmit
npm test            # All Node tests, including Contact positioning tests
npm run build       # Production Next.js build
npm start           # Serve that production build
npm run check:site  # Existing route/contact API smoke checks against port 3000
```

If port 3000 is occupied, use another port for the production server and set `CHECK_SITE_URL` for the smoke-check script. Do not run two dev servers against the same checkout. On PowerShell, set an alternate check URL with `$env:CHECK_SITE_URL = 'http://localhost:3001'`.

If a managed shell blocks the npm wrapper itself, the equivalent underlying checks are `node node_modules/eslint/bin/eslint.js . --max-warnings=0`, `node node_modules/next/dist/bin/next typegen`, `node node_modules/typescript/bin/tsc --noEmit`, and `node --test tests/*.test.mjs`.

Before deployment:

1. On desktop/laptop, hover each item, move into its card, switch services, and move away. Confirm one card, stable layout, correct actions, and no clipping near either viewport edge or the header.
2. Tab through the row. Links show previews without stealing focus; Enter on a text link navigates. Activate an icon using Enter/Space to focus the non-modal card; Tab reaches Close/actions. Escape restores focus to its icon. Tab can leave the dialog freely.
3. On narrow/mobile screens, tap each icon, use Close/outside tap, and test portrait/landscape. The text portion stays a direct link, avoiding a hidden two-tap navigation rule.
4. Test Mail copy with permission allowed and denied. Verify success announcement, manual-copy fallback, and the actual `mailto:` URL without sending test mail.
5. With the real resume installed, confirm View and Download both return the correct asset. Without it, confirm the unavailable message and disabled View action.
6. Test dark/light themes, reduced motion, 200% zoom, and keyboard-visible focus. Disable JavaScript to check the static row and profile/email links; preview functionality is progressive enhancement.
7. Inspect browser console/network errors for hydration, failed images, and missing CSS/files. GitHub should load `/api/contact/github` once per five-minute client cache window. LinkedIn/X should have no preview buttons, open no dialogs on hover/focus, and load no widget scripts.
8. Include all source files and `public/avatar.webp`; include the actual resume asset if ready. The preview illustration needs no separate thumbnail.
9. Compare `npm run dev` with `npm run build` + `npm start`. Production can cache server-rendered asset availability, so rebuild when adding a resume. Filename case that works on Windows may fail on Linux. Existing Google fonts require network access during a fresh build; that is independent of Contact previews.

## G. Adding another Contact link

1. Add an icon key to `ContactIcon` in `data/socials.ts` if it is a new service. Add its matching existing-package icon to the `icons` map in `components/contact-links.tsx`.
2. Add one `ContactSocial` entry to `socials` with a unique `icon`, `label`, and `href`. Omit `preview` for a direct link like LinkedIn/X. To enable a preview, add `preview` (title, eyebrow, actionLabel; optional bio/handle/headline/avatar). Use verified information only.
3. Ordinary profile links reuse `ContactPreviewContent` automatically. If the link is a new content kind, add the smallest conditional content block there; keep the shared `ContactLinks` positioning and dismissal system.
4. If needed, add a restrained style under `.contact-preview[data-service="your-key"]`. Reuse existing theme variables, icon sizes, and action classes.
5. The desktop grid currently specifies five columns in `app/globals.css`; adjust that count for six items or another intentional layout. The existing mobile rule spans the final item; revisit that rule for an even item count.
6. Check both its text link and icon, safe external attributes, keyboard activation, focus restoration, touch, pointer transfer, Escape, and outside dismissal. Run lint, typecheck, tests, and build again.

Keep preview information in configuration and behavior in the shared component. Avoid adding independent popovers or per-service network requests.

---

## Previous maintenance history

The notes below are preserved from the existing guide. They describe earlier work; the Contact guide above supersedes their Resume behavior. Navigation now scrolls to home-page sections as requested in the preceding change.

## Portfolio fixes — 2026-10-15

Repairs from the “fix all the issues and run it” request. The full editing guide and
older history remain in [MD_FILES/HOW_TO_FIX.md](MD_FILES/HOW_TO_FIX.md).

### Smooth header motion — 2026-10-15

- Added soft hover/focus backgrounds and a spring-animated active-page dot using
  the existing Motion dependency. Link weight stays constant to avoid width jumps.
- Replaced the wide rectangular header focus outline with a closer, rounded
  keyboard-focus ring. Only the current page retains the active dot.
- Added eased open/close animations for More and the mobile drawer, a rotating
  chevron, gentle button press feedback, and rotating/fading theme icons.
- Preserved reduced-motion support: the active marker becomes static and CSS
  transitions/animations use the existing reduced-motion overrides.
- TypeScript and targeted ESLint passed. Browser checks covered desktop route
  changes, dropdown open/Escape dismissal, keyboard focus, both themes, and mobile
  drawer opening/closing at 390px. No browser console errors were observed.
- The updated development preview runs at `http://127.0.0.1:3000` using webpack.
  These changes have not been deployed to Vercel.

### GitHub activity on Vercel and navigation — 2026-10-15

The reported production screenshot showed an unavailable contribution calendar.
The home page fetched GitHub data during static generation and could bake a
temporary failure into its HTML. Upstream responses were also cached before
validation, including HTTP 200 responses containing GraphQL errors or invalid
calendar markup. Production logs were not available, so the exact deployed
upstream failure is unconfirmed.

- Removed GitHub fetching from the home-page build. The calendar now loads from
  the Node.js `/api/github` route after the page opens.
- Upstream requests bypass the Next.js data cache. The API caches only valid,
  nonempty data for five minutes at the CDN, with a one-hour stale-revalidation
  window. Failures return HTTP 503 with `Cache-Control: no-store` and
  `Retry-After: 60`, so a later request can recover.
- Preserved authenticated GraphQL with a public-calendar fallback. Tokens remain
  server-side. Added a 30-second function budget for both eight-second attempts,
  a 20-second browser timeout, and a manual retry that retains loaded data if a
  refresh fails.
- Kept the activity summary, calendar, profile link, and retry UI from the existing
  workspace changes.
- Removed the navigation hover underline that appeared alongside the current
  page's dot. Hover/focus changes text color; only the current route has the dot
  and `aria-current="page"`, including in the mobile menu.

#### Deploy and verify

1. Deploy all changed files, including the new `app/api/github/route.ts`.
2. In Vercel, use the Next.js framework preset. If using `GITHUB_TOKEN`, set it in
   **Settings → Environment Variables** for Production (and Preview if needed),
   then redeploy. `.env.local` is ignored by Git and is not uploaded automatically.
   Never name the token `NEXT_PUBLIC_GITHUB_TOKEN`.
3. Open `/api/github` on the deployed domain. Expect HTTP 200 and a nonempty
   `contributions` array. HTTP 404 means this route is missing from that deployment;
   HTTP 503 means both upstream sources failed. Inspect `[github]` function logs
   for authentication, rate-limit, invalid-data, or network errors.
4. Open Home and use **Refresh activity**. Check that activity renders, then hover
   Experience: Home should retain its dot without an underline under Experience.
   Navigate to Experience and confirm that the dot moves to that page.

References: [Vercel cache headers](https://vercel.com/docs/caching/cache-control-headers),
[GitHub GraphQL authentication](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql).

#### Verification for this change

- All 14 Node regression tests passed, including runtime HTTP failure/recovery,
  token fallback, invalid upstream data, and uncached retry behavior.
- TypeScript and targeted ESLint checks passed.
- `next build --webpack` passed and generated all 13 pages. The output confirms
  `/` is static and `/api/github` runs on demand.
- The default Turbopack build hit a local CSS-worker startup crash. Webpack was
  used for production-preview verification; the project's build command was not
  changed. A Vercel build has not been run in this task.
- The real local production endpoint returned HTTP 200 with 369 days and the
  expected success cache headers. The browser displayed the contribution graph,
  summary totals, and working refresh button. The public fallback also returned
  real data in a separate token-free request.
- The browser showed a single Home indicator without hover underlines and could
  navigate through the mobile menu. HTTP checks confirmed exactly one current
  navigation link on Home, Projects, and Experience.
- Existing HTTP smoke checks passed using `http://localhost:3000`. Using
  `127.0.0.1` for those POST checks triggers the existing origin guard because
  Next.js resolves the internal request origin as `localhost`.
- The production preview is running at `http://localhost:3000`; no deployment or
  Vercel environment-variable changes were made.

### Issues fixed

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

### Earlier repair verification

At the end of the earlier repair: lint passed with zero warnings; generated route types and TypeScript
passed; all 7 regression tests passed; the production build generated all 12 pages
successfully; all local HTTP smoke checks passed. That run used a development
server on port 3000; see the current verification above for this run.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
## Requires a running server:
npm run check:site
```

HTTP checks cover Home, Projects, Experience, Contact, icon, Open Graph image,
robots, sitemap, avatar, banner, missing-page 404, invalid/malformed/oversized contact
payloads, incorrect media types, cross-origin rejection, email trimming, honeypot,
and the configured email-app fallback. They do not send email or increment visitor
counts. Seven unit tests additionally cover actual UTF-8 byte limits and concurrent
view requests, failures, retries, and invalid counts.

### Run / restart

```powershell
cd D:\CODING\Projects\portfolio
npm run dev -- --hostname 127.0.0.1
```

Open [localhost:3000](http://localhost:3000) or [127.0.0.1:3000](http://127.0.0.1:3000).
Reload an old error page. Closing the server process stops the preview.

### Remaining inputs and verification limits

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
