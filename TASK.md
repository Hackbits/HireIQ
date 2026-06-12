# HireIQ — Task List

> Command: `task <number>` to start a task, `task list` to show all tasks.

---

## Phase 1: Critical Fixes (App-Blocking)

- [x] **T1** — Configure Gemini API Key in `.env.local` (verified working, model updated to `gemini-2.0-flash`)
- [ ] **T2** — Configure Stripe Keys (create-checkout + webhook)
- [x] **T3** — Deploy Firestore composite index for dashboard query

## Phase 2: Security & Hygiene

- [x] **T4** — Remove committed secrets — cleaned `.env.example` template, fixed `.gitignore` to allow tracking it
- [ ] **T5** — Add rate limiting to `/api/screen`
- [ ] **T6** — Replace all `any` types with proper TypeScript types (10+ instances)
- [ ] **T7** — Remove unused `uuid` dependency

## Phase 3: Testing

- [ ] **T8** — Install testing framework (Vitest/Jest)
- [ ] **T9** — Write unit tests for core utilities (gemini.ts, utils.ts, types)
- [ ] **T10** — Write integration tests for API routes (/api/screen)
- [ ] **T11** — Write component tests (UploadForm, CandidateCard, etc.)

## Phase 4: Bug Fixes

- [ ] **T12** — Fix dashboard redirect race condition (skeleton flash for unauthenticated users)
- [ ] **T13** — Fix PDF.js worker CDN version mismatch risk
- [ ] **T14** — Fix `profile` null safety in `UploadForm.tsx`
- [ ] **T15** — Fix `@ts-expect-error` / stale closure in `billing/page.tsx`
- [ ] **T16** — Investigate canvas/encoding stub silent failures in pdf.js

## Phase 5: Features & Polish

- [ ] **T17** — Create separate LandingNavbar for landing page
- [ ] **T18** — Add PWA / Service Worker support
- [ ] **T19** — Set up Vercel deployment config (`.vercel/project.json`)

## Phase 6: Documentation & QA

- [ ] **T20** — Full end-to-end manual QA pass
- [ ] **T21** — Document known limitations in README
- [ ] **T22** — Add contribution guidelines
