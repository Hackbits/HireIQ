# HireIQ — Task List

> Command: `task <number>` to start a task, `task list` to show all tasks.

---

## Phase 1: Critical Fixes (App-Blocking)

- [x] **T1** — Configure Gemini API Key in `.env.local` (verified working, model updated to `gemini-2.0-flash`)
- [x] **T2** — Migrate Stripe → Razorpay (Indian payment gateway) — created Razorpay API routes (create-subscription + webhook), updated UpgradeModal & billing page to ₹999/mo, removed Stripe packages
- [x] **T3** — Deploy Firestore composite indexes for dashboard query (`createdBy↑, createdAt↓` on `jobs`; `jobId↑, score↓` on `candidates`)

## Phase 2: Security & Hygiene

- [x] **T4** — Remove committed secrets — cleaned `.env.example` template, fixed `.gitignore` to allow tracking it
- [x] **T5** — Add rate limiting to `/api/screen` (10 req/min per user, in-memory, with cleanup)
- [x] **T6** — Replace all `any` types with proper TypeScript types (13 instances → 0, added `toDate` helper, `TimestampLike` type)
- [x] **T7** — Remove unused `uuid` and `@types/uuid` dependencies

## Phase 3: Testing

- [x] **T8** — Install testing framework (Vitest + Testing Library, jsdom, path aliases, setup file, npm scripts)
- [x] **T9-T11** — Full test suite: 66 tests across 11 files passing
  - Unit: `gemini.test.ts`, `utils.test.ts`, `rate-limit.test.ts`
  - Integration: `screen.route.test.ts` (POST /api/screen)
  - Component: `UploadForm.test.tsx`, `CandidateCard.test.tsx`
  - UI: `button.test.tsx`, `badge.test.tsx`, `card.test.tsx`, `input.test.tsx`, `skeleton.test.tsx`

## Phase 4: Bug Fixes

- [x] **T12** — Fix dashboard redirect race condition (skeleton flash for unauthenticated users — render `null` instead of skeleton before redirect)
- [x] **T13** — Fix PDF.js worker CDN version mismatch risk (copy worker to `public/`, use local URL)
- [x] **T14** — Fix `profile` null safety in `UploadForm.tsx` (already guarded by T6)
- [x] **T15** — Fix stale closure in `billing/page.tsx` (added `refreshUserData` to useEffect deps)
- [ ] **T16** — Investigate canvas/encoding stub silent failures in pdf.js

## Phase 5: Features & Polish

- [ ] **T17** — Create separate LandingNavbar for landing page
- [ ] **T18** — Add PWA / Service Worker support
- [ ] **T19** — Set up Vercel deployment config (`.vercel/project.json`)

## Phase 6: Documentation & QA

- [ ] **T20** — Full end-to-end manual QA pass
- [ ] **T21** — Document known limitations in README
- [ ] **T22** — Add contribution guidelines

---

## Running Tests

```bash
# Run all tests
npx vitest run

# Run in watch mode
npx vitest

# Run specific test file
npx vitest run lib/__tests__/gemini.test.ts
```

## Quick Reference

- **Pricing**: ₹999/mo (Pro), Free tier: 20 screens/month
- **Payment Gateway**: Razorpay (redirect-based checkout)
- **API Routes**: `POST /api/razorpay/create-subscription`, `POST /api/razorpay/webhook`
- **Rate Limiting**: 10 req/min per user on `/api/screen`
- **Gemini Model**: `gemini-2.0-flash`
- **PDF Worker**: Served from `public/pdf.worker.min.mjs` (local, pinned version)
