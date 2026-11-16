# Phases.md — Saarthi AI

## Project Phase Breakdown

This file defines sequential build phases. **Do not start a phase before the prior phase's exit criteria are met.** This is intentional — this project has real-world stakes (users making decisions based on eligibility info), so shortcuts compound into hallucination/misinformation risk later.

---

## Phase 0 — Foundations (Pre-Build)

**Goal:** Nothing user-facing yet — get the ground truth right.

- [ ] Finalize PRD scope (resolve Open Questions in PRD.md — which states, who curates scheme data, retention policy)
- [ ] Set up monorepo structure (see Architecture.md folder structure)
- [ ] Set up Docker Compose for local dev (Postgres, MongoDB, Redis, Backend, AI Engine)
- [ ] Set up CI pipeline (lint, typecheck, test on every PR)
- [ ] Create Memory.md and Security.md and commit initial versions
- [ ] Define canonical scheme/scholarship data schema (`packages/scheme-data-schema`)

**Exit criteria:** A developer can clone the repo, run `docker-compose up`, and have all services boot locally with a seeded database.

---

## Phase 1 — Core Auth & Profile

**Goal:** Users can sign up and build a profile. No AI yet.

- [ ] Auth (signup/login, session management, password or OTP flow)
- [ ] Profile builder UI (progressive form, not one giant form)
- [ ] Profile data model + Prisma schema
- [ ] Basic rate limiting on auth routes (see Security.md)
- [ ] Skeleton loading states for profile save/load

**Exit criteria:** A real user can create an account, fill a profile, log out, log back in, and see the same profile.

---

## Phase 2 — Rule Engine & Scheme Data (No AI Yet)

**Goal:** Deterministic eligibility matching works end-to-end with real (even if limited) scheme data.

- [ ] Ingest a curated, verified starter set of schemes/scholarships (manually curated, small but accurate — quality over coverage)
- [ ] Build the deterministic rule engine (profile → eligible schemes)
- [ ] Scheme detail view (benefit summary, required documents, official link)
- [ ] Admin dashboard v0 — add/edit/verify a scheme record manually

**Exit criteria:** Given a real user profile, the system returns a correct, explainable eligibility list with zero AI involvement, verified against manual audit.

---

## Phase 3 — AI Copilot Layer (RAG)

**Goal:** Add the explanation and chat layer on top of the already-correct rule engine.

- [ ] Stand up AI Engine (FastAPI) with LangChain + Vector DB
- [ ] Ingest verified scheme documents into the vector store (versioned)
- [ ] Build `/ai/explain` endpoint — explains a rule-engine result in plain language, with citations
- [ ] Build the RAG chatbot (scoped to education/scheme/scholarship topics only)
- [ ] Implement hallucination guardrails (confidence thresholds, citation enforcement — see Rules.md)
- [ ] Load-test AI Engine latency; wire up skeleton loaders on the frontend for AI-dependent views

**Exit criteria:** AI explanations are consistently grounded and cited; a manual audit shows zero unsupported eligibility claims from the chatbot.

---

## Phase 4 — Student Roadmap Engine

**Goal:** Second core pillar goes live.

- [ ] Roadmap generation logic (semester plan, skill-gap analysis, certifications, internships)
- [ ] Progress tracker UI
- [ ] Roadmap reacts incrementally to profile changes (not full regeneration each time)
- [ ] Integrate roadmap milestones into the notification system

**Exit criteria:** A student profile produces a coherent, editable roadmap that updates sensibly when the profile changes.

---

## Phase 5 — Document Readiness Assistant

**Goal:** Reduce application friction.

- [ ] OCR upload pipeline (S3 storage, encrypted, consent-based retention — see Security.md)
- [ ] Missing-document detection against a scheme's required-documents list
- [ ] Readiness checklist UI with completion percentage

**Exit criteria:** A user can upload documents and get an accurate, real-time readiness checklist for a specific scheme/scholarship.

---

## Phase 6 — Notifications & Deadline Tracking

**Goal:** Close the loop so users act in time.

- [ ] Notification service (in-app + email)
- [ ] Deadline tracking tied to scheme/scholarship data
- [ ] Digest/batching logic (avoid notification fatigue)

**Exit criteria:** A user with an upcoming scholarship deadline receives a timely, accurate reminder.

---

## Phase 7 — Hardening & Launch Readiness

**Goal:** Production-grade, not just feature-complete.

- [ ] Full security audit pass (see Security.md checklist)
- [ ] Rate limiting finalized per route group, load-tested
- [ ] Skeleton/loading states audited across every AI- or network-dependent view
- [ ] Multilingual-readiness check (no hardcoded strings; i18n scaffolding in place even if only 1–2 languages ship)
- [ ] Accessibility pass (keyboard nav, contrast ratios given the dark theme — see Design.md)
- [ ] Beta user testing with real profiles across all target personas (students, farmers, women, job seekers, senior citizens)

**Exit criteria:** Product is stable under realistic load, passes security checklist, and beta users can complete the full flow (signup → profile → roadmap/matching → document readiness → notification) without hitting a dead end.

---

## Phase 8+ — Future Scope (Post-MVP)

- DigiLocker integration
- Voice assistant
- Full 22 Indian language support
- College ERP integration
- Institutional analytics dashboard

---

## Notes on Sequencing

- **AI is deliberately Phase 3, not Phase 1.** The rule engine must be correct and auditable *before* an explanation layer is put on top of it — otherwise it's impossible to tell whether a wrong answer came from bad data or AI hallucination.
- **Security is not a single phase** — the checklist in Security.md applies incrementally from Phase 1 onward; Phase 7 is the final audit, not the first security work.