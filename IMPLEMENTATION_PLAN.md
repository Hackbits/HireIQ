# HireIQ Production Upgrade — Implementation Plan

**Current State:** MVP with Firebase Auth, Firestore, Gemini AI, UploadThing, Razorpay
**Target:** Production-ready recruitment intelligence platform

---

## How to Use

Each phase is independent. Within each phase, execute tasks in order.

### Legend

- `[CREATE] path/file.ts` — New file to create
- `[MODIFY] path/file.ts` — Existing file to modify
- `[ENV] VAR_NAME` — New environment variable
- `[DEPS] package-name` — New npm dependency

---

## PHASE 1 — Security & Backend Improvements

**Objective:** Protect all API routes. Restructure Firestore. Add audit logging.

### Tasks

**1.1 Create auth middleware** — `[CREATE] lib/auth-middleware.ts`
Extract Bearer token from Authorization header, verify with Firebase Admin SDK.
Export `verifyAuth(req)` and `verifyAdmin(req)`. Return 401 on failure.

**1.2 Add Firestore schema types** — `[CREATE] lib/firestore-schema.ts`
Explicit interfaces for collections: users, companies, jobs, candidates,
screening_results, subscriptions, audit_logs.

**1.3 Protect API routes** — `[MODIFY]` files:
- `app/api/screen/route.ts` — Add verifyAuth, derive uid from token not client
- `app/api/razorpay/create-subscription/route.ts` — Add verifyAuth
- `app/api/razorpay/webhook/route.ts` — Already server-side, add error states
- `app/api/uploadthing/core.ts` — Add auth check via UploadThing middleware

**1.4 Create company on signup** — `[MODIFY] app/(auth)/signup/page.tsx`
On signup: create company doc, update user doc with companyId + role.

**1.5 Firestore security rules** — `[CREATE] firestore.rules`
Per-collection rules: only authenticated owners/members can read/write.
No public access.

**1.6 Update auth-context** — `[MODIFY] lib/auth-context.tsx`, `lib/types.ts`
Add role, companyId to UserProfile.

---

## PHASE 2 — AI Screening Improvement

**Objective:** Structured AI response. Configurable model.

### Tasks

**2.1 New types** — `[MODIFY] lib/types.ts`
Add: ScoreBreakdown, ScreeningResultDetailed, InterviewQuestion interfaces.

**2.2 Update Gemini prompt** — `[MODIFY] lib/gemini.ts`
New prompt returns: score, recommendation (Strong Fit/Possible Fit/Not a Fit),
scoreBreakdown {technicalSkills/40, experience/30, education/15, roleMatch/15},
matchedSkills, missingSkills, summary, interviewQuestions[].

**2.3 Configurable model** — `[MODIFY] lib/gemini.ts`
Read model from `process.env.GEMINI_MODEL`, default to `gemini-2.0-flash`.

**2.4 Save detailed results** — `[MODIFY] app/api/screen/route.ts`
Save screening_results subcollection under candidate with scoreBreakdown.

`[ENV] GEMINI_MODEL`

---

## PHASE 3 — AI Bias Reduction

**Objective:** Remove PII before AI processing.

### Tasks

**3.1 Create anonymizer** — `[CREATE] lib/anonymizer.ts`
Functions: removeNames, removeEmails, removePhones, removeAddresses,
removeAgeGender, removePhotos. Returns { cleanText, removedFields }.

**3.2 Integrate into Gemini pipeline** — `[MODIFY] lib/gemini.ts`
Call anonymizeResume before sending to AI. Add tests for PII removal.

---

## PHASE 4 — Usage Limits & Cost Control

**Objective:** Upstash Redis rate limiting. Monthly usage tracking.

### Tasks

**4.1 Install Upstash** — `[DEPS] @upstash/redis`
`[ENV] UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN`

**4.2 Create Upstash rate limiter** — `[CREATE] lib/rate-limit-upstash.ts`
Async checkRateLimit with sliding window via Redis.

**4.3 Track monthly usage** — `[MODIFY] lib/types.ts`
Add Usage interface { userId, month, screeningsUsed }.

**4.4 Update screen route** — `[MODIFY] app/api/screen/route.ts`
Replace in-memory with Upstash. Check monthly Firestore usage doc.
Free plan: max 20/month. Pro: unlimited.

**4.5 Keep fallback** — Mark `lib/rate-limit.ts` as deprecated.
Use in-memory when Upstash not configured.

---

## PHASE 5 — Recruiter Features

**Objective:** Candidate status pipeline. Status updates. Enhanced comparison.

### Tasks

**5.1 Status type** — `[MODIFY] lib/types.ts`
Add CandidateStatus = "applied" | "screened" | "shortlisted" | "interview"
| "rejected" | "hired". Add candidateStatus to Candidate interface.

**5.2 Status update API** — `[CREATE] app/api/candidates/status/route.ts`
POST endpoint: { candidateId, status }. Verifies auth, updates Firestore.

**5.3 Update job results page** — `[MODIFY] app/dashboard/[jobId]/page.tsx`
Add status column, inline status change dropdown, filter by status.

**5.4 Update CandidateCard** — `[MODIFY] components/CandidateCard.tsx`
Color-coded status badge. Quick-action buttons (Shortlist, Reject, Interview).

---

## PHASE 6 — Dashboard Analytics

**Objective:** Visual charts and metrics dashboard.

### Tasks

**6.1 Install Recharts** — `[DEPS] recharts`

**6.2 Analytics page** — `[CREATE] app/dashboard/analytics/page.tsx`
Metric cards, Score distribution bar chart, Skills distribution bar chart,
Monthly trend line chart.

**6.3 Update sidebar** — `[MODIFY] components/Sidebar.tsx`
Add Analytics nav item.

**6.4 Aggregation** — Firestore count queries or client-side computation.

---

## PHASE 7 — AI Interview Assistant

**Objective:** Auto-generate interview questions per candidate.

### Tasks

**7.1 Question generation** — `[MODIFY] lib/gemini.ts`
Add `generateInterviewQuestions()` using separate Gemini prompt.
Returns 5-8 questions with type (technical/behavioral/role-specific)
and difficulty (basic/intermediate/advanced).

**7.2 Interview UI** — `[MODIFY] components/CandidateCard.tsx`
Collapsible "AI Interview Preparation" section. Question list with type badges,
copy all button.

**7.3 Persist questions** — Save to screening_results in Firestore.

---

## PHASE 8 — File Upload Improvements

**Objective:** Validation, duplicate detection, progress UI.

### Tasks

**8.1 Stricter validation** — `[MODIFY] components/UploadForm.tsx`
PDF only (enforce server-side). Max 5MB. Corrupted PDF detection via
pdfjs.parse try/catch. Duplicate check (filename + size against Firestore).

**8.2 Update UploadThing core** — `[MODIFY] app/api/uploadthing/core.ts`
Change maxFileSize from 16MB to 5MB. Add auth verification.

**8.3 Progress tracking** — `[MODIFY] components/UploadForm.tsx`
Better state labels: "Validating", "Uploading (3/20)", "Analyzing resume",
"Generating results". Overall progress bar.

---

## PHASE 9 — Payment System Hardening

**Objective:** Payment states. Webhook-only upgrades.

### Tasks

**9.1 Payment states** — `[MODIFY] lib/types.ts`
Add Subscription status: "pending" | "success" | "failed" | "expired".

**9.2 Update webhook** — `[MODIFY] app/api/razorpay/webhook/route.ts`
Store subscription doc with status. Handle all payment events.
Only upgrade user on verified payment.captured event, never on
frontend success.

**9.3 Subscription tracking** — `[MODIFY] lib/auth-context.tsx`
Read subscription status from Firestore subscriptions collection.

---

## PHASE 10 — Privacy Features

**Objective:** Resume retention. Privacy settings.

### Tasks

**10.1 Privacy page** — `[CREATE] app/privacy/page.tsx`
Settings: auto-delete toggle, retention period, data export request.

**10.2 Resume retention cron** — `[CREATE] app/api/cron/cleanup/route.ts`
Daily cron. Query candidates > 90 days old. Delete resumeUrl files
and candidate docs. Log to audit_logs.

**10.3 Update sidebar** — `[MODIFY] components/Sidebar.tsx`
Add Privacy nav item.

`[ENV] RESUME_RETENTION_DAYS` (default: 90)

---

## PHASE 11 — UI Improvements

**Objective:** Search, filters, better loading states.

### Tasks

**11.1 Candidate search** — `[MODIFY] app/dashboard/[jobId]/page.tsx`
Search input that filters candidates by name/skills.

**11.2 Enhanced filters** — `[MODIFY] app/dashboard/[jobId]/page.tsx`
Score range slider. Recommendation type checkboxes. Skills multi-select.

**11.3 Better loading states** — `[MODIFY] components/UploadForm.tsx`
Phase-specific loading text: "Extracting text from resume",
"Comparing with job description", "Generating skill analysis",
"Calculating match score".

**11.4 Empty/error states** — Review all pages for consistent empty state
cards and error boundaries.

---

## PHASE 12 — Testing

**Objective:** Unit + E2E tests for new features.

### Tasks

**12.1 Unit tests**
- `[CREATE] lib/__tests__/anonymizer.test.ts` — PII removal
- `[CREATE] lib/__tests__/auth-middleware.test.ts` — Token verification
- `[UPDATE] lib/__tests__/gemini.test.ts` — New response format

**12.2 E2E tests** — `[DEPS] @playwright/test`
`[CREATE] e2e/happy-path.spec.ts`
Flow: Signup -> Login -> Create job -> Upload resume -> Screen -> View results -> Export CSV

---

## PHASE 13 — Documentation

**Objective:** Update README with production documentation.

### Tasks

**13.1 Architecture diagram** — ASCII diagram showing:
Client -> Next.js -> Firebase Auth -> Gemini AI -> Firestore -> UploadThing -> Razorpay

**13.2 Database schema** — Table of all Firestore collections with fields.

**13.3 API documentation** — All endpoints with request/response schemas.

**13.4 Environment setup** — All env vars with descriptions.

**13.5 Deployment guide** — Vercel deployment steps, webhook configuration.

**13.6 Security notes** — Auth flow, rate limiting, PII handling.

---

## Summary of Changes

### Files to Create (10)
1. `lib/auth-middleware.ts`
2. `lib/firestore-schema.ts`
3. `lib/anonymizer.ts`
4. `lib/rate-limit-upstash.ts`
5. `firestore.rules`
6. `app/api/candidates/status/route.ts`
7. `app/dashboard/analytics/page.tsx`
8. `app/privacy/page.tsx`
9. `app/api/cron/cleanup/route.ts`
10. `e2e/happy-path.spec.ts`

### Files to Modify (15)
1. `lib/types.ts` — New types for ScoreBreakdown, CandidateStatus, etc.
2. `lib/gemini.ts` — Structured response, anonymizer, interview questions
3. `lib/auth-context.tsx` — Role, companyId, subscription status
4. `lib/firebase-admin.ts` — Auth verification helper
5. `app/api/screen/route.ts` — Auth middleware, Upstash, new schema
6. `app/api/razorpay/create-subscription/route.ts` — Auth middleware
7. `app/api/razorpay/webhook/route.ts` — Payment states
8. `app/api/uploadthing/core.ts` — 5MB limit, auth
9. `app/(auth)/signup/page.tsx` — Company creation
10. `app/dashboard/[jobId]/page.tsx` — Status, search, filters, interview UI
11. `components/UploadForm.tsx` — Validation, progress, loading states
12. `components/CandidateCard.tsx` — Status, interview prep
13. `components/Sidebar.tsx` — Analytics, privacy nav items
14. `components/CompareView.tsx` — Enhanced comparison
15. `README.md` — Full documentation update

### New Environment Variables
| Variable | Default | Phase |
|---|---|---|
| GEMINI_MODEL | gemini-2.0-flash | 2 |
| UPSTASH_REDIS_REST_URL | — | 4 |
| UPSTASH_REDIS_REST_TOKEN | — | 4 |
| RESUME_RETENTION_DAYS | 90 | 10 |

### New Dependencies
| Package | Phase |
|---|---|
| @upstash/redis | 4 |
| recharts | 6 |
| @playwright/test | 12 |
