Memory.md — Saarthi AI
Project Working Memory (For AI Assistants & Contributors)

Purpose of this file: Any AI assistant (or human contributor returning after a break) reads this file first, before writing any code or making decisions, to avoid contradicting prior work, redoing completed work, or hallucinating project state. This file must be kept accurate and current — it is a source of truth, not a nice-to-have.

Rule for AI assistants working on this repo: Update this file at the end of every meaningful work session — not just at the end of a phase. If you stop mid-task, record exactly where you stopped and why, so the next session (even if it's a different context window) can resume without guessing.

How to Use This File
Before starting work: Read the "Current State" and "In Progress" sections below in full.
While working: If you make a decision that isn't already documented elsewhere (PRD.md, Architecture.md, Rules.md), log it in "Decisions Log" below with a date.
After finishing a work session: Update "Current State," move completed items from "In Progress" to "Completed Log," and update "Next Up."
Never delete history from the Completed Log or Decisions Log — append only. This file is a record, not a scratchpad.
Current State (update this section every session — this is the first thing to read)
Current Phase: Phase 1 — Core Auth & Profile (In Progress)
File currently being worked on: apps/backend, apps/web
Last updated by: Antigravity Agent
Last updated on: 2026-09-17

Completed Log

### 2026-09-17 — Phase 0 — Foundations (Setup & Validation)
- What was built/decided:
  - System toolchain configured: Node.js LTS v20.17.0 and Git 2.46.0 verified.
  - Monorepo structure initialized with package.json workspaces.
  - `docker-compose.yml` created for PostgreSQL (with pgvector), Redis, and MongoDB.
  - `packages/shared-types` established with complete TypeScript DTOs.
  - `packages/scheme-data-schema` created with canonical Zod validation and 8 starter verified schemes covering students, farmers, women, and seniors.
  - Phase 0 automated test suite passed with 100% success.
- Files touched:
  - `package.json`, `.gitignore`, `docker-compose.yml`
  - `packages/shared-types/package.json`, `packages/shared-types/tsconfig.json`, `packages/shared-types/src/index.ts`
  - `packages/scheme-data-schema/package.json`, `packages/scheme-data-schema/tsconfig.json`, `packages/scheme-data-schema/src/schema.ts`, `packages/scheme-data-schema/src/starter-schemes.json`, `packages/scheme-data-schema/src/test.ts`
  - `memory.md`
- Any deviation: None.

### 2026-09-17 — Phase 1 — Core Auth & Progressive Profile (Complete)
- What was built/decided:
  - Express Auth & Profile APIs with Zod boundary validation.
  - Security.md sliding window rate limiting for Auth (5 req/5min) and Profile (30 req/min) returning HTTP 429 and Retry-After.
  - ActivityFlag service detecting rapid repeat signups, failed logins (cooldown at 5 attempts), and disposable email domains.
  - Unified profile store powering both roadmap and scheme matching.
  - User-selected color palette tokens (Dark Red, Light Beige, Soft Orange, Red-Orange) and skeleton shimmer components implemented in `apps/web`.
  - Automated integration test suite (`test/phase1.test.ts`) executed with 10/10 tests passing.
- Files touched:
  - `apps/backend/src/index.ts`, `apps/backend/src/db/store.ts`
  - `apps/backend/src/middleware/rateLimit.middleware.ts`, `apps/backend/src/middleware/auth.middleware.ts`, `apps/backend/src/middleware/errorHandler.middleware.ts`
  - `apps/backend/src/services/authService.ts`, `apps/backend/src/services/profileService.ts`, `apps/backend/src/services/activityFlagService.ts`
  - `apps/backend/src/controllers/authController.ts`, `apps/backend/src/controllers/profileController.ts`
  - `apps/backend/src/routes/auth.routes.ts`, `apps/backend/src/routes/profile.routes.ts`, `apps/backend/src/routes/admin.routes.ts`
  - `apps/backend/test/phase1.test.ts`
  - `apps/web/tailwind.config.js`, `apps/web/postcss.config.js`, `apps/web/app/globals.css`, `apps/web/components/shared/skeleton-loader.tsx`
- Any deviation: None.

### 2026-09-17 — Phase 2 — Rule Engine & Scheme Data (Complete)
- What was built/decided:
  - Deterministic evaluation engine (`RuleEngine.evaluate` and `RuleEngine.evaluateAll`) checking age, gender, state, category, income thresholds, education level hierarchy, occupation, and academic merit percentage.
  - Zero AI involvement in yes/no eligibility decisions — 100% auditable and reproducible.
  - Scheme catalog endpoints (`/schemes`, `/schemes/:id`) and user evaluation endpoint (`/eligibility/check`) with 20 req/min rate limiting.
  - Multi-persona audit passed with 100% accuracy: Student (Priya), Farmer (Ramesh), Senior Citizen (Shanti).
  - Automated integration test suite (`test/phase2.test.ts`) executed with 6/6 tests passing.
- Files touched:
  - `apps/backend/src/services/ruleEngine/evaluator.ts`
  - `apps/backend/src/services/schemeService.ts`
  - `apps/backend/src/controllers/schemeController.ts`
  - `apps/backend/src/routes/scheme.routes.ts`, `apps/backend/src/routes/eligibility.routes.ts`
  - `apps/backend/src/index.ts`
  - `apps/backend/test/phase2.test.ts`
- Any deviation: None.

### 2026-09-17 — Phase 3 — AI Copilot Layer (Complete)
- What was built/decided:
  - `AiCopilotService`: RAG grounded in verified scheme documents with citation enforcement, official links, and confidence scoring.
  - `/ai/explain`: Generates plain-language explanation citing underlying deterministic rule results and official circular versions.
  - `/ai/chat`: Scoped chatbot with prompt-injection defense and out-of-scope domain blockers (declines non-education/scheme topics).
  - `AiClient`: Enforces 10s hard timeout and automatic circuit-breaker pattern with graceful fallback under latency/outage.
  - Security.md rate limiting enforced: 10 requests / min + 100 / day cap with 429 Retry-After.
  - Automated integration test suite (`test/phase3.test.ts`) executed with 7/7 tests passing.
- Files touched:
  - `apps/backend/src/services/aiCopilotService.ts`
  - `apps/backend/src/services/aiClient/client.ts`
  - `apps/backend/src/controllers/aiController.ts`
  - `apps/backend/src/routes/ai.routes.ts`
  - `apps/backend/src/index.ts`
  - `apps/backend/test/phase3.test.ts`
- Any deviation: None.

### 2026-09-17 — Phase 4 — Student Roadmap Engine (Complete)
- What was built/decided:
  - `RoadmapService`: Generates semester-wise career roadmap (Semesters 4 to 8) aligned to specific goals (Software Engineer, Full Stack, Data Scientist, Cloud Architect).
  - Built-in curriculum mapping with curated free learning resources (NPTEL, MDN, LeetCode, AWS SkillBuilder).
  - Skill-gap analysis comparing current user skills against target career requirements, categorizing proficiency into `missing` vs `intermediate`.
  - Incremental sync: Updating user skills or profile fields updates skill gap statuses without wiping user's completed milestone history.
  - Milestone status tracking (`pending`, `in_progress`, `completed`) recalculating overall progress percentage dynamically.
  - Automated integration test suite (`test/phase4.test.ts`) executed with 4/4 tests passing.
- Files touched:
  - `apps/backend/src/services/roadmapService.ts`
  - `apps/backend/src/controllers/roadmapController.ts`
  - `apps/backend/src/routes/roadmap.routes.ts`
  - `apps/backend/src/index.ts`
  - `apps/backend/test/phase4.test.ts`
- Any deviation: None.

### 2026-09-17 — Phase 5 — Document Readiness Assistant (Complete)
- What was built/decided:
  - `DocumentService`: Automated document classification into standard Indian identity and academic categories (Aadhaar, Income Certificate, Caste Certificate, Marksheets, Domicile, Bank Passbook, Admission Proof).
  - Explicit user consent enforcement: Uploads strictly blocked without logged consent.
  - Concrete 90-day data retention policy implemented with auto-expiring TTL filtering per Security.md Section 5.
  - Scheme-specific readiness calculation engine calculating completion percentage and providing official steps for obtaining missing certificates.
  - Security.md rate limiting enforced: 10 requests / hour on `/documents/upload` returning 429 Retry-After.
  - Automated integration test suite (`test/phase5.test.ts`) executed with 5/5 tests passing.
- Files touched:
  - `apps/backend/src/services/documentService.ts`
  - `apps/backend/src/controllers/documentController.ts`
  - `apps/backend/src/routes/document.routes.ts`
  - `apps/backend/src/index.ts`
  - `apps/backend/test/phase5.test.ts`
- Any deviation: None.

### 2026-09-17 — Phase 6 — Notifications & Deadline Tracking (Complete)
- What was built/decided:
  - `NotificationService`: Background deadline tracking inspecting user's eligible schemes and generating timely reminders with official links.
  - Read/unread state management with unread counter tracking.
  - Batched digest generator consolidating multiple alerts into a clean weekly summary to prevent notification fatigue.
  - Security.md rate limiting enforced: 60 requests / min on `/notifications/*` returning 429 Retry-After.
  - Automated integration test suite (`test/phase6.test.ts`) executed with 5/5 tests passing.
- Files touched:
  - `apps/backend/src/services/notificationService.ts`
  - `apps/backend/src/controllers/notificationController.ts`
  - `apps/backend/src/routes/notification.routes.ts`
  - `apps/backend/src/index.ts`
  - `apps/backend/test/phase6.test.ts`
- Any deviation: None.

### 2026-09-17 — Phase 7 — Hardening & Launch Readiness (Complete)
- What was built/decided:
  - Full Security.md compliance audit verified: All 6 sensitive routes strictly protected with Bearer Auth.
  - WCAG AA accessibility contrast audit passed with exceptional contrast scores:
    - Primary text to background: **17.54:1** (min 4.5:1 required)
    - Soft orange accent to background: **9.64:1**
    - Light beige text to card surface: **14.01:1**
  - Dependency vulnerability scan executed: **0 vulnerabilities** across all packages (`apps/web`, `apps/backend`, `packages/shared-types`, `packages/scheme-data-schema`).
  - Full end-to-end user lifecycle integration test simulating signup, progressive profile, deterministic matching, AI Copilot explanation, student roadmap, document readiness, and deadline alerts passed with 100% data integrity.
- Files touched:
  - `apps/backend/test/phase7.test.ts`
  - `apps/web/package.json`, `apps/web/app/page.tsx`, `apps/web/components/layout/Navbar.tsx`
  - `walkthrough.md`
  - `memory.md`
### 2026-09-18 — Persistent Database Storage (Prisma ORM) & End-to-End Authentication (Complete)
- What was built/decided:
  - Persistent relational database implemented using **Prisma ORM with SQLite** (`apps/backend/prisma/schema.prisma` and `dev.db`).
  - Relational models created: `User`, `Profile`, `Scheme`, `Roadmap`, `RoadmapMilestone`, `UserDocument`, `Notification`, and `ActivityFlag`.
  - Canonical schemes auto-seeded directly into SQLite on boot.
  - End-to-end authentication completed:
    - Backend: `POST /auth/signup`, `POST /auth/login`, and new `GET /auth/me` with JWT Bearer token authentication and bcrypt password hashing.
    - Frontend: `AuthContext` state provider with local session persistence, `AuthModal` (Sign In / Register with student/citizen/farmer roles), and `ProfileOnboardingModal` (3-step progressive questionnaire).
    - Connected frontend dashboard in `apps/web/app/page.tsx` to live backend APIs (`/schemes`, `/eligibility/check`, `/roadmap/me`, `/documents/readiness`, `/notifications/me`, `/ai/explain`, `/ai/chat`).
  - Design aesthetic updated to **Quiet Luxury** per user-provided palette card:
    - Roasted Cashew (`#948170`)
    - Frozen Dew (`#D5C3A5`)
    - Dark Night (`#1A1715` base, `#24201D` surface, `#2F2A27` elevated)
    - Temple Grey (`#B5AEA8`)
    - Snowfall (`#F5F2EC`)
  - All 7 phase test suites (`phase1` through `phase7`) executed and verified with 100% pass rate.
  - Next.js production build (`next build`) verified with Turbopack with 0 errors.
- Files touched:
  - `apps/backend/prisma/schema.prisma`, `apps/backend/src/db/store.ts`, `apps/backend/src/db/seed.ts`
  - `apps/backend/src/controllers/authController.ts`, `apps/backend/src/routes/auth.routes.ts`
  - `apps/backend/src/services/notificationService.ts`, `apps/backend/src/services/ruleEngine/evaluator.ts`
  - `apps/backend/test/phase1.test.ts` through `apps/backend/test/phase7.test.ts`
  - `apps/web/tailwind.config.js`, `apps/web/app/globals.css`, `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`
  - `apps/web/lib/context/AuthContext.tsx`, `apps/web/components/auth/AuthModal.tsx`, `apps/web/components/auth/ProfileOnboardingModal.tsx`, `apps/web/components/layout/Navbar.tsx`
  - `memory.md`
- Any deviation: None.

### 2026-09-19 — Citizen Schemes Module, myScheme.gov.in Integration & Quiet Luxury Light Theme (Complete)
- What was built/decided:
  - Module renamed from "Schemes & Scholarships" to **"Citizen Schemes"** across all UI tabs, navbar, headers, and descriptions.
  - **Eligibility-First Discovery Flow**: Schemes are NOT shown directly on page load. Instead, users complete the `EligibilityQuestionnaire` (age, gender, state, category, annual income, occupation, education, disability) or use their saved profile.
  - Deterministic evaluation reveals **only schemes the citizen qualifies for**, displaying full matched criteria justification.
  - **Official myScheme.gov.in Integration**: Backend connects to `https://www.myscheme.gov.in/api/apisetu/schemes?lang=en` (5,083 schemes), caches the national catalog, provides live search, and retrieves full official scheme details by slug (`/schemes/myscheme/:slug`).
  - **Universal Search**: Dedicated "Search All Schemes" mode allowing keyword lookup across the entire 5,000+ national catalog with interactive details modal.
  - **Quiet Luxury Light Theme Overhaul**: Completely removed the dark/black background. Transformed the UI to the warm Quiet Luxury light palette (Snowfall `#F5F2EC` linen base, clean white `#FFFFFF` cards, Dark Night `#1A1715` high-contrast typography, Roasted Cashew `#948170`, Frozen Dew `#D5C3A5`, and Temple Grey `#8E8780`).
  - Automated integration test suite (`test/citizenSchemes.test.ts`) and all 7 phase regression suites (`phase1` through `phase7`) executed with 100% success rate.
  - Next.js production build (`next build`) verified with Turbopack with 0 errors.
- Files touched:
  - `apps/backend/src/services/mySchemeService.ts`, `apps/backend/src/services/schemeService.ts`, `apps/backend/src/controllers/schemeController.ts`
  - `apps/backend/src/routes/scheme.routes.ts`, `apps/backend/src/routes/eligibility.routes.ts`, `apps/backend/test/citizenSchemes.test.ts`
  - `apps/web/app/globals.css`, `apps/web/app/page.tsx`, `apps/web/components/layout/Navbar.tsx`
  - `apps/web/components/auth/AuthModal.tsx`, `apps/web/components/auth/ProfileOnboardingModal.tsx`
  - `apps/web/components/schemes/EligibilityQuestionnaire.tsx`, `apps/web/components/schemes/MySchemeDetailModal.tsx`
  - `scripts/dev.js`, `apps/backend/package.json`, `walkthrough.md`, `memory.md`
- Any deviation: None.

### 2026-09-19 — 31 SVGator Animations & Micro-Interactions Suite (Complete)
- What was built/decided:
  - Installed `framer-motion` (v13.4.0) and `canvas-confetti` (v1.9.4) for performant, hardware-accelerated animations.
  - Zero redesign strictly observed: Preserved all existing colors, fonts, spacing, layout, sections, content, and business logic.
  - Keyframe tokens added to `globals.css`: floating, morphing blobs, glowing pulse, gradient sweep, ripples, traveling borders, stroke draw, bell pulse, and orbit rotation. Full `prefers-reduced-motion` compliance.
  - Modular animation suite created in `apps/web/components/animations/`:
    - `svgator-hooks.ts`: `useReducedMotion`, `useMouseParallax`, `use3DTilt`, `useMagnetic`.
    - `ScrollProgressBar.tsx`: Reading scroll progress at top of page (#24).
    - `InteractiveBackground.tsx`: Subtle interactive particle constellation field (#31).
    - `KineticText.tsx`: Staggered spring typography & gradient sweep (#7, #9, #10).
    - `SvgatorWrappers.tsx`: FloatingWrapper (#1), OrganicBlobMotion (#2, #3), ScrollReveal (#5, #23), MagneticButton (#11, #13), RippleClickWrapper (#12), GlassCard with 3D tilt & reflection (#27, #28, #29), MorphingBlobLoader (#20), OrbitLoader (#21), LiquidFillLoader (#22), AnimatedCheckmark (#15), CounterNumber.
    - `confetti.ts`: Quiet Luxury champagne confetti burst on finding eligible schemes.
  - Injected non-invasively into `Navbar.tsx`, `layout.tsx`, `page.tsx`, `EligibilityQuestionnaire.tsx`, and `MySchemeDetailModal.tsx`.
  - Both web production build (`next build`) and all backend tests (`test/citizenSchemes.test.ts`, `test/phase7.test.ts`) passed with 100% success.
- Files touched:
  - `apps/web/app/globals.css`, `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`
  - `apps/web/components/animations/svgator-hooks.ts`, `apps/web/components/animations/ScrollProgressBar.tsx`, `apps/web/components/animations/InteractiveBackground.tsx`, `apps/web/components/animations/KineticText.tsx`, `apps/web/components/animations/SvgatorWrappers.tsx`, `apps/web/components/animations/confetti.tsx`
  - `apps/web/components/layout/Navbar.tsx`, `apps/web/components/schemes/EligibilityQuestionnaire.tsx`, `apps/web/components/schemes/MySchemeDetailModal.tsx`
  - `memory.md`
- Any deviation: None.

Current State (31 SVGator Animations Active & All Tests Passing)
- Current Phase: Production Ready with SVGator Micro-Interactions & Light Mode
- Status: Verified & Operational
- Last updated by: Antigravity Agent
- Last updated on: 2026-09-19

Decisions Log

### 2026-09-19 — Quiet Luxury Light Theme Transition (No Black Theme)
- Context: User explicitly requested: "use the color theme i provided u dont use this black theme".
- Decision: Eliminate all pitch-black / charcoal backgrounds. Adopt the Quiet Luxury palette in warm Light mode:
  - Base Background: Warm Snowfall Linen (`#F5F2EC`)
  - Card & Surface: Pure White (`#FFFFFF`) with subtle warm sand borders (`#E5DFD5`)
  - Elevated Panels: Soft Ivory (`#FAF7F2`)
  - Primary Typography: Deep Obsidian Dark Night (`#1A1715`)
  - Secondary Text: Roasted Cashew deep taupe (`#5E544C`) & Temple Grey (`#7E756C`)
  - Accents: Roasted Cashew (`#948170`) & Frozen Dew (`#D5C3A5`)

### 2026-09-19 — Eligibility-First Citizen Discovery & myScheme Integration
- Context: User requested to first ask criteria before showing schemes, integrate all schemes from `https://www.myscheme.gov.in/`, and allow universal scheme search.
- Decision: Implement 3 discovery modes in Citizen Schemes:
  1. `EligibilityQuestionnaire`: Default entrypoint requiring criteria inputs before showing matches.
  2. `Eligible Results`: Displays strictly qualified schemes with deterministic match reasons.
  3. `Universal Search`: Direct keyword search across the 5,080+ myScheme.gov.in national catalog with live slug details.

### 2026-09-18 — "Quiet Luxury" Color Palette Adoption
- Context: User provided visual palette image card ("QUIET LUXURY" - Roasted Cashew, Frozen Dew, Dark Night, Temple Grey, Snowfall).
- Decision: Adopt this subtle, elegant palette replacing previous dark-red:
  - Base Dark Night: `#1A1715` (base background), `#24201D` (cards/surfaces), `#2F2A27` (elevated panels)
  - Frozen Dew: `#D5C3A5` (primary CTA buttons, active accents, focus highlights)
  - Roasted Cashew: `#948170` (secondary accents, category pills)
  - Temple Grey: `#B5AEA8` (subtle borders, muted secondary text)
  - Snowfall: `#F5F2EC` (primary text, crisp headings, 15.96:1 contrast ratio)
- Contrast Audit: Exceeds WCAG AA minimums (15.96:1 on Snowfall vs Dark Night).

### 2026-09-18 — Database Persistence Strategy
- Context: User requested proper working database. Previous store used ephemeral JavaScript Map instances. Docker was not installed on the system.
- Decision: Adopt **Prisma ORM with SQLite** for local persistence. Stores relational models in `dev.db` with WAL mode, transactions, and foreign keys. Seamlessly scalable to PostgreSQL by supplying `DATABASE_URL`.

### 2026-09-17 — Initial Color Palette Selection
- Superseded by 2026-09-18 Quiet Luxury selection above.

Next Up (short-term queue — keep this short, 3–5 items max)
1. Verify citizen questionnaire and eligible scheme matches in browser at http://localhost:3000
2. Test universal search with popular queries (Kisan, Mudra, Swarnima, Pragati)
3. Confirm myScheme detail modal displays complete official records smoothly

Anti-Hallucination Checklist for AI Assistants
Before claiming something is "done" or "already implemented," verify against this file's Completed Log — not against assumption or general plausibility. If it's not logged here, treat it as not done, even if it seems like the kind of thing that should already exist.