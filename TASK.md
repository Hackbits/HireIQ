# HireIQ — Task List

> Command: `task <number>` to start a task, `task list` to show all tasks.

---

## Phase 1: Critical Fixes (App-Blocking)

- [x] **T1** — Configure Gemini API Key in `.env.local` (verified working, model updated to `gemini-2.0-flash`)
- [x] **T2** — Configure Stripe Keys (create-checkout + webhook)
- [x] **T3** — Deploy Firestore composite index for dashboard query

## Phase 2: Security & Hygiene

- [x] **T4** — Remove committed secrets — cleaned `.env.example` template, fixed `.gitignore` to allow tracking it
- [x] **T5** — Add rate limiting to `/api/screen` (10 req/min per user, in-memory, with cleanup)
- [x] **T6** — Replace all `any` types with proper TypeScript types (13 instances → 0, added `toDate` helper, `TimestampLike` type)
- [x] **T7** — Remove unused `uuid` and `@types/uuid` dependencies

## Phase 3: Testing

- [x] **T8** — Install testing framework (Vitest + Testing Library, 6 smoke tests passing)
- [x] **T9** — Write unit tests for core utilities (gemini.ts, utils.ts, types)
- [x] **T10** — Write integration tests for API routes (/api/screen)
- [x] **T11** — Write component tests (UploadForm, CandidateCard, etc.)

## Phase 4: Bug Fixes

- [x] **T12** — Fix dashboard redirect race condition (skeleton flash for unauthenticated users)
- [x] **T13** — Fix PDF.js worker CDN version mismatch risk
- [x] **T14** — Fix `profile` null safety in `UploadForm.tsx` (already guarded by T6)
- [x] **T15** — Fix stale closure in `billing/page.tsx` (added `refreshUserData` to deps)
- [ ] **T16** — Investigate canvas/encoding stub silent failures in pdf.js

## Phase 5: Features & Polish

- [ ] **T17** — Create separate LandingNavbar for landing page
- [ ] **T18** — Add PWA / Service Worker support
- [ ] **T19** — Set up Vercel deployment config (`.vercel/project.json`)

## Phase 6: Documentation & QA

- [ ] **T20** — Full end-to-end manual QA pass
- [ ] **T21** — Document known limitations in README
- [ ] **T22** — Add contribution guidelines
