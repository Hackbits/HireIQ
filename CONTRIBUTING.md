# Contributing to HireIQ

## Getting Started

1. Fork the repository
2. Clone your fork
3. Run `cd resume-screener && npm install`
4. Copy `.env.example` to `.env.local` and fill in the required values
5. Run `npm run dev` to start the development server

## Development Workflow

- Create a branch from `main` for your work: `git checkout -b feat/my-feature`
- Run `npm run dev` for local development
- Run `npm run build` to verify the production build before committing
- Run `npm run lint` to check for lint issues
- Run `npm run test` to ensure all tests pass

## Code Style

- **TypeScript** — Strict mode. Avoid `any` types.
- **Tailwind CSS v4** — Use `@theme inline` tokens. Follow the design system in `DESIGN.md`.
- **Components** — Place shared UI in `components/ui/`. Use `cn()` from `lib/utils.ts` for class merging.
- **Imports** — Use path aliases (`@/` maps to `./`). Group by: external → internal → types.
- **No comments** in source code unless absolutely necessary for clarity.

## Testing

All changes must include or update tests. The project uses Vitest + Testing Library.

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run vitest run components/__tests__/UploadForm.test.tsx  # Single file
```

## Commit Conventions

Use conventional commits:

```
feat: add batch resume upload
fix: handle empty job description
chore: update dependencies
docs: add deployment guide
test: add rate limit tests
refactor: extract PDF parsing helper
```

## Pull Request Process

1. Ensure the build passes (`npm run build`)
2. Ensure all tests pass (`npm run test`)
3. Ensure lint is clean (`npm run lint`)
4. Update `TASK.md` if your PR addresses an open task
5. Keep PRs focused on a single concern

## Project Structure

```
resume-screener/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components (ui/ for primitives)
├── lib/           # Shared utilities, types, and service wrappers
├── public/        # Static assets (PDF worker, icons, cmaps)
└── utils/         # Third-party service configs
```

## Design System

This project follows a specific design language — light canvas, blue-600 primary, flat surfaces with hairline borders. See `DESIGN.md` for full documentation. New components should match the existing visual language.

## Next.js 16 Notes

This project uses Next.js 16 with Turbopack. Refer to `node_modules/next/dist/docs/` for any API changes not covered in your existing knowledge. Be especially careful with:
- File conventions (layout, page, route)
- RSC boundaries and `"use client"` directives
- Metadata and viewport exports

## Questions?

Open a [GitHub Issue](https://github.com/Hackbits/HireIQ/issues) for bugs or feature requests.
