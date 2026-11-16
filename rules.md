# Rules.md — Saarthi AI

## Engineering Rules: What to Use, What to Avoid, AI Boundaries

This file is a binding reference for any engineer or AI assistant working on this codebase. When in doubt, this file wins over convenience or personal preference.

---

## 1. General Principles

1. **Determinism over cleverness.** Anything that determines a user's eligibility, benefit, or legal status must be deterministic and auditable. AI never makes that call alone.
2. **Consistency over novelty.** Once a library/pattern is chosen, do not introduce an alternative for the same purpose elsewhere in the codebase.
3. **Fail loud in dev, fail safe in prod.** Errors must never be silently swallowed. In production, users see a graceful fallback; the error is still logged.
4. **No secret sprawl.** All credentials come from environment variables managed centrally (see Security.md) — never hardcoded, never committed.

---

## 2. Frontend Rules

### Use
- **Next.js App Router** conventions consistently — do not mix Pages Router patterns in.
- **Tailwind CSS** utility classes for styling; component-level CSS files only for animation keyframes not expressible in Tailwind.
- **Shadcn UI** for all standard components (buttons, dialogs, forms, inputs) — do not hand-roll a component that Shadcn already provides.
- **React Query / TanStack Query** (or equivalent) for all server-state fetching — do not manage server data with raw `useEffect` + `useState`.
- **Zod** for all client-side form validation, mirrored with the same schema used on the backend where possible.
- Skeleton loaders (see Design.md) for any request expected to take >300ms.

### Avoid
- Do not use `any` in TypeScript — use `unknown` and narrow, or define a proper type.
- Do not fetch data directly inside page components with raw `fetch` — always go through the typed API client layer (`lib/api-client.ts`).
- Do not introduce a second UI kit (e.g., Material UI, Ant Design) alongside Shadcn — pick one system and stay consistent.
- Do not use client-side-only logic for anything security-relevant (eligibility display can be optimistic, but the source of truth is always the backend response).
- Avoid deeply nested prop drilling beyond 2–3 levels — use context or a state manager instead.

---

## 3. Backend Rules

### Use
- **Express.js** with a clear layered structure: routes → controllers → services. Business logic lives in services, not controllers.
- **Prisma** for all PostgreSQL access — no raw SQL unless there's a documented performance reason, and even then it must be reviewed.
- **Zod** (or equivalent) for all request payload validation at the route boundary, before it reaches a controller.
- **Centralized error-handling middleware** — every route's errors flow through one handler that logs consistently and returns a standard error shape.
- **Structured logging** (e.g., pino/winston) with correlation/request IDs — never `console.log` in production code paths.

### Avoid
- Do not let controllers talk directly to Prisma — always go through a service layer, so business logic is unit-testable independent of Express.
- Do not build custom auth/session handling from scratch — use a vetted library (e.g., an established auth library or well-reviewed JWT + refresh-token pattern) rather than inventing crypto/session logic.
- Do not call the AI Engine directly from a route handler without going through the `aiClient` service — this is where timeouts, retries, and rate-limits are enforced.
- Never trust client-supplied eligibility/profile data without re-validating server-side, even if the frontend already validated it.

---

## 4. AI Engine Rules & Boundaries (Critical)

This section exists because AI hallucination in this product could mean a user is told they're eligible for a scheme they are not, or misses a real deadline. Treat these as hard boundaries, not guidelines.

### Use
- **RAG only over verified, ingested scheme documents** — the AI Engine's retriever must never fall back to open-ended model knowledge for scheme facts.
- **Rule Engine is the sole authority on eligibility (yes/no).** The AI Engine may only *explain* a rule-engine result, never independently assert eligibility.
- **Every AI-generated factual claim about a scheme must carry a citation** back to the source document/version used, so it can be audited.
- **Confidence thresholds**: if retrieval confidence is below a defined threshold, the AI must respond with "I don't have verified information on this — check the official source [link]" rather than guessing.
- **Prompt templates are version-controlled** in the repo (not hardcoded ad hoc in route handlers) so changes are reviewable.

### Avoid
- Do not let the LLM generate eligibility determinations from general knowledge/training data — schemes change too often and vary by state.
- Do not let the AI Engine query the primary user database directly — it only receives the minimal profile snippet needed for the specific request (data minimization).
- Do not allow the chatbot to answer questions entirely outside scope (e.g., unrelated legal/medical/financial advice) — scope it explicitly to education, scholarships, and government schemes, and have it decline gracefully outside that scope.
- Do not cache AI-generated eligibility explanations indefinitely — scheme rules change; cache with an explicit TTL tied to the scheme document's version.
- Never let a user's free-text chat input be interpolated unsanitized into a prompt that also contains system instructions (prompt-injection risk) — always separate system instructions from user content with clear structural boundaries in the request.

---

## 5. Error Handling Rules

- Every async operation (DB call, AI Engine call, external government API call) must be wrapped in try/catch with a specific, actionable error path — not a generic catch-all that swallows the real cause.
- User-facing errors must be human-readable and non-technical ("We couldn't check eligibility right now — please try again") while the logged error retains full technical detail.
- Timeouts must be explicitly set on every external call (AI Engine, government API, OCR service) — never rely on default/infinite timeouts.
- Retry logic (where appropriate, e.g., transient network errors) must use exponential backoff and a max-retry cap — never an unbounded retry loop.

---

## 6. Libraries — Explicit Allow/Avoid List

| Category | Use | Avoid |
|---|---|---|
| Frontend UI | Shadcn UI + Tailwind | Bootstrap, raw CSS-in-JS libraries mixed in |
| State/data fetching | TanStack Query | Redux for server state (Redux only if complex client-only state truly needs it) |
| Validation | Zod (shared frontend/backend) | Manual if/else validation chains |
| ORM | Prisma | Raw `pg` driver for app logic (fine for one-off scripts only) |
| Auth | Established auth library / vetted JWT pattern | Hand-rolled crypto/session logic |
| AI orchestration | LangChain (Python) | Direct undocumented prompt-stitching with no framework/version control |
| Logging | pino / winston (structured) | `console.log` in production code |

---

## 7. Boundaries for AI Assistants Working on This Codebase

If an AI coding assistant (including Claude) is used to write code for this repo, it must:
1. Read **Memory.md** before starting work in a new session, to avoid re-doing or contradicting prior decisions.
2. Update **Memory.md** after completing any meaningful unit of work.
3. Never invent scheme eligibility rules — if a rule isn't specified, flag it as an open question rather than guessing a plausible-sounding rule.
4. Never modify Security.md's rate-limiting or auth logic without explicit human sign-off, given the sensitivity of that surface.
5. Always check this Rules.md file before introducing a new library or pattern not already listed here.