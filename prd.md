# PRD.md — Saarthi AI

## Product Requirements Document

---

## 1. Product Summary

**Saarthi AI** is an integrated AI-powered platform combining two core value propositions into one product:

1. **Student Roadmap Engine** — personalized academic/career roadmaps for students.
2. **Government Scheme & Scholarship Eligibility Matcher** — helps citizens discover schemes, scholarships, and welfare benefits they qualify for.

The core insight: information about education paths, scholarships, and government welfare schemes in India is fragmented across dozens of portals (NSP, state portals, UGC, AICTE, ministry sites). Saarthi AI unifies discovery, eligibility-matching, and actionable next steps into a single guided experience.

---

## 2. What to Build

### 2.1 Problem We Are Solving
- Users don't know what schemes/scholarships they qualify for.
- Students don't have a clear, personalized path from "where I am" to "where I want to be."
- Even when a scheme is known, users don't know what documents are needed or how to apply.
- No single source of truth — user has to visit 5–10 different government sites.

### 2.2 What Saarthi AI Delivers
- A single onboarding profile that powers **both** the student roadmap and the scheme/scholarship matching (no duplicate data entry).
- A rules-engine + RAG-based AI layer that explains *why* a user is/isn't eligible, in plain language.
- A living roadmap that updates as the student's profile changes (new semester, new skill, new certification).
- A document-readiness assistant so users know exactly what they need before they apply.
- Deadline tracking and notifications so nothing is missed.

### 2.3 What We Are NOT Building (MVP Scope Guardrails)
- We are **not** building a government application-submission portal — we link out to official portals; we do not submit applications on the user's behalf.
- We are **not** storing final legal/official documents long-term without explicit consent (see Security.md).
- We are **not** guaranteeing eligibility outcomes — Saarthi AI provides guidance, not government adjudication.
- We are **not** launching all 22 Indian languages in MVP — that is future scope.

---

## 3. Targeted Users

| Persona | Primary Need |
|---|---|
| **Students** (school/college) | Roadmap, skill-gap analysis, scholarships |
| **Citizens (general)** | Discover welfare schemes they qualify for |
| **Farmers** | Agricultural subsidy & scheme discovery |
| **Women** | Women-specific welfare/empowerment schemes |
| **Job seekers** | Skill certification schemes, employment schemes |
| **Senior citizens** | Pension & healthcare scheme discovery |

Each persona shares the same underlying eligibility engine but sees a tailored questionnaire and tailored roadmap/scheme surface.

---

## 4. Core Modules (Feature Breakdown)

### 4.1 Student Roadmap Engine
- Semester-wise academic roadmap generation
- Skill-gap analysis (current skills vs. target career path)
- Certification recommendations
- Internship tracker
- Progress tracker with milestones

**Acceptance criteria:**
- Given a student profile (course, semester, career goal), the system generates a roadmap within a bounded, deterministic time (loading state required beyond 2s — see Design.md skeleton loader).
- Roadmap updates incrementally, not regenerated from scratch, when one profile field changes.

### 4.2 Government Scheme Eligibility Matcher
- Profile-based eligibility questionnaire (progressive, not one giant form)
- Rule-based matching engine (deterministic — not purely LLM-guessed)
- Plain-language benefit summary
- Required-documents checklist per scheme
- Direct official application links (never a fake/shadow application flow)

**Acceptance criteria:**
- Every "eligible" result must be traceable to a rule, not an LLM guess (LLM explains, rule engine decides — see Rules.md).
- Every scheme result links to a verified, official government source.

### 4.3 Scholarship Matcher
- NSP (National Scholarship Portal) + state-level scholarship discovery
- Deadline reminders
- Eligibility explanation in plain language

### 4.4 AI Copilot (RAG + Rule Engine)
- RAG chatbot grounded in verified scheme/scholarship documents
- Career guidance conversation
- Scheme explanation on demand
- Document guidance ("what do I need for X?")

**Acceptance criteria:**
- The AI Copilot must never state a hard eligibility determination without citing the underlying rule — see Rules.md for hallucination boundaries.

### 4.5 Document Readiness Assistant
- OCR upload of user documents
- Missing-document detection against the scheme's required list
- Readiness checklist with completion %

### 4.6 Notifications & Deadline Tracker
- Scholarship/scheme deadline reminders
- Roadmap milestone reminders
- Digest notifications (not spammy — batched)

---

## 5. User Flow

```
Sign up → Build profile → AI roadmap → Eligibility matching → Notifications → Progress tracking
```

Detailed flow:
1. **Sign up / Auth** (email or phone OTP)
2. **Profile builder** — progressive disclosure, one section at a time (education, location, income bracket, category, occupation, goals)
3. **Roadmap generation** — student track only, if applicable
4. **Eligibility matching** — runs automatically off the same profile, surfaces schemes/scholarships
5. **Document readiness** — user uploads docs, gets a checklist
6. **Notifications** — deadlines and roadmap milestones
7. **Progress tracking** — dashboard view of roadmap completion + application status (self-reported)

---

## 6. Functional Requirements

- Authentication (email/phone, session management)
- Profile management (editable, versioned so roadmap/matching can react to changes)
- Roadmap generation and incremental update
- Scheme matching (rule engine + explanation layer)
- Scholarship matching
- AI chat (RAG, scoped, cited)
- OCR document processing
- Notification system (in-app + email at MVP; push is future scope)

---

## 7. Non-Functional Requirements

- **Secure**: see Security.md
- **Scalable**: stateless backend services, horizontally scalable
- **Responsive**: mobile-first, works on low-end Android devices common among target users
- **Multilingual-ready**: architecture must not hardcode English strings (i18n-ready even if only English/Hindi ship at MVP)
- **Privacy-conscious**: consent-based document storage, minimal data retention

---

## 8. Success Metrics

| Metric | Definition |
|---|---|
| Matching accuracy | % of surfaced schemes the user is genuinely eligible for (validated against manual audit sample) |
| User satisfaction | In-app rating / NPS after roadmap or match result |
| Reduced search time | Time from signup to first relevant scheme/roadmap shown |
| Roadmap completion | % of roadmap milestones marked complete |
| Notification engagement | Open/click rate on deadline and milestone notifications |

---

## 9. Challenges & Mitigations

| Challenge | Mitigation |
|---|---|
| Dynamic scheme updates | Admin dashboard + scheduled re-scraping/verification of official sources |
| Restricted/absent government APIs | Verified-source ingestion pipeline with manual review queue |
| AI hallucinations | Rule engine decides eligibility; RAG only explains, always cited |
| Privacy | Consent-based document handling, encryption at rest, minimal retention |
| Multiple state-level scheme variants | Scheme data modeled with state as a first-class dimension, not a special case |

---

## 10. Future Scope (Explicitly Out of MVP)
- DigiLocker integration
- Voice assistant
- Full 22 Indian language support
- College ERP integration
- Analytics dashboard for institutions

---

## 11. Open Questions (must be resolved before Phase 2 — see Phases.md)
- Which state schemes are in scope for MVP (all states vs. pilot states)?
- Who verifies/curates scheme data (manual team vs. crowdsourced vs. scraped)?
- Data retention period for uploaded documents?