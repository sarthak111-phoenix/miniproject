# Architecture.md — Saarthi AI

## App Flow, Folder Structure & Tech Stack

---

## 1. High-Level Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────────┐     ┌─────────────┐
│  Frontend   │────▶│  Backend APIs     │────▶│    AI Engine        │────▶│  Data Layer │
│  (Next.js)  │◀────│  (Node/Express)   │◀────│  (Python/FastAPI)   │◀────│ (Postgres/  │
└─────────────┘     └──────────────────┘     └───────────────────┘     │  Mongo/Redis)│
                              │                                          └─────────────┘
                              ▼
                    ┌──────────────────┐
                    │ Government APIs / │
                    │ Verified Data     │
                    │ Sources           │
                    └──────────────────┘
```

**Key architectural principle:** The Backend (Node/Express) is the single gatekeeper for all client traffic. The AI Engine (Python/FastAPI) is an **internal-only** service — never exposed directly to the frontend. This gives us one place to enforce auth, rate limiting, and validation (see Security.md).

---

## 2. Request Flow (End-to-End Example: "Am I eligible for Scheme X?")

1. Frontend sends authenticated request to Backend (`/api/eligibility/check`).
2. Backend validates session, applies rate limit for that route group (see Security.md).
3. Backend fetches user profile from PostgreSQL.
4. Backend calls the **Rule Engine** (can live in Backend or AI Engine — MVP decision: rule engine lives in Node backend for determinism and low latency; AI Engine is only called for explanation/RAG).
5. If a natural-language explanation is needed, Backend calls AI Engine (`/ai/explain`) with the rule result + scheme metadata as grounding context.
6. AI Engine runs RAG against the Vector DB (verified scheme documents only), returns a grounded explanation.
7. Backend composes final response (rule result + AI explanation + document checklist) and returns to Frontend.
8. Frontend renders result; if any step exceeds a latency threshold, skeleton loaders render in place of the pending sections (see Design.md).

**Rule of thumb:** Rule Engine = source of truth for "yes/no". AI Engine = source of truth for "here's why, in plain language." Never let the AI Engine's output override rule-engine eligibility (see Rules.md, AI boundaries).

---

## 3. Tech Stack

### Frontend
- **Next.js** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** for component primitives

### Backend
- **Node.js** + **Express.js**
- **TypeScript** throughout
- **Prisma** ORM (PostgreSQL as primary relational store)

### AI Layer
- **Python** + **FastAPI**
- **LangChain** for RAG orchestration
- **Vector DB** (e.g., pgvector, Pinecone, or Qdrant — pick one and standardize; do not mix vector DBs across environments)

### Database / Storage
- **PostgreSQL** — structured data: users, profiles, schemes (metadata), roadmap state, applications
- **MongoDB** — semi-structured/flexible data: scheme raw documents, scraped content, versioned scheme snapshots
- **Redis** — caching, session store, rate-limit counters, job queues

### Deployment
- **Docker** for all services (Backend, AI Engine each containerized separately)
- **Vercel** for frontend hosting
- **AWS S3** for document/OCR file storage (encrypted, with consent-based lifecycle policies)

---

## 4. Folder & File Structure

```
saarthi-ai/
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── roadmap/
│   │   │   │   ├── schemes/
│   │   │   │   ├── scholarships/
│   │   │   │   ├── documents/
│   │   │   │   └── notifications/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn primitives
│   │   │   ├── roadmap/
│   │   │   ├── schemes/
│   │   │   └── shared/             # skeleton loaders, error boundaries
│   │   ├── lib/
│   │   │   ├── api-client.ts
│   │   │   └── hooks/
│   │   ├── styles/
│   │   └── public/
│   │
│   ├── backend/                    # Node/Express API
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── profile.routes.ts
│   │   │   │   ├── roadmap.routes.ts
│   │   │   │   ├── eligibility.routes.ts
│   │   │   │   ├── scholarship.routes.ts
│   │   │   │   ├── documents.routes.ts
│   │   │   │   └── notifications.routes.ts
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   │   ├── ruleEngine/     # deterministic eligibility logic
│   │   │   │   ├── aiClient/       # calls AI Engine internally
│   │   │   │   └── notificationService/
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rateLimit.middleware.ts   # per-route-group limits
│   │   │   │   └── errorHandler.middleware.ts
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma
│   │   │   └── index.ts
│   │   └── Dockerfile
│   │
│   └── ai-engine/                  # Python/FastAPI
│       ├── app/
│       │   ├── main.py
│       │   ├── routers/
│       │   │   ├── explain.py
│       │   │   ├── chat.py
│       │   │   └── roadmap_ai.py
│       │   ├── rag/
│       │   │   ├── retriever.py
│       │   │   ├── vector_store.py
│       │   │   └── ingestion/      # scheme document ingestion pipeline
│       │   ├── guardrails/         # hallucination boundaries, citation enforcement
│       │   └── config.py
│       └── Dockerfile
│
├── packages/
│   ├── shared-types/                # TS types shared between web & backend
│   └── scheme-data-schema/          # canonical schema for scheme/scholarship records
│
├── docs/
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Rules.md
│   ├── Phases.md
│   ├── Design.md
│   ├── Memory.md
│   └── Security.md
│
├── docker-compose.yml
└── README.md
```

---

## 5. Data Model Overview (High Level)

**PostgreSQL (via Prisma):**
- `User`, `Profile`, `RoadmapMilestone`, `SchemeEligibilityResult`, `Application` (self-reported status), `NotificationPreference`

**MongoDB:**
- `SchemeRawDocument` (versioned, sourced), `ScrapeLog`, `IngestionAudit`

**Redis:**
- Session tokens, rate-limit counters (keyed per route group + user/IP), background job queues (BullMQ or similar)

---

## 6. Service Boundaries (Why This Split)

- **Frontend never talks to AI Engine directly.** All AI calls are proxied through Backend so we can enforce auth, rate limits, and logging in one place.
- **Rule Engine lives in Backend, not AI Engine**, because eligibility must be deterministic, testable, and auditable without depending on model behavior.
- **AI Engine is stateless per-request** — it receives all context it needs (profile snippet + scheme snippet) in the request; it does not query the primary databases directly. This keeps the attack surface and blast radius small.