Security.md — Saarthi AI
Security Checkups, Rate Limiting, Activity Flagging & Latency Handling

This file defines concrete, actionable security practices — not general advice. Anything marked [HARD REQUIREMENT] must not ship without it.

1. Regular Security Checkups (Cadence)
Checkup	Frequency	What it covers
Dependency vulnerability scan	Every PR (automated, CI) + weekly full scan	npm audit / pip-audit / Snyk/Dependabot across all three services (web, backend, ai-engine)
Secrets scan	Every commit (pre-commit hook + CI)	No API keys, DB credentials, or tokens committed (e.g., gitleaks/trufflehog)
Auth/session review	Every release	Session expiry, token rotation, refresh-token handling still correct
Access control review	Monthly	Confirm no route is missing auth middleware; confirm admin routes are role-gated
Penetration test / manual audit	Before public launch, then quarterly	External or internal red-team pass on auth, rate limits, injection surfaces
Data retention audit	Quarterly	Confirm uploaded documents older than the retention policy are actually deleted (see Section 5)

[HARD REQUIREMENT] CI must fail the build if a dependency scan finds a critical/high severity vulnerability with a known fix available.

2. Rate Limiting — Divided Per Route Group

Rate limiting must be granular per route group, not a single global limit — different endpoints have very different abuse profiles and cost profiles (AI calls are expensive; static reads are cheap).

Route Group	Example Endpoints	Suggested Limit (per user/IP)	Rationale
Auth	/auth/login, /auth/signup, /auth/otp	5 requests / 5 min	Brute-force / credential-stuffing protection
Profile	/profile/*	30 requests / min	Normal usage is infrequent writes
Eligibility / Scheme Matching	/eligibility/check, /schemes/*	20 requests / min	Rule-engine calls are cheap but still guarded against scraping
AI Copilot / Chat	/ai/chat, /ai/explain	10 requests / min, plus a daily cap (e.g., 100/day/user)	AI calls are the most expensive (compute + token cost) and most abusable for scraping/prompt-injection probing
Document Upload / OCR	/documents/upload	10 requests / hour	OCR/file processing is resource-intensive; also limits abuse for storage-filling attacks
Notifications	/notifications/*	60 requests / min	Mostly reads, low risk, but still capped
Admin routes	/admin/*	Separate, stricter IP-allowlisted limit	Highest-privilege surface

Implementation notes:

Use Redis-backed rate limiting (sliding window or token bucket) so limits are consistent across horizontally scaled backend instances — an in-memory limiter per server instance is not sufficient once there's more than one server.
Rate limit both by authenticated user ID (when logged in) and by IP (for pre-auth routes like signup/login), so a single account can't be used to bypass IP-based limits and vice versa.
Return a standard 429 Too Many Requests with a Retry-After header — never fail silently or with a generic 500.

[HARD REQUIREMENT] The AI Copilot route group must have both a per-minute and a per-day cap, since it is the most expensive and most abusable surface (prompt-injection probing, scraping scheme data via chat).

3. Suspicious Sign-Up & Activity Flagging

Automated flags (not necessarily automatic blocks — flag for review first, to avoid false-positive lockouts of legitimate users, especially since target personas include less tech-savvy users):

Signal	Flag Condition	Action
Rapid repeat sign-ups	>3 sign-ups from same IP within 10 min	Soft flag, require additional verification (OTP/CAPTCHA)
Disposable/temp email domains	Email domain matches known disposable-email list	Flag, allow but mark account as unverified-tier
Abnormal request velocity	User/IP exceeds 3x their typical request rate	Temporary soft rate-limit tightening + log for review
Repeated failed logins	>5 failed attempts in 15 min	Temporary lockout with cooldown + notify user via registered email
Document upload anomalies	Unusually large number of uploads in short window, or files that fail OCR/validation repeatedly	Flag account, pause further uploads pending review
Geo-velocity anomaly	Login from geographically implausible location shortly after another login	Flag, optionally require re-authentication

Implementation notes:

Maintain an ActivityFlag table/log (not just a boolean on the user) so patterns can be reviewed historically, not just the current state.
Flags should feed an admin review queue, not silent auto-bans — false positives on a civic/welfare platform are especially costly (locking out a genuine farmer/senior citizen user is a real harm, not just an inconvenience).
Use CAPTCHA (e.g., hCaptcha) on signup and after repeated failed logins, not on every single request — over-using CAPTCHA hurts usability for the less tech-savvy personas.
4. Latency & Crash Resilience — Skeleton Loading Requirement

[HARD REQUIREMENT] Any view that depends on a network call expected to take >300ms, or that has historically shown high-latency risk (AI Copilot responses, roadmap generation, scheme matching under load), must show a skeleton loader matching the shape of the eventual content rather than a blank screen or an indeterminate spinner — see Design.md, Section 4 for the visual spec.

Behavior Under Load / Slow Generation
Immediate skeleton render: On request initiation, render the skeleton for the expected content shape immediately — do not wait to see if the response is slow before showing it.
Progressive/streaming where possible: For AI Copilot responses in particular, stream tokens as they arrive rather than waiting for the full response — this both improves perceived performance and reduces the chance of a full-page timeout feeling broken.
Background prefetch during skeleton display: While the skeleton is showing, prefetch/warm any adjacent data likely to be needed next (e.g., while roadmap is generating, prefetch the user's scheme-matching results in the background) so the next transition feels instant.
Hard timeout fallback: If a request exceeds a defined hard timeout (suggested: 10s for AI calls, 5s for standard API calls), replace the skeleton with an explicit retry state ("This is taking longer than expected — retry?") rather than an indefinite skeleton, which reads as a crash to the user.
Circuit breaker on the backend: If the AI Engine (or an external government API) is failing/timing out repeatedly, the backend should trip a circuit breaker and return a fast, graceful "service temporarily unavailable" response rather than letting every request hang until its own timeout — this protects the whole system from cascading slowness under load.
5. Data Handling & Privacy (Ties to PRD Non-Functional Requirements)
Consent-based document storage: Documents uploaded for OCR/readiness-checking require explicit, logged user consent before storage; users can request deletion at any time.
Data retention: Define a concrete retention period (e.g., 90 days post-upload, or immediately after successful application confirmation) — "as needed" is not an acceptable policy; this must be a specific, enforced number (see Memory.md open questions — this needs to be finalized before Phase 5).
Encryption at rest and in transit: All S3-stored documents encrypted at rest (SSE-S3 or SSE-KMS); all API traffic over TLS only, no plain HTTP anywhere, including internal service-to-service calls where feasible.
Data minimization to AI Engine: The AI Engine receives only the minimal profile fields needed for a given request — never a full user record — reducing blast radius if that service is ever compromised (see Rules.md).
PII in logs: Never log full documents, full profile data, or raw uploaded file contents. Log IDs/references only, with actual sensitive payloads accessible only through an audited access path.
6. Security Checklist Before Any Production Deploy
 All routes behind auth middleware except explicitly public ones (login/signup/public scheme listing)
 Rate limits configured per route group per Section 2, backed by Redis
 Activity-flagging rules active and feeding an admin review queue
 Skeleton loaders + hard timeouts + circuit breakers in place for all AI/external-API-dependent views
 Dependency scan clean (no unpatched critical/high vulnerabilities)
 Secrets scan clean, all credentials in environment variables / secrets manager
 Data retention policy implemented and enforced (not just documented)
 TLS enforced everywhere, encryption at rest confirmed for S3 documents
 Admin routes IP-allowlisted or additionally MFA-gated