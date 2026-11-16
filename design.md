# Design.md — Saarthi AI

## Color & Theme, Typography, Motion

This file is intentionally opinionated with **two concrete directions** rather than one, since the theme decision hasn't been locked yet. Pick one before Phase 1 UI work begins (see Phases.md) — do not let both drift into the codebase at once.

---

## 1. Theme Direction — Two Options

Baseline rule locked in already: **no plain white theme.** Both options below are dark-based.

### Option A — "Dark Metallic / Chrome"
A dark theme with a metallic sheen — surfaces feel like brushed steel or gunmetal, with light-reflecting gradient highlights on key elements (cards, buttons, active states).

- **Base background:** near-black charcoal (`#0B0D10` – `#111418`)
- **Surface/card:** gunmetal gray (`#1C1F24`) with a subtle top-to-bottom linear gradient (`#242830` → `#181B1F`) to simulate a metallic sheen
- **Accent (the "shine"):** a cool silver-to-white gradient sweep (`#C7CCD1` → `#F2F3F5`) used sparingly on primary buttons, active nav items, or a hover-triggered shimmer animation
- **Primary action color:** a saturated accent against the metal — electric blue (`#3B82F6`) or amber (`#F5A623`) both read well against gunmetal; pick one as the single primary accent, not both
- **Text:** off-white (`#E8E9EB`) for primary text, muted gray (`#9AA0A6`) for secondary
- **Feel:** premium, tech-forward, slightly "fintech/dashboard" — fits well for a platform handling official government data, conveys trust and precision

**Shine/shimmer implementation note:** a diagonal gradient sweep on hover/focus (CSS `background-position` animation across a gradient) achieves the "shine" effect cheaply, without needing heavy WebGL — good for low-end devices used by target personas.

### Option B — "Dark Palette / Warm-Toned"
A dark theme without the metallic gloss — flatter, calmer, with a curated color palette rather than a chrome effect.

- **Base background:** deep navy or near-black with a slight warmth (`#12141A`)
- **Surface/card:** slightly lighter flat panel (`#1A1D24`), no gradient sheen
- **Accent palette (pick 2, not more):**
  - Deep teal (`#14B8A6`) + warm gold (`#E8B95F`) — feels approachable, human, good for a civic/welfare product
  - Or indigo (`#6366F1`) + coral (`#FB7185`) — more youthful, fits the student-facing side better
- **Text:** warm off-white (`#EDEBE6`), secondary text muted warm gray (`#A3A0999`)
- **Feel:** calmer, more approachable, less "trading dashboard," better if the product wants to feel welcoming to farmers/senior citizens, not just tech-savvy students

### Recommendation for Decision-Making
- If the brand should feel **precise, official, tech-forward** → Option A (Metallic).
- If the brand should feel **approachable, civic, human-first** (given personas include farmers, women, senior citizens, not just students) → Option B (Warm dark palette).
- A hybrid is viable: **Option B's palette as the base, with Option A's shimmer effect reserved only for primary CTA buttons** — gives warmth with a touch of premium polish without overwhelming a dark UI with metallic surfaces everywhere.

Whichever is chosen, define it as CSS custom properties (`--bg-base`, `--surface`, `--accent-primary`, `--accent-secondary`, `--text-primary`, `--text-secondary`) so theming stays centralized and swappable.

---

## 2. Typography

### Font Pairing Recommendation
- **Headings:** a geometric sans with some character — e.g. **Space Grotesk** or **Sora**. Both read well at large sizes and have a slightly technical feel that suits either theme option.
- **Body:** a highly legible, neutral sans — e.g. **Inter** or **IBM Plex Sans**. Inter is the safer default for multilingual-readiness (has strong Devanagari-adjacent metrics support when paired with a matching Indic font later).
- **Numerals/data (roadmap %, deadlines, stats):** consider a monospace or tabular-figure font for anything numeric — e.g. **JetBrains Mono** or Inter's tabular figure variant — so numbers in tables/dashboards align cleanly.

### Type Scale (suggested, 8pt-based)
| Role | Size | Weight |
|---|---|---|
| H1 | 40px / 2.5rem | 600–700 |
| H2 | 28px / 1.75rem | 600 |
| H3 | 20px / 1.25rem | 600 |
| Body | 16px / 1rem | 400 |
| Small/meta | 13px / 0.8125rem | 400–500 |

On a dark theme, avoid pure `700`/black weight for body text at small sizes — it can look muddy against dark backgrounds. Keep body text at `400`, reserve `600+` for headings and emphasis only.

### Multilingual Note
Since multilingual support (22 Indian languages) is future scope, pick fonts now that have solid Devanagari/regional-script counterparts (Inter + Noto Sans Devanagari is a safe future pairing) so a language switch later doesn't require a full type-system redesign.

---

## 3. Motion, Animation & Scroll Behavior

Given the interest in Figma/Stitch-driven animation and scroll effects, here's how to scope that without over-engineering the MVP:

### Principles
1. **Motion should communicate state, not decorate.** Loading, success, error, and transition states should use motion; a landing-page hero can have more expressive motion, but in-app dashboards should stay restrained (see Rules.md — this is also a performance/low-end-device concern).
2. **Respect `prefers-reduced-motion`.** Always provide a reduced-motion fallback — this is both an accessibility requirement and good practice for the senior-citizen persona.
3. **Scroll-triggered animation is fine on marketing/landing pages**, but avoid heavy scroll-jacking or parallax inside the actual dashboard/app experience — target users include low-end Android devices where this tanks performance.

### Recommended Motion Techniques
- **Landing/marketing page:** scroll-triggered fade/slide-in sections (Framer Motion or CSS `scroll-timeline` where supported), a hero with the metallic shimmer or a subtle gradient animation.
- **In-app transitions:** simple, fast (150–250ms) fade/slide transitions between views — nothing longer, nothing bouncy that delays perceived responsiveness.
- **Micro-interactions:** button hover shimmer (if Option A), checklist item completion (checkmark draw-in), progress bar fill animation on the roadmap tracker.
- **Loading states:** skeleton loaders (see below) rather than spinners wherever content shape is predictable — spinners are fine only for very short, indeterminate waits (<1s).

### Tooling Notes (Figma / Stitch)
- Use **Figma** for static design + component states (default/hover/active/disabled/loading) — export design tokens (colors, spacing, type scale) directly into the `--css-custom-properties` so there's no manual re-guessing of values during implementation.
- If using **Stitch** (or similar AI-assisted design-to-code tools) for first-pass layout generation, treat its output as a **starting draft only** — always pass it through the Rules.md frontend conventions (Shadcn primitives, Tailwind tokens) rather than shipping generated markup/styles as-is, to keep the codebase consistent.

---

## 4. Skeleton Loading Pattern (Design Spec)

This ties directly into Security.md's latency-handling requirement. Design spec for skeleton states:

- Skeleton blocks use the **surface color at ~1.15x lightness** with a subtle shimmer animation (a light gradient sweeping left-to-right every ~1.5s) — this doubles nicely as the "metallic shine" motif if Option A is chosen, unifying the loading state with the visual theme.
- Skeletons must match the **actual shape** of the content they're replacing (card outlines, text-line widths) — never a generic centered spinner for content-shaped areas.
- Trigger threshold: if a response is expected to take >300ms (roadmap generation, AI explanation, scheme matching), show the skeleton immediately rather than waiting to see if it resolves fast — prevents layout flash.
- If a request exceeds a hard timeout (e.g., 8–10s), replace the skeleton with a graceful retry state, not an infinite skeleton.

---

## 5. Accessibility on a Dark Theme

- Maintain **WCAG AA contrast minimum (4.5:1)** for body text against background — verify both theme options against this, especially muted secondary text colors.
- Never rely on color alone for eligibility status (e.g., "eligible" vs "not eligible") — pair color with an icon and text label.
- Ensure focus states are clearly visible against dark surfaces (a bright focus ring, not just a subtle border shift).