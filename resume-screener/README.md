# HireIQ — AI-Powered Resume Screening

Screen hundreds of resumes in seconds using AI. HireIQ scores candidates, identifies skill gaps, and generates actionable summaries so you can focus on interviewing the best talent.

Built with **Next.js 16**, **Firebase**, **Google Gemini AI**, and **Tailwind CSS v4**.

---

## Features

- **Instant AI Scoring** — Upload a job description and candidate resumes. HireIQ returns a 0–100 match score for each candidate.
- **Skill Gap Analysis** — See exactly which required skills a candidate has and which are missing.
- **Executive Summaries** — Concise AI-generated 2-sentence summaries of each candidate's fit.
- **Batch Uploads** — Upload multiple PDF resumes at once for parallel screening.
- **Recommendation Filters** — Sort candidates by Strong Fit, Possible Fit, or Not a Fit.
- **CSV Export** — Download candidate results as a CSV file for further analysis.
- **User Authentication** — Email/password and Google sign-in via Firebase Auth.
- **Plan-based Quotas** — Free tier (20 screens/month) and Pro tier (unlimited) with Razorpay integration.
- **Dark/Light Mode** — Class-based theming via `next-themes` (light default).

---

## Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Framework   | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling     | Tailwind CSS v4 (`@theme inline`) |
| Auth        | Firebase Authentication |
| Database    | Cloud Firestore |
| AI          | Google Gemini API |
| Payments    | Razorpay |
| File Upload | UploadThing |
| PDF Parsing | pdf.js |
| Fonts       | Plus Jakarta Sans, JetBrains Mono |
| Icons       | Lucide React |
| Deployment  | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Firebase project (with Auth + Firestore enabled)
- Google Gemini API key
- UploadThing account
- Razorpay account (optional, for payment processing)

### Installation

```bash
git clone <repo-url>
cd resume-screener
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side)
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_PROJECT_ID=

# Google Gemini
GEMINI_API_KEY=

# UploadThing
UPLOADTHING_TOKEN=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

---

## Project Structure

```
resume-screener/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── api/
│   │   ├── __tests__/
│   │   │   └── screen.route.test.ts  # Integration tests
│   │   ├── razorpay/
│   │   │   ├── create-subscription/route.ts
│   │   │   └── webhook/route.ts
│   │   ├── screen/route.ts           # AI screening endpoint
│   │   └── uploadthing/route.ts      # File upload routes
│   ├── billing/page.tsx
│   ├── dashboard/
│   │   ├── [jobId]/page.tsx          # Candidate results per job
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Job listing dashboard
│   ├── profile/page.tsx
│   ├── globals.css                   # Design tokens & utilities
│   ├── layout.tsx                    # Root layout with fonts & theme
│   └── page.tsx                      # Landing page
├── components/
│   ├── __tests__/
│   │   ├── CandidateCard.test.tsx
│   │   └── UploadForm.test.tsx
│   ├── ui/
│   │   ├── __tests__/                # Button, Badge, Card, Input, Skeleton
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── skeleton.tsx
│   ├── CandidateCard.tsx
│   ├── CompareView.tsx
│   ├── Navbar.tsx
│   ├── OnboardingTour.tsx
│   ├── PlanGate.tsx
│   ├── Sidebar.tsx
│   ├── UpgradeModal.tsx
│   └── UploadForm.tsx
├── lib/
│   ├── __tests__/
│   │   ├── gemini.test.ts
│   │   ├── rate-limit.test.ts
│   │   ├── setup.ts
│   │   └── utils.test.ts
│   ├── auth-context.tsx           # Auth provider & hooks
│   ├── firebase.ts                # Firebase client config
│   ├── firebase-admin.ts          # Firebase admin SDK
│   ├── gemini.ts                  # Gemini API wrapper
│   ├── rate-limit.ts              # In-memory rate limiter
│   ├── types.ts                   # Shared TypeScript types
│   ├── use-toast.tsx              # Toast notification system
│   └── utils.ts                   # cn(), toDate() utilities
├── public/
│   └── pdf.worker.min.mjs         # Local PDF.js worker (pinned version)
├── utils/
│   └── uploadthing.ts
├── vitest.config.ts               # Vitest configuration
└── empty-module.js                # Module stub for tests
```

---

## Design System

The visual language is **light, precise, and trustworthy** — inspired by Linear, Vercel, and Razorpay.

- Light canvas (`#F8FAFC`) with generous whitespace
- Blue-600 (`#2563EB`) as the single primary action color
- Flat surfaces with hairline borders — no gradients, glows, or decorative noise
- Typography-driven hierarchy with Plus Jakarta Sans
- See `DESIGN.md` for the full design system documentation.

---

## Scripts

| Script   | Description |
|----------|-------------|
| `dev`    | Start development server |
| `build`  | Production build |
| `start`  | Start production server |
| `lint`   | Run ESLint |
| `test`   | Run all tests (`npx vitest run`) |
| `test:watch` | Run tests in watch mode (`npx vitest`) |

---

## Deployment

Deploy to [Vercel](https://vercel.com):

```bash
npx vercel
```

Set all environment variables in the Vercel dashboard. The Firebase Admin SDK requires `FIREBASE_PRIVATE_KEY` to use actual newlines (`\n`) — ensure they are properly escaped in the Vercel environment variables.
