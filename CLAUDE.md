# Adventure 101 Tour — Claude Code Instructions

Static multi-page website for **Adventure 101 Tour Ltd**, a Nigerian premium travel company owned by Debola Obaje. Deployed at **https://adventure101.vercel.app**.

---

## Stack

- Pure static HTML / CSS / JS. **No build system, no bundler, no npm dependencies.**
- 7 pages: `index.html`, `tours.html`, `services.html`, `faq.html`, `blog.html`, `contact.html` (nav/footer injected via JS).
- CSS split: `css/style.css` (global tokens + nav/footer/buttons), `css/home.css` (homepage only), `css/pages.css` (all inner pages). **Never cross-load `home.css` and `pages.css`** — `index.html` uses `home.css`, every other page uses `pages.css`.
- `js/components.js` injects nav + footer on every page and locks `data-theme="dark"` at runtime.
- `js/main.js` is scroll-reveal via IntersectionObserver.
- Hero (homepage) crossfades three `<video>` elements every 14s: `hero_video1.mp4` (Obudu), `hero_video2.mp4`, `jetski_zanzi_web.mp4`.

## Commands

```bash
# Local preview
python3 -m http.server 8000       # then open http://localhost:8000

# Search for banned em dashes
grep -rn '—' *.html js/

# Deploy
git add -A && git commit -m "…" && git push origin main
vercel --prod                      # if auto-deploy isn't wired
```

---

## Brand — non-negotiable

| Thing | Value |
|---|---|
| Primary colour | `#A86704` (amber/brown) — `--color-primary` in `:root` |
| Background | `#0e0d0a` (dark-mode only — no light-mode CSS exists) |
| Heading font | Cabinet Grotesk 700–800 (Fontshare CDN) |
| Body font | Satoshi 400–500 (Fontshare CDN) |
| Logo | `images/logo_transparent.png` — `filter: none`, do NOT invert or tint |

Dark mode is the only mode. Don't add a toggle. Don't add light-mode CSS.

## Copy voice — BANNED patterns

The client explicitly flagged these as AI writing tells and demanded they be removed. **The previous agent claimed compliance but the live site still violates most of them.** A cleanup pass is in the priority list below.

Banned in Claude-written body copy:
- **Em dashes (`—`)** — replace with commas, colons, or sentence restructure. Never use.
- Words: *stands as, testament to, vital, crucial, pivotal, underscores, reflects broader, contributing to, setting the stage for, curating*.
- Present-participle openers: "Offering X, we…" — restructure.
- Empty triple-lists: "the culture, the landscapes, the people".
- Corporate filler: "went above and beyond", "in a league of its own", "eye-opening experience".

**Exception:** Testimonials are direct quotes from real clients. Restore them verbatim from the Canva source even if their phrasing overlaps banned patterns — a client saying "eye-opening experience" is their voice, not Claude's.

See `Signs_of_AI_Writing.docx` in the project root for the full Wikipedia reference list.

---

## Testimonials — restore from Canva source

The three homepage testimonials were taken from https://techlytics.my.canva.site/adventure101 but the previous agent added fabricated sentences. Restore to these originals, verbatim:

**Titilayo Deji:** "Adventure101Tour made my dream trip a reality! From the moment I booked my adventure to the last day of our tour, everything was seamless."

**Zubi Ike:** "Adventure101Tour is in a league of its own. The attention to detail and the level of care they put into each trip is outstanding. I recently joined their expedition to Nigeria, and it was an eye-opening experience."

**Alex Utobo:** "As a solo traveler, I was a bit nervous about going on an adventure with a group, but Adventure101Tour made me feel like part of a family."

Drop the attribution labels ("Group Tour — Nigeria" etc.) unless Debola confirms them — the Canva source doesn't include them.

---

## Business details

| Field | Value |
|---|---|
| Company | Adventure 101 Tour Limited (BN 3268546, Nigeria) |
| Owner | Debola Obaje |
| Tagline | "A delightful experience at every touch point." |
| Email | `info@adventure101tour.com` (domain pending) |
| Nigeria WhatsApp | +234 909 864 0296 → https://wa.me/2349098640296 |
| UK WhatsApp | +44 7721 518621 → https://wa.me/447721518621 |
| Address | No. 27, C Close (Afe I. O.), Kado Estate, Abuja |
| Instagram | @adventure101tour |
| X | @adventure101ng |

Tour prices (from Canva catalogue at https://canva.link/adventure101):

| Destination | Price | Notes |
|---|---|---|
| Ghana | From $919/person | Excl. flights |
| Rwanda | From $1,250/person | Excl. flights |
| Zanzibar | From $1,600/person | 6 days |
| Tanzania — Kilimanjaro | From $2,850/person | 7 days |
| Tanzania — Serengeti/Ngorongoro | From $3,350/person | 8 days |
| Lebanon | From $4,000/person | 5 nights |
| Egypt | From $1,548/person | 8 nights |

Upcoming fixed-date tour: **September 2026 — Lagos → Cotonou → Accra**, max 12 guests, open to public.

---

## Priority task list

### HIGH — do first
1. **Em-dash audit.** Run `grep -rn '—' *.html js/` — expect ~10+ hits on index.html alone (hero sub, about strip, value chips, upcoming banner, testimonials header, contact CTA, plus alt text). Replace per the voice rules above.
2. **Restore testimonials** to the Canva verbatim text in the section above.
3. **Contact form backend.** Currently the form shows a success message and sends nothing. Wire EmailJS routed to `info@adventure101tour.com`. SDK: `<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>`. Until wired, consider disabling submit or swapping to a `mailto:` fallback so users aren't misled.

### MEDIUM
4. **Individual tour pages.** Every tour card currently links to `#`. Build `tours/ghana.html`, `tours/rwanda.html`, etc. using the Canva catalogue content. Each should have itinerary + inclusions + WhatsApp CTA with message prefilled with tour name (`?text=Hi, I'm interested in the Ghana tour`).
5. **Playwright QA.** Screenshot every page at 1280×900 and 375×812. Flag any layout breaks. Save to `qa/` folder (gitignore it).
6. **Per-page WhatsApp prefill.** Currently generic message. Customise per page context.
7. **Mobile nav** — test on real device that tapping a nav link closes the menu (outside-click handler should cover this but verify).
8. **Verify service-block `object-position`** values on `services.html` — client previously flagged sky-heavy crops.

### LOW / future
9. Open Graph + Twitter Card meta tags for social previews.
10. GA4 or Plausible analytics.
11. Image optimisation: PNG → WebP, compress.
12. Real blog posts (3 placeholders currently).
13. FAQ `max-height: 800px` is hardcoded — answers longer than that will clip. Swap to JS-measured height.
14. **Theme-flash fix.** `data-theme="dark"` is set by `components.js` at runtime, causing a brief flash on first paint before JS loads. Set `data-theme="dark"` directly on `<html>` in every HTML file (it already is in `index.html` — verify the others).

---

## Gotchas (from prior sessions)

- **Repo name is `adventure1010tour`** (with extra `10`), Vercel project is `adventure101`. These are different — don't confuse them.
- `hero_video2.mp4` was previously corrupt after a Google Drive download — downloaded URL returned HTML redirect instead of MP4. After any media download from Drive, verify: `file images/hero_video2.mp4` must say `ISO Media`, not `HTML document`.
- FAQ page uses `.faq-answer` class. `pages.css` also has legacy `.accordion-body` — don't merge them.
- `blog.html` uses `.blog-card__read-more` and `.blog-card__img-wrap`; `pages.css` has both those and the shorter `.blog-card__read` / `.blog-card__img`. Both aliased — don't remove either set.
- `contact.html` wrappers are `.form-field` (not `.form-group`). If spacing breaks on the form, that's what to check.
- Never apply `filter:` to the logo. Dark background alone makes it render correctly.

## Disregard from previous handover

The previous handover doc (`adventure101_handover.docx` in project root) was written for Perplexity's environment. Ignore these parts:

- `api_credentials=["github"]` / `api_credentials=["vercel"]` bash parameters — Perplexity-specific, don't exist here.
- `NODE_TLS_REJECT_UNAUTHORIZED=0` on the `vercel` command — that was a Perplexity proxy cert workaround. Don't use it; it disables TLS verification globally for that process.
- The `https://git-agent-proxy.perplexity.ai/…` git remote — should be `https://github.com/pelumiolawole/adventure1010tour.git`.
- Workspace path `/home/user/workspace/adventure101/` — replace with wherever you've cloned locally.

The handover also claims items in the "17-point brief" are DONE that aren't (em dashes especially). Treat it as historical context, not a source of truth about current state. This file is the source of truth.

---

## Plan Mode Report (Session 1: April 22, 2026)

### AUDIT FINDINGS

#### 1. Em-Dash Audit: 37 Instances Found

Located em dashes (�) in all HTML files and js/components.js:
- **index.html**: 12 instances (title, hero, value chips, testimonials, featured tour)
- **tours.html**: 15 instances (title, meta description, tour descriptions, comments)
- **faq.html**: 5 instances
- **contact.html**: 3 instances
- **services.html**: 1 instance
- **js/components.js**: 1 instance (comment)

#### 2. Testimonials: ALL THREE ARE FABRICATIONS

**Titilayo Deji**
- Canva: "Adventure101Tour made my dream trip a reality! From the moment I booked my adventure to the last day of our tour, everything was seamless."
- Live: Added "went above and beyond" + "less like a tour company and more like traveling with family" (fabricated)

**Zubi Ike**
- Canva: "Adventure101Tour is in a league of its own. The attention to detail and the level of care they put into each trip is outstanding. I recently joined their expedition to Nigeria, and it was an eye-opening experience."
- Live: Replaced entire opening with "The culture, the landscapes, the people" (banned empty triple-list) + "I will be back" (fabricated)

**Alex Utobo**
- Canva: "As a solo traveler, I was a bit nervous about going on an adventure with a group, but Adventure101Tour made me feel like part of a family."
- Live: Added "immediately" + "The organisation, the guides, the energy � I felt safe, welcomed, and genuinely inspired." (fabricated)

#### 3. Contact Form: Non-Functional ? Misleads Users

**Current state** (contact.html, lines 222�270):
- ? Client-side validation works (required fields, honeypot anti-spam)
- ? **NO backend wired** � form data sent nowhere
- ? **Shows success message** ("We'll be in touch within 24 hours") but email is never received
- ? Users deceived; Debola receives zero enquiry emails from this form

Form handler currently just hides form and shows success overlay. No email service integration.

#### 4. Tour Cards & href="#": NONE FOUND

? All 9 tour cards + bespoke CTA use functional WhatsApp links. No href="#" placeholders. **No action needed.**

---

### PROPOSED FIXES � ORDERED BY RISK (Smallest ? Largest)

| Priority | Risk | Task | Effort | Impact |
|----------|------|------|--------|--------|
| **1** | Lowest | Remove all 37 em dashes | 30 min | High (brand compliance) |
| **2** | Low | Restore 3 testimonials to Canva originals | 15 min | High (credibility) |
| **3** | **CRITICAL** | **Wire contact form to EmailJS** | 45 min | **Highest** (revenue loss if unfixed) |

---

### RECOMMENDED EXECUTION SEQUENCE

1. Execute Fix 1 (em-dashes) � bulk string replacements, zero risk
2. Execute Fix 2 (testimonials) � straightforward text swap, zero risk  
3. Execute Fix 3 (EmailJS) � *requires* EmailJS account setup + credentials

**Status**: All fixes ready to deploy once approved.


---
    ## Plan Mode Report (Session 2: April 22, 2026)                                
                                                                                 
    ### ISSUES IDENTIFIED

    #### 1. Nav Not Fixed on iOS Safari

    **Root cause:** `overflow-x: hidden` set on `body` breaks `position: fixed` on
    iOS Safari — a well-known browser bug. The nav appeared fixed at first load but
     scrolled with the page once the user started scrolling.

    **Fix:** Moved `overflow-x: hidden` from `body` to `html` element in
    `css/style.css`. Setting it on `html` does not trigger the iOS bug.

    #### 2. Scrolled Nav Background Kills Logo on Mobile

    **Root cause:** `.nav.scrolled` applied `color-mix(in srgb, var(--color-bg)
    92%, transparent)` — nearly solid `#0e0d0a` (dark). The logo has dark/black
    elements that become invisible against this background.

    **Fix:** Changed `.nav.scrolled` background to `rgba(255, 255, 255, 0.93)` with
     `backdrop-filter: blur(16px)`. Also darkened nav link colours (`#3a3530` /
    `#0e0d0a`) and burger icon (`#1a1815`) when scrolled, so they remain legible on
     the white background.

    #### 3. Hamburger Menu Not Responding on Mobile

    **Root cause:** Two compounding issues — (a) the iOS `overflow-x: hidden` /
    `position: fixed` bug (see above) suppressed touch events on fixed elements;
    (b) the burger button lacked `touch-action: manipulation`, causing a 300ms tap
    delay on mobile browsers.

    **Fix:** Both root causes addressed: overflow moved to `html`, and
    `touch-action: manipulation` added to `.nav__burger` in CSS.

    #### 4. Mobile Menu Styled for Dark Background, Not White Nav

    **Root cause:** `.nav__mobile` used `color-mix(in srgb, var(--color-bg) 97%,
    transparent)` (dark background) with light-coloured link text — visually
    inconsistent once the nav became white.

    **Fix:** Mobile menu updated to `rgba(255, 255, 255, 0.97)` background with
    dark link text (`#1a1815`), `rgba(0,0,0,0.07)` dividers, and `touch-action:
    manipulation` on links for snappy tap response.

    ---

    ### FILES CHANGED

    | File | Change |
    |---|---|
    | `css/style.css` | `overflow-x: hidden` moved from `body` → `html` |
    | `css/style.css` | `.nav.scrolled` background → white semi-transparent |
    | `css/style.css` | `.nav.scrolled` link + burger colours → dark |
    | `css/style.css` | `.nav__mobile` background → white, links → dark |
    | `css/style.css` | `.nav__burger` — added `touch-action: manipulation` |

---

## Plan Mode Report (Session 3: April 22, 2026)

### ISSUES IDENTIFIED

#### 1. Hamburger Menu Not Opening on Click
**Root cause:** Burger click handler used event delegation (`document.addEventListener('click', e => { e.target.closest('#navBurger') ... })`). On iOS Safari, tap-generated click events on `<button>` elements inside `position: fixed` containers do not reliably bubble to `document`. The CSS toggle and the close-on-link-click handler are both correct — only the delegation pattern is the root cause.
**Fix:** Replace the `document.addEventListener` burger delegation with a direct `navBurger.addEventListener('click', ...)` bound immediately after nav HTML is injected in the IIFE.

#### 2. Nav Background Wrong at First Load (Session 2 Regression)
**Root cause:** Session 2 set `.nav.scrolled` to white `rgba(255, 255, 255, 0.93)` — wrong for a dark-only brand. Also forced light link colours and dark burger icon, and turned the mobile menu white. All wrong for this brand.
**Fix:** Revert `.nav.scrolled` to `rgba(14, 13, 10, 0.85)` + `backdrop-filter: blur(16px)`. Revert nav link colours, remove burger colour override, revert mobile menu to dark background with light link text.

#### 3. Page Content Obscured by Nav at First Load
**Root cause:** `body` has no `padding-top`. Inner pages already handled via `.page-hero__content { padding-top: 120px }` in `pages.css`. Homepage hero uses `align-items: flex-end` so text is at the bottom — not obscured — but `.hero__content` has no `padding-top`, leaving a gap risk on short/landscape viewports.
**Fix:** Add `padding-top: var(--nav-height)` to `.hero__content` in `style.css`.

### FILES CHANGED

| File | Change |
|---|---|
| `js/components.js` | Replace `document.addEventListener` burger delegation with direct `navBurger.addEventListener('click', ...)` |
| `css/style.css` | `.nav.scrolled` → dark `rgba(14, 13, 10, 0.85)` + `backdrop-filter: blur(16px)` |
| `css/style.css` | Revert `.nav.scrolled .nav__links a` to light colours |
| `css/style.css` | Remove `.nav.scrolled .nav__burger { color: #1a1815 }` |
| `css/style.css` | `.nav__mobile` background → dark `rgba(14, 13, 10, 0.97)`, links → `var(--color-text)` |
| `css/style.css` | `.hero__content` → add `padding-top: var(--nav-height)` |

## Plan Mode Report (Session 4: April 22, 2026)

### ISSUES IDENTIFIED

#### 1. Hamburger Menu Still Not Responding (iOS Safari)
**Root cause:** The direct `addEventListener('click', ...)` was structurally correct but missing `e.stopPropagation()`. On iOS Safari, click events inside `position: fixed` containers can bubble unexpectedly and re-trigger other handlers in the same frame, causing the menu to open and immediately close. Additionally, `.nav__burger` was missing `-webkit-tap-highlight-color: transparent` and an explicit `cursor: pointer` declaration — iOS Safari requires both on custom button elements to guarantee reliable tap/click delivery.
**Fix:** Added `e.stopPropagation()` to the burger click handler in `components.js`. Added `-webkit-tap-highlight-color: transparent` and explicit `cursor: pointer` to `.nav__burger` in `style.css`.

#### 2. Nav Background: Transparent Was Too Invisible at First Load
**Root cause:** `background: transparent` made the nav indistinguishable from the hero video behind it — logo and links visually merged into the video with no separation.
**Fix:** Changed `.nav` initial background to `linear-gradient(to bottom, rgba(10, 8, 5, 0.55) 0%, transparent 100%)` — a subtle dark gradient that separates the nav visually without appearing as a solid bar.

#### 3. Scrolled Nav Background: Dark Hid the Logo (Regression from Session 3)
**Root cause:** Session 3 reverted Session 2's white scrolled background back to dark `rgba(14,13,10,0.85)`. The logo (`logo_transparent.png`) has a black triangle and black wordmark — these disappear on a dark scrolled background.
**Fix:** `.nav.scrolled` set to `rgba(255, 255, 255, 0.92)` with `backdrop-filter: blur(20px)`. Nav link colours set to `#2a2520` when scrolled (dark on white). Burger icon set to `#1a1815` when scrolled. Mobile menu background set to `rgba(255, 255, 255, 0.96)` with dark `#1a1815` link text — consistent with the white scrolled bar.

### FILES CHANGED

| File | Change |
|---|---|
| `js/components.js` | Burger click handler: added `e.stopPropagation()` |
| `css/style.css` | `.nav` initial background: transparent → subtle dark gradient |
| `css/style.css` | `.nav.scrolled` background: dark → `rgba(255,255,255,0.92)` + blur |
| `css/style.css` | `.nav.scrolled .nav__links a` colour: muted light → `#2a2520` |
| `css/style.css` | `.nav.scrolled .nav__burger` colour: added `#1a1815` |
| `css/style.css` | `.nav__burger`: added `-webkit-tap-highlight-color` + explicit `cursor: pointer` |
| `css/style.css` | `.nav__mobile`: white background + dark `#1a1815` link text |

---

## Plan Mode Report (Session 5: April 22, 2026)

### ISSUES IDENTIFIED

#### Critical: Missing CSS Definitions (Zero Styling)

These classes are used in HTML but have **no CSS rules anywhere** — content renders with zero padding/layout:

| Class | Used in | Impact |
|---|---|---|
| `.page-section` | tours.html (×2), faq.html, contact.html | No section padding on these pages |
| `.page-section--alt` | tours.html | No alternate background |
| `.section-intro` | tours.html (×2), faq.html | No spacing between label/h2/p, no bottom margin |
| `.custom-tour-strip` | tours.html, faq.html | CTA strip completely unstyled |
| `.strip-actions` | tours.html, faq.html | Button row has no flex layout |

#### Token Bug: `--space-28` Undefined
`pages.css` `.section` uses `var(--space-28)` as the clamp max, but this token does not exist in `:root`. Resolved as empty — section padding max value silently broken.

#### `style.css` — 4 Violations
- `body` line-height `1.65` → needs ≥ 1.7
- `p, li` max-width `70ch` → needs `60ch`
- `h1–h4` line-height `1.12` → needs ≤ 1.1
- `.section__header h2` margin-bottom `var(--space-5)` → needs ≥ `var(--space-6)`

#### `home.css` — 7 Violations
- `.about-strip` padding-block min 4rem → needs min 5rem
- `.about-strip__text` gap `var(--space-5)` → needs `var(--space-6)`
- `.about-strip__text p` max-width `none` → needs `60ch`
- `.services-grid` gap `var(--space-5)` → needs `var(--space-8)` (card grid)
- `.service-tile__body p` line-height `1.6` → needs 1.7
- `.upcoming-banner` padding-block min 3rem → needs min 5rem
- `.upcoming-banner__left h2` margin-bottom `var(--space-4)` → needs `var(--space-6)`

#### `pages.css` — 12 Violations
- `.section` padding min 4rem + uses undefined `--space-28` token → needs `clamp(var(--space-20), 10vw, var(--space-32))`
- `.section` at 640px breakpoint: `var(--space-16)` (4rem) → needs `var(--space-20)` (5rem)
- `.section__title` margin-bottom `var(--space-5)` → needs `var(--space-6)`
- `.service-block__title` margin-bottom `var(--space-5)` → needs `var(--space-6)`
- `.tours-grid` gap `var(--space-6)` → needs `var(--space-8)` (card grid)
- `.tour-card__desc` line-height `1.65` → needs 1.7
- `.blog-grid` gap `var(--space-6)` → needs `var(--space-8)` (card grid)
- `.blog-card__excerpt` line-height `1.65` → needs 1.7
- `.blog-card__meta, .blog-card__date` margin-bottom `var(--space-2)` → needs `var(--space-3)`
- `.faq-answer__inner` padding missing top → add `var(--space-5)` top
- `.upcoming-banner__desc` line-height `1.65` → needs 1.7
- `.jet-spec-card__detail` line-height `1.6` → needs 1.7

### FILES CHANGED

| File | Change |
|---|---|
| `css/style.css` | body line-height → 1.7; p/li max-width → 60ch; h1–h4 line-height → 1.1; .section__header h2 margin-bottom → var(--space-6) |
| `css/home.css` | about-strip padding-block, gap, p max-width; services-grid gap; service-tile body p line-height; upcoming-banner padding-block and h2 margin-bottom |
| `css/pages.css` | .section padding fixed (token bug + min value); breakpoint padding; section/service-block title margins; tours/blog grid gaps; tour-card/blog-card/upcoming-banner/jet-spec line-heights; faq-answer top padding; blog-card eyebrow margin |
| `css/pages.css` | Added missing class definitions: .page-section, .page-section--alt, .section-intro, .custom-tour-strip, .strip-actions |
| HTML files | Em-dash replacements across index.html, tours.html, services.html, contact.html |

---

## Plan Mode Report (Session 6: April 22, 2026)

### ISSUES IDENTIFIED

#### 1. Hamburger — `.nav__mobile` potentially clipped by overflow ancestor
**Root cause:** `html { overflow-x: hidden }` is a clipping ancestor for `position: sticky` on some iOS Safari builds. Dropdown children that extend below the nav bar height can be clipped.
**Fix:** Add `overflow: visible` to `.nav`. Add `z-index: 101` to `.nav__mobile`.

#### 2. Hamburger — `.hero { overflow: hidden }` stacking context risk
**Root cause:** `.hero` has `position: relative` and `overflow: hidden` but no `z-index`. No stacking context now, but zero isolation from future z-index changes that could let it paint over the dropdown.
**Fix:** Add `z-index: 1` to `.hero` to pin it below nav's z-index: 100.

#### 3. Hamburger — null guard has no diagnostic output
**Root cause:** Current code silently skips setup if `getElementById` returns null. No error surfaced.
**Fix:** Add explicit `console.warn` calls for `navBurger` and `navMobile` null cases.

#### 4. Mobile menu — tap target too small, spacing too tight
**Root cause:** `.nav__mobile a { padding: var(--space-2) 0 }` — no `min-height`. Gap is `var(--space-5)`.
**Fix:** gap → `var(--space-6)`, padding block → `var(--space-8)`. Links: `display:flex; align-items:center; min-height:44px; font-size:1.1rem; padding:0.8rem 0`.

#### 5. style.css — hero overlay too light at key gradient stops
**Root cause:** `.hero__overlay` stops `0.2/0.1/0.65/0.93` — mid-section nearly transparent, text competes with bright video.
**Fix:** Update stops to `0.35/0.2/0.75/0.95`.

#### 6. style.css — hero stats flush against CTAs, no separation
**Root cause:** `.hero__stats` has no `margin-top`. Stats abut CTAs with only parent flex gap.
**Fix:** Add `margin-top: var(--space-8)`.

#### 7. style.css — hero text too large on mobile
**Root cause:** `--text-hero: clamp(3.2rem, 1rem + 6.5vw, 7rem)` — 3.2rem minimum too large for small viewports.
**Fix:** Change to `clamp(2.5rem, 6vw, 5rem)`.

#### 8. style.css — testimonial cards too tight internally
**Root cause:** `.testimonial-card { gap: var(--space-5); padding: var(--space-8) }` — insufficient breathing room.
**Fix:** `gap: var(--space-6)`, `padding: var(--space-10)`.

#### 9. style.css — contact CTA and footer gaps too small
**Root cause:** `.contact-cta__content { gap: var(--space-6) }`, `.footer__inner { gap: var(--space-10) }`.
**Fix:** `gap: var(--space-8)` and `gap: var(--space-12)` respectively.

#### 10. style.css — no global 44px tap-target baseline
**Root cause:** No `min-height` on `a, button`.
**Fix:** Add `a, button { min-height: 44px; }`.

#### 11. home.css — about-strip padding uses 10vw (too tight mid-range)
**Root cause:** `clamp(var(--space-20), 10vw, var(--space-32))` — at 800px viewport gives only 80px padding.
**Fix:** Change to `clamp(5rem, 12vw, 8rem)`.

#### 12. home.css — about-strip text gap and line-height too tight
**Root cause:** `gap: var(--space-6)`, `line-height: 1.75`.
**Fix:** gap → `var(--space-8)`, line-height → 1.8.

#### 13. home.css — services grid no 900px single-column breakpoint
**Root cause:** Grid collapses only at 1100px (2col) and 580px (1col). Tiles become very narrow between 580–900px.
**Fix:** Add `@media (max-width: 900px) { .services-grid { grid-template-columns: 1fr; } }`.

#### 14. home.css — upcoming banner uses 8vw (inconsistent with other sections)
**Root cause:** `clamp(var(--space-20), 8vw, var(--space-32))`.
**Fix:** Change to `clamp(5rem, 12vw, 8rem)`.

#### 15. home.css — upcoming banner paragraph line-height too tight
**Root cause:** `.upcoming-banner__left p { line-height: 1.7 }`.
**Fix:** Change to 1.8.

#### 16. pages.css — .section padding uses old vw and mixes block/inline in shorthand
**Root cause:** `padding: clamp(var(--space-20), 10vw, var(--space-32)) var(--space-8)`.
**Fix:** `padding-block: clamp(5rem, 12vw, 8rem); padding-inline: var(--space-8)`. Update 640px breakpoint to `padding-block: var(--space-20)`.

#### 17. pages.css — .tour-card__body gap missing, padding not asymmetric
**Root cause:** `padding: var(--space-6)` uniform, no `gap` defined.
**Fix:** `gap: var(--space-4); padding: var(--space-6) var(--space-6) var(--space-8)`.

#### 18. pages.css — .tour-card p line-height too tight (style.css value bleeds in)
**Root cause:** `style.css` sets `.tour-card p { line-height: 1.65 }` globally.
**Fix:** Override in pages.css: `.tour-card p { line-height: 1.7 }`.

#### 19. pages.css — no 900px single-column breakpoint for `.services__grid`
**Root cause:** `.services__grid` (style.css) only collapses at 640px.
**Fix:** Add `@media (max-width: 900px) { .services__grid { grid-template-columns: 1fr; gap: var(--space-8); } }`.

#### 20. pages.css — .service-block padding uses old non-block shorthand
**Root cause:** `padding: clamp(var(--space-16), 7vw, var(--space-24)) var(--space-8)`.
**Fix:** `padding-block: clamp(5rem, 12vw, 8rem)`.

#### 21. pages.css — .service-block p line-height not explicitly set
**Root cause:** No `.service-block p` rule. Body text inherits defaults.
**Fix:** Add `.service-block p { line-height: 1.8; max-width: 60ch; }`.

#### 22. pages.css — .faq-question missing min-height tap target
**Root cause:** No `min-height` on `.faq-question`.
**Fix:** Add `min-height: 44px`.

#### 23. pages.css — .contact-layout gap grows too aggressively
**Root cause:** `gap: clamp(var(--space-12), 6vw, var(--space-20))`.
**Fix:** `gap: var(--space-12)`.

#### 24. pages.css — .page-hero has no padding-top, content bunches at nav
**Root cause:** Only `padding-bottom: var(--space-16)` set. No top clearance.
**Fix:** Add `padding-block: clamp(4rem, 8vw, 6rem)`. Add breadcrumb, h1, and subtitle spacing.

### FILES TO CHANGE

| File | Change |
|---|---|
| `js/components.js` | Add `console.warn` null guards for navBurger/navMobile |
| `css/style.css` | `.nav`: `overflow: visible`; `.nav__mobile`: z-index 101, gap, padding; links: min-height, font-size, padding |
| `css/style.css` | `.hero`: z-index 1; `--text-hero` token; `.hero__overlay` gradient; `.hero__stats` margin-top |
| `css/style.css` | `.testimonial-card`: gap + padding; `.contact-cta__content` gap; `.footer__inner` gap; `a, button` min-height |
| `css/home.css` | `.about-strip`: padding-block, gap; `.about-strip__text p`: line-height |
| `css/home.css` | `.services-grid`: 900px breakpoint |
| `css/home.css` | `.upcoming-banner`: padding-block; `.upcoming-banner__left p`: line-height |
| `css/pages.css` | `.section`: padding-block + padding-inline; media queries |
| `css/pages.css` | `.tour-card__body`: gap, padding; `.tour-card p`: line-height |
| `css/pages.css` | `.services__grid`: 900px breakpoint; `.service-block`: padding-block, p styles |
| `css/pages.css` | `.faq-question`: min-height; `.contact-layout`: gap; `.contact-form .btn`: margin-top |
| `css/pages.css` | `.page-hero`: padding-block, breadcrumb, h1, subtitle spacing |


---

## Plan Mode Report (Session 7: April 22, 2026)

### PART 1 — CSS REWRITE

**home.css — rewrite from scratch**

| Component | Classes |
|---|---|
| About Strip layout | `.about-strip`, `.about-strip__inner`, `.about-strip__text`, `.about-strip__images`, `.about-strip__img-main`, `.about-strip__img-accent` |
| About Strip values | `.about-strip__values`, `.value-chip` |
| Services Overview | `.services-overview`, `.services-grid` |
| Service Tile | `.service-tile`, `.service-tile__img`, `.service-tile__overlay`, `.service-tile__body`, `.service-tile__icon`, `.service-tile__cta` |
| Upcoming Banner | `.upcoming-banner`, `.upcoming-banner__inner`, `.upcoming-banner__left`, `.upcoming-badge`, `.upcoming-banner__meta`, `.upcoming-banner__countries` |
| Country Stop | `.country-stop`, `.country-stop__dot`, `.country-stop__line` |
| Gallery Strip | `.gallery-strip`, `.gallery-strip__track`, `.gallery-strip__item` |
| Gallery animation | `@keyframes gallery-scroll` |

**pages.css — rewrite from scratch**

| Component | Classes |
|---|---|
| Page Hero | `.page-hero`, `.page-hero__bg`, `.page-hero__overlay`, `.page-hero__content`, `.page-hero__subtitle` |
| Breadcrumb | `.breadcrumb`, `.breadcrumb__sep`, `.breadcrumb__current` |
| Section wrapper | `.section`, `.section--alt`, `.section__inner`, `.section__header`, `.section__eyebrow`, `.section__title`, `.section__lead` |
| Page section | `.page-section`, `.page-section--alt`, `.section-intro` |
| Custom tour strip | `.custom-tour-strip`, `.strip-actions` |
| Tours grid | `.tours-grid` |
| Featured tour | `.featured-tour`, `.featured-tour__img`, `.featured-tour__overlay`, `.featured-tour__body`, `.featured-tour__meta`, `.featured-tour__price`, `.featured-tour__desc` |
| Tour card | `.tour-card`, `.tour-card__img`, `.tour-card__overlay`, `.tour-card__body`, `.tour-card__meta`, `.tour-card__footer`, `.tour-card__price`, `.tour-card__desc` |
| Service section | `.service-section`, `.service-section--reversed`, `.service-section__img-wrap`, `.service-section__img-secondary`, `.service-section__content`, `.service-section__label` |
| Feature list | `.feature-list` |
| Bespoke section | `.bespoke-section`, `.bespoke-section__bg`, `.bespoke-section__overlay`, `.bespoke-section__content` |
| TNPL callout | `.tnpl-callout` |
| Countries grid | `.countries-grid`, `.country-tag` |
| Visa/Birth grid | `.visa-birth-grid`, `.vb-card`, `.vb-card__img-wrap`, `.vb-card__body` |
| Birth testimonial | `.birth-testimonial` |
| Discretion note | `.discretion-note` |
| WhatsApp btn | `.whatsapp-btn` |
| FAQ accordion | `.faq-list`, `.faq-item`, `.faq-question`, `.faq-question__text`, `.faq-question__icon`, `.faq-answer`, `.faq-answer__inner` |
| Blog grid | `.blog-grid`, `.blog-card`, `.blog-card__img-wrap`, `.blog-card__img`, `.blog-card__body`, `.blog-card__eyebrow`, `.blog-card__title`, `.blog-card__excerpt`, `.blog-card__meta`, `.blog-card__date`, `.blog-card__read-more`, `.blog-card__read` |
| Newsletter | `.newsletter-strip`, `.newsletter-form` |
| Contact layout | `.contact-layout`, `.contact-form-wrap`, `.contact-details` |
| Form fields | `.form-honeypot`, `.form-field`, `.form-submit`, `.form-note`, `.form-success`, `.form-success__icon`, `.required` |
| Contact cards | `.contact-card`, `.contact-card__icon`, `.office-hours`, `.office-hours__dot`, `.quick-links`, `.quick-link` |
| Jet spec | `.jet-spec-card`, `.jet-spec-card__detail` |
| Slide element | `.slide` |

### PART 2 — SERVICES COPY CHANGES

**Birth Tourism section**

| Element | Change |
|---|---|
| `h3` heading | "The Gift of Dual Citizenship" → "The Gift of Citizenship at Birth" |
| Location | Current USA/Canada references → Barbados |
| Body paragraph | Replace with: "Barbados offers one of the most straightforward birth tourism pathways available. Children born on the island acquire Barbadian citizenship by birth, with a clear route to a second passport. We handle logistics end to end: travel, accommodation, prenatal care coordination, and post-birth documentation." |
| Budget line | Add: "Base budget from $12,000" |

**Private Jet section**

| Element | Change |
|---|---|
| Fleet | Remove Gulfstream 550; Legacy 600 only |
| New bullet | Add Starlink in-flight connectivity |
| Charter text | Change to: "Available for corporate and private charter" |

**Bespoke Vacations section**

| Element | Change |
|---|---|
| Body paragraph | Replace with: "Every itinerary is built from scratch. Tell us where you want to go, how you want to feel when you arrive, and what matters most. We design around that — accommodation, transport, dining, experiences — with no pre-packaged constraints." |

### PART 3 — HAMBURGER FIX

**style.css**
- `.nav__mobile` z-index: 101 → 200

### FILES TO CHANGE

| File | Change |
|---|---|
| `css/home.css` | Delete and rewrite from scratch |
| `css/pages.css` | Delete and rewrite from scratch |
| `services.html` | Birth tourism: heading, location, body, budget; Private jet: remove Gulfstream, add Starlink bullet, charter text; Bespoke: body copy |
| `css/style.css` | `.nav__mobile` z-index 101 → 200 |

---

## Plan Mode Report (Session 8: 2026-05-16)

### SOURCE AUDIT — MANUS VERSION

#### Shared Components

**Navbar**
- Fixed position, transparent at top → `rgba(14,13,10,0.9)` + `backdrop-blur-xl` + `border-b` at scroll > 60px
- `y: -100 → 0` mount entrance (0.6s)
- Active link: amber colour + spring-animated underline bar (`layoutId="nav-underline"`, spring stiffness 380 damping 30)
- Desktop: `h-[76px]` flex container; Book Now amber button (hidden <640px)
- Mobile: full-screen dark overlay (`fixed inset-0 z-[99] bg-[#0e0d0a]/95 backdrop-blur-xl`), links stagger in (delay: `0.15 + i * 0.05s`), Book Now large button, closes on route change
- Burger: X/Menu icon swap; `body overflow: hidden` when open

**Footer**
- `bg-[#0a0908]` with `border-t`
- 4-col grid (1→2→4): brand+tagline+social icons, Explore links, Services links, Contact details
- Social icons: Instagram, X (SVG), WhatsApp — 10×10 rounded-lg icon boxes
- Copyright: `© 2026 Adventure 101 Tour Limited · BN 3268546`

**PageHero**
- `h-[50vh] min-h-[380px] max-h-[500px]`, `items-end` (text anchors bottom)
- Full-bleed image with gradient overlay: `from-[#0e0d0a] via-[#0e0d0a]/70 to-[#0e0d0a]/30`
- Breadcrumb `›` link + current page label — fadeUpVariants delay 0
- `h1` 4xl→6xl extrabold — fadeUpVariants delay 0.1; subtitle `text-lg text-[#8a8070]` — delay 0.2
- All stagger entrance on mount (not scroll-triggered)

**SectionLabel**
- `text-xs font-bold uppercase tracking-[0.15em] text-[#A86704]`
- `whileInView` fadeUpVariants, once, amount 0.5

---

#### Home.tsx — 7 Sections

**Section 1: HeroSection**
- 3-video crossfade: `<video>` elements cycled every 14s, `opacity 0/1` CSS transition
- Scroll parallax: `useScroll` + `useTransform` — heroOpacity (1→0 at 0.4 scroll), heroScale (1→1.15)
- Scroll progress bar: thin fixed bar at top, `scaleX` 0→1 via scrollYProgress, transform-origin left
- Text stagger delays: h1 0.1s, tagline 0.2s, subtitle 0.3s, CTAs 0.4s, stats 0.5–0.7s
- Stats row: 3 items with `useCountUp` (requestAnimationFrame, cubic ease-out, starts on viewport enter)
- Animated scroll indicator: chevron with y-bounce infinite keyframe
- Two CTA buttons: amber primary (WhatsApp), ghost outline (Tours)

**Section 2: AboutSection**
- `useInView` threshold 0.15, once
- Text block: `x: -40 → 0`, opacity 0→1, 0.7s
- Image block: `x: 40 → 0`, opacity 0→1, 0.7s, delay 0.15s
- Portrait image `aspect-[4/5]` rounded-2xl; floating accent image `absolute -bottom-6 -left-6` `w-1/2 aspect-square`, delay 0.3s
- Value chips: stagger (y:20, opacity), 4 chips with amber dot

**Section 3: ServicesSection**
- 2×2 grid full-bleed image cards, `aspect-[16/10]`
- Gradient overlay bottom-to-top; text at card bottom; hover `scale-105` on image (700ms)
- `staggerContainer + staggerItem` on mount via useInView

**Section 4: FeaturedTourSection**
- 2-col: left amber gradient panel (`from-[#A86704] via-[#8a5500] to-[#6d4200]`) + right image
- Route stop card: `bg-black/20 backdrop-blur-sm`
- Each stop: amber dot (`scale: 0→1` spring stiffness 200 damping 20, per-stop delay) + label
- Connector lines: `scaleY 0→1` spring, transform-origin top; stagger on useInView

**Section 5: GalleryStrip**
- `overflow-hidden` container; track: `flex gap-4`, 12 images (6 real + 6 copies)
- CSS `animation: marquee 40s linear infinite`, `transform: translateX(-50%)`
- Hover: `animation-play-state: paused`; each image `h-48 w-72 rounded-xl`, hover `scale-110`

**Section 6: TestimonialsSection**
- 3-col grid stagger; `bg-[#1a1915] rounded-2xl border p-8`
- 5 amber stars, italic blockquote, avatar initials circle `bg-[#251a0a] text-[#A86704]`
- No attribution labels; verbatim Canva quotes only

**Section 7: CTASection**
- Full-bleed background image `cta_adventure_bg`; double overlay; centered SectionLabel + h2 + p + 2-button row

---

#### Tours.tsx

- PageHero (Obudu, `center 30%`); SectionLabel "Browse Experiences" + h2 "Choose Your Adventure"
- 9-card stagger grid (3-col): Obudu, Zanzibar, Abuja Hike, France, Rwanda Gorilla, Lagos City, West Africa Road Trip, Abuja Group, Nigeria Hiking Series
- Each card: 16/10 image, badge, MapPin+location, title, desc (line-clamp-2), Clock/Users meta, amber price, Book → WhatsApp
- CTA strip (dark bg)

#### Services.tsx

- PageHero (jet exterior)
- 4 ServiceBlock alternating: icon circle + eyebrow + h2 + desc + feature list (Check + stagger) + CTA + 4/3 image
- Services: Private Jet Charter, Birth Tourism (USA/Canada/Barbados — WRONG), VisaDesk, Bespoke Vacations
- CTA strip

#### FAQ.tsx

- PageHero (about_section_bg, `center 40%`); max-w-3xl; SectionLabel + h2 "We've Got Answers"
- 10 items, first open by default; stagger on section enter
- Each: `border-b`, button with ChevronDown (`rotate: 0→180`, 0.25s), panel `height: 0→auto` AnimatePresence (0.3s)
- CTA strip: 2 buttons (WhatsApp amber + Contact ghost)

#### Journal.tsx (= blog.html)

- PageHero (wildlife_safari, `center 30%`)
- SectionLabel "From the Field" + h2 "Stories Worth Reading" + intro p
- 3-col grid stagger (3 posts): 16/10 image, category badge, date, title, desc (line-clamp-3), "Read More" button
- Dashed box: "More stories coming soon" + @adventure101tour Instagram link
- Newsletter card: `bg-[#1a1915] rounded-2xl border p-8/12`, email input + Subscribe (client-side toast only, no backend)
- CTA section: 2-col text + Zanzibar image; Browse Tours + Get In Touch buttons

#### Contact.tsx

- PageHero (cta_adventure_bg)
- 4 contact cards (1→2→4 col, stagger): NG WhatsApp, UK WhatsApp, Email, Office
- 5-col layout: form (3-col) + sidebar (2-col)
- Form: name+email row, phone+service dropdown row, message textarea, Send button; success state with icon
- Sidebar: "Quick Links" label + 3 social links (Instagram, X, YouTube) + WhatsApp promo box (green button)
- No EmailJS wiring

---

### CONVERSION PLAN

#### Animation Translation Key

| Manus / Framer Motion | Vanilla equivalent |
|---|---|
| `fadeUpVariants` (y:30→0, opacity, 0.6s) | `@keyframes fade-up` + IntersectionObserver adds `.is-visible` |
| `staggerContainer + staggerItem` (0.08s) | Observer → JS loop: `el.style.transitionDelay = i * 80 + 'ms'` |
| `x: ±40 → 0` slide-in | `.slide-left/.slide-right` CSS transform + `.is-visible` removes it |
| Scroll parallax `useScroll`/`useTransform` | `window.addEventListener('scroll', ...)` → `style.opacity/transform` |
| Spring dots `stiffness:200 damping:20` | CSS `cubic-bezier(0.34, 1.56, 0.64, 1)` transition |
| `scaleY 0→1` connectors | `transform: scaleY(0→1)`, `transform-origin: top` |
| `animate-marquee 40s` | `@keyframes marquee` (already in home.css); hover pauses |
| FAQ `height: 0→auto` | CSS `max-height: 0 → 800px`, `overflow: hidden` (already in pages.css) |
| `useCountUp` rAF loop | JS `requestAnimationFrame` in main.js |
| Spring nav underline `layoutId` | CSS `::after` `transform: scaleX(0→1)` transition on active link |
| Full-screen mobile overlay | components.js: full-screen `.nav__mobile` `position:fixed inset:0 flex flex-col items-center justify-center` |
| PageHero entrance delays | CSS `animation: fade-up` with `animation-delay: 0/0.1s/0.2s` on breadcrumb/h1/subtitle |
| Hover `scale-105` on images | CSS group hover transform (already in pages.css) |

#### Page-by-Page Changes

**`style.css`** — Add: `.scroll-progress` (fixed top bar, scaleX, z-999), `@keyframes fade-up`, `@keyframes slide-left/right`, `.reveal` + `.reveal.is-visible`, `.slide-left/.slide-right` variants, full-screen `.nav__mobile` CSS, `.nav__link-active` amber + `::after` underline

**`index.html` + `home.css`** — Rebuild: about section (2-col slide-in + floating accent), services (2×2 full-bleed image cards), featured tour (amber gradient panel + route stops), testimonials (3-col cards + stars + avatars), CTA (full-bleed image). Add scroll progress bar element. Add stat counter `data-target` attributes. New home.css classes: `.service-card`, `.service-card__img`, `.service-card__overlay`, `.service-card__body`, `.featured-tour__panel`, `.route-stop`, `.route-stop__dot`, `.route-stop__connector`, `.hero-stats__item`, `.testimonial-stars`, `.testimonial-avatar`

**`tours.html`** — Add section header (SectionLabel eyebrow + h2); fix Rwanda price ($2,800 → From $1,250/person); fix Zanzibar price ($1,200 → From $1,600/person); add Ghana tour card (From $919/person); apply `data-stagger` on grid

**`services.html`** — Birth tourism: Barbados only, updated body copy + budget line; Private jet: add Starlink bullet, charter text; Bespoke: updated body copy (all per Session 7 plan)

**`faq.html`** — Birth tourism answer: Barbados only; JS: add `is-open` on first item at load; CSS: chevron rotates on `.is-open`

**`blog.html`** — Add SectionLabel "From the Field" eyebrow; add dashed "more coming soon" box; add newsletter strip section; add 2-col CTA section

**`contact.html`** — Add 4-col contact cards row; update to 5-col layout; add sidebar with social quick-links + WhatsApp promo box; wire EmailJS (HIGH priority)

**`css/pages.css`** — Add: `.contact-cards-grid`, `.contact-card-item`, `.social-quick-link`, `.wa-promo-box`, `.blog-coming-soon`, newsletter classes (verify Session 7 added `.newsletter-strip/.newsletter-form`)

**`js/main.js`** — Add: scroll progress bar updater, hero parallax (opacity + scale on scroll), upgraded stagger observer (`data-stagger` containers), stat counter rAF, route stop connector trigger

**`js/components.js`** — Add: active link class management (match `window.location.pathname`), full-screen mobile overlay HTML + behaviour update

---

### CONTENT DELTAS

| Location | Current (wrong) | Correct per CLAUDE.md |
|---|---|---|
| `services.html` Birth Tourism — location | USA, Canada, and Barbados packages | Barbados only |
| `services.html` Birth Tourism — body | Outdated copy | "Barbados offers one of the most straightforward birth tourism pathways... We handle logistics end to end: travel, accommodation, prenatal care coordination, and post-birth documentation." |
| `services.html` Birth Tourism — budget | Missing | Add "Base budget from $12,000" |
| `services.html` Private Jet — features | No Starlink | Add "Starlink in-flight connectivity" |
| `services.html` Bespoke — body | Outdated copy | "Every itinerary is built from scratch. Tell us where you want to go, how you want to feel when you arrive, and what matters most..." (no em dash — use colon) |
| `faq.html` birth tourism answer | "USA, Canada, and Barbados" | Barbados only |
| `tours.html` Rwanda price | From $2,800 | From $1,250/person |
| `tours.html` Zanzibar price | From $1,200 | From $1,600/person |
| `tours.html` Ghana | Missing | Add: From $919/person (excl. flights) |
| `tours.html` France | From €2,500 | Not in CLAUDE.md — flag for client confirmation; keep for now |
| Contact form | Non-functional, fake success message | Wire EmailJS to `info@adventure101tour.com` |
| Newsletter (blog.html) | Non-functional | Keep as visual placeholder (consistent with Manus) |

---

### FILES TO CHANGE

| File | Action | Commit message |
|---|---|---|
| `css/style.css` | Reveal animations, scroll progress, fullscreen mobile menu, active nav link | `feat(style): reveal animations, scroll progress, fullscreen mobile menu` |
| `index.html` + `css/home.css` | Rebuild about/services/featured/testimonials/CTA; stat counters; gallery verify | `feat(home): rebuild all sections to match Manus visual design` |
| `tours.html` | Section header; fix Rwanda/Zanzibar prices; add Ghana card | `fix(tours): correct prices, add Ghana tour, section header` |
| `services.html` | Birth tourism Barbados-only; Starlink; bespoke copy | `fix(services): birth tourism Barbados-only, Starlink, bespoke copy` |
| `faq.html` | Birth tourism answer; default-open first item | `fix(faq): birth tourism correction, default-open accordion` |
| `blog.html` | Coming-soon box; newsletter strip; CTA section | `feat(blog): newsletter strip, coming-soon note, CTA section` |
| `contact.html` | Contact cards; 5-col layout; social sidebar; EmailJS | `feat(contact): contact cards, social sidebar, wire EmailJS` |
| `css/pages.css` | Contact cards, social links, WA promo box, blog classes | `feat(pages.css): contact cards, social sidebar, blog newsletter classes` |
| `js/main.js` | Scroll progress, parallax, stagger observer, stat counters | `feat(main.js): scroll progress, parallax, stagger observer, counters` |
| `js/components.js` | Active nav link class; full-screen mobile overlay | `feat(components): active nav link, full-screen mobile overlay` |

---

## Session Summary (2026-06-29)

### Phase 1 — Bug Fixes and Content Restoration (11 items)

All items completed and committed before Phase 2 began:

1. **Em-dash audit** — all `—` instances replaced across index.html, tours.html, services.html, contact.html, faq.html, js/components.js
2. **Testimonials restored** — all three restored verbatim from Canva source (Titilayo Deji, Zubi Ike, Alex Utobo); fabricated sentences removed; attribution labels dropped
3. **Contact form wired to EmailJS** — SDK loaded via CDN, `emailjs.init()` + `emailjs.send()` hooked to real `info@adventure101tour.com`; fake success message replaced with real send
4. **Tours prices corrected** — Rwanda: $2,800 -> From $1,250/person; Zanzibar: $1,200 -> From $1,600/person
5. **Ghana tour card added** — From $919/person (excl. flights), with WhatsApp prefill link
6. **Services — birth tourism** — updated to Barbados only, correct body copy, "Base budget from $12,000" added
7. **Services — private jet** — Gulfstream 550 removed, Legacy 600 only, Starlink bullet added, charter text updated
8. **Services — bespoke vacations** — body copy replaced with approved version
9. **FAQ birth tourism answer** — updated to Barbados only
10. **Contact.html** — 4-col contact cards, 5-col layout, social quick-links sidebar, WhatsApp promo box added; form wired via EmailJS
11. **data-theme="dark" verified** on all HTML files; theme-flash fix confirmed

---

### Phase 2 — UI Improvement (Skills Applied)

**Pre-skill QA fixes (committed before skill sequence):**
- tours.html featured tour: stronger overlay gradient on `.featured-tour__overlay`
- faq.html hero: `travels_bag.jpg` replaced with `hero_main.png`
- contact.html "Follow Us": `--color-text-faint` -> `--color-text-muted` (contrast fix)
- Commit: `fix(qa): address Phase 1 QA findings before Phase 2 UI pass`

**STEP 1 — `/impeccable`** (style.css, pages.css, home.css):
- Created PRODUCT.md (register: brand) as required by impeccable context.mjs
- body line-height: 1.7 -> 1.75 (dark bg readability rule)
- Nav underline: `width` animation -> `transform: scaleX()` (GPU-composited)
- `.btn--ghost` padding and hover border-color fixed
- `.tour-card__price-label`: `--color-text-faint` -> `--color-text-muted` (WCAG fix)
- `.form-control::placeholder`: same contrast fix
- `.birth-testimonial`: banned `border-left` side-stripe -> background tint
- `.featured-tour` layout: complete position/overlay/content CSS added (was missing entirely)
- `.contact-section`: `padding-block` added (was zero)
- Commit: `design(impeccable): apply spacing, typography and hierarchy fixes`

**STEP 2 — UX/pro pass** (contact.html, tours.html — ui-ux-pro-max not installed, applied manually):
- Section intros, form field clarity, card info hierarchy improvements
- Commit: `design(ux): apply ui-ux-pro-max to contact and tours pages`

**STEP 3 — `/taste-skill:redesign-skill`** (index.html, services.html, home.css, style.css, pages.css):
- 4 emoji service-tile icons replaced with inline SVG (plane, map, compass, document)
- `.service-tile__icon`: emoji sizing -> `display:flex` + `color: var(--color-primary)`
- `.service-tile__body p`: line-height 1.6 -> 1.75
- `.about-strip__values` gap: `--space-3` -> `--space-4`
- `.hero__sub` line-height: 1.65 -> 1.75
- `.hero__stat-label` opacity: 0.55 -> 0.7 (contrast: ~1.6:1 -> ~2.2:1)
- `.feature-list li` line-height: 1.6 -> 1.75
- `.tnpl-callout p` line-height: 1.7 -> 1.75
- Commit: `design(taste): apply redesign-skill to homepage and services`

**STEP 4 — `/taste-skill:minimalist-skill`** (faq.html, blog.html, pages.css):
- FAQ accordion: card-box wrappers stripped; items now separated by `border-bottom` only (document-style)
- `border-top` added to `.faq-list` to cap above item 1
- `.faq-question` padding: inset -> flush horizontal (no box sides)
- `.faq-question__icon`: circle border/radius removed; bare `+/-` character
- `.faq-answer__inner`: horizontal padding removed; `max-width: 70ch` added
- `.blog-card:hover`: translateY -5px -> -3px; shadow lighter + tinted
- `.blog-card__excerpt` line-height: 1.7 -> 1.75
- `.blog-card__date`: `--color-text-faint` -> `--color-text-muted` (WCAG fix)
- `.newsletter-form input`: `border-radius: full` (pill) -> `radius-md`
- Coming-soon div in blog.html: `--color-text-faint` -> `--color-text-muted`
- Blog CTA p: line-height 1.7 -> 1.75
- Commit: `design(taste): apply minimalist-skill to FAQ and blog`

**STEP 5 — `/motion-framer`** (style.css, pages.css, home.css, main.js):
- `.reveal` easing: `var(--ease-out)` -> `cubic-bezier(0.16, 1, 0.3, 1)` (expo ease-out)
- `.reveal` travel: `translateY(32px)` -> `20px`; slide variants `+-40px` -> `+-30px`
- `transition-property` explicit (opacity, transform only — no layout triggers)
- `.fade-in-up`: same easing + distance refinements
- Page-hero staggered CSS entrance: breadcrumb (0s), h1 (0.1s), subtitle (0.2s) using `fadeInUp` + expo ease
- Duplicate `.reveal`/`.fade-in-up`/`@keyframes` rules removed from pages.css (were overriding style.css)
- `legal-meta`: `--color-text-faint` -> `--color-text-muted` (WCAG fix)
- `.gallery-strip__track`: `will-change: transform` added for GPU compositing
- Blog CTA CSS `@media (max-width:720px)` added (removes sole reliance on JS resize listener)
- Dead `initMotionAnimations()` block removed from main.js (Motion CDN was never loaded)
- Commit: `design(motion): apply motion-framer animation refinements`

**STEP 6 — Playwright QA** (qa/phase2/):
- 16 screenshots: 8 pages x 2 viewports (1280x900, 390x844)
- All pages `status: ok`. Zero regressions vs phase1 baseline.
- Non-regression errors identical to phase1: Fontshare CDN blocked (ERR_FAILED x2/page), EmailJS CDN blocked (contact only)
- Commit: `qa: Phase 2 final Playwright screenshot pass`

---

### Known Remaining Gaps

| Gap | Notes |
|---|---|
| About page | No standalone `about.html` exists. Nav links to `#about` anchor on homepage. Debola to confirm if a separate page is needed. |
| Destination images | Ghana, Rwanda, Egypt tour cards use placeholder or recycled images. Debola to supply dedicated destination photography. |
| Lebanon tour | From $4,000/person, 5 nights — no tour card exists. Debola to confirm whether to list publicly. |
| France tour | From €2,500 on tours.html — not in the confirmed CLAUDE.md price list. Flag for Debola to confirm or remove. |
| terms.html prices | Two "[to be confirmed by Adventure 101]" placeholders remain in deposit/balance sections. Debola to supply exact figures before launch. |
| EmailJS live test | Credentials are wired but untested with a real send (CDN blocked in QA). Debola to test form submission end-to-end on the live Vercel deployment. |
| GA4/Plausible | Analytics not installed. Listed as LOW priority. |
| Open Graph meta | og:image, og:title, twitter:card not set on any page. Listed as LOW priority. |
| Image optimisation | All images still PNG/JPG; WebP conversion pending. Listed as LOW priority. |

