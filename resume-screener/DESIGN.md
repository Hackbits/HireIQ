# Design System

This project uses a dark-first "founder war-room / blueprint desk" visual system. Interfaces should feel like an editorial planning surface: dramatic, tactical, precise, and highly usable.

---

## Stack

- **Framework:** Next.js App Router + React + TypeScript
- **Styling:** Tailwind CSS v4 via `@theme inline` in `app/globals.css`
- **Components:** shadcn-style primitives in `components/ui`
- **Icons:** Lucide React
- **Fonts:** IBM Plex Sans for UI, Fraunces for display headings, IBM Plex Mono for technical labels/code
- **Dark mode:** `next-themes`, class-based, dark default
- **Utilities:** `cn()` from `@/lib/utils`

---

## Visual Direction

The app is a live AI planning desk, not a generic SaaS dashboard.

- Use dark ink backgrounds, warm paper overlays, amber command accents, teal graph highlights, and occasional violet depth.
- Use glassy panels over a visible blueprint grid texture.
- Prefer large editorial display headings with tight tracking.
- Make controls feel tactile: rounded pills, inner shadows, subtle lift on hover, and visible focus rings.
- Avoid generic purple/white gradients, flat gray panels, and default-looking dashboards.

---

## Tokens

All semantic tokens live in `app/globals.css` and are bridged to Tailwind with `@theme inline`.

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `background` | `oklch(0.94 0.032 86)` | `oklch(0.15 0.038 252)` | Page canvas |
| `foreground` | `oklch(0.19 0.029 252)` | `oklch(0.94 0.034 88)` | Primary text |
| `card` | `oklch(0.985 0.026 92 / 84%)` | `oklch(0.205 0.044 252 / 78%)` | Glass/paper panels |
| `primary` | `oklch(0.68 0.165 55)` | `oklch(0.78 0.16 61)` | Amber command actions |
| `accent` | `oklch(0.78 0.122 174)` | `oklch(0.77 0.134 178)` | Teal highlights and graph energy |
| `secondary` | `oklch(0.86 0.055 184 / 80%)` | `oklch(0.25 0.06 244 / 74%)` | Secondary surfaces |
| `muted` | `oklch(0.88 0.03 84 / 68%)` | `oklch(0.26 0.052 252 / 64%)` | Subtle surfaces |
| `muted-foreground` | `oklch(0.42 0.036 252)` | `oklch(0.73 0.042 88)` | Supporting copy |
| `border` | `oklch(0.24 0.035 252 / 18%)` | `oklch(0.98 0.02 88 / 14%)` | Panel and input borders |
| `ring` | `oklch(0.76 0.14 174)` | `oklch(0.8 0.15 178)` | Focus rings |
| `destructive` | `oklch(0.58 0.21 31)` | `oklch(0.68 0.21 31)` | Delete/error actions |

Chart colors use amber, teal, violet, coral, and green variants from `chart-1` through `chart-5`.

---

## Typography

| Token | Font | Usage |
| --- | --- | --- |
| `--font-body` | IBM Plex Sans | Body text, controls, forms |
| `--font-display-family` | Fraunces | Hero headings, card titles, empty states |
| `--font-code` | IBM Plex Mono | Model names, labels, code blocks, technical metadata |

Guidelines:

- Hero headings use `font-display`, very tight tracking, and large scale (`text-5xl` to `text-8xl`).
- Card titles use `font-display text-xl font-bold tracking-tight`.
- Technical eyebrows use `.micro-label`: mono, uppercase, wide tracking.
- Body copy should stay readable with `leading-7` or `leading-8`.

---

## Core Utilities

Defined in `app/globals.css`:

- `.planner-bg`: layered blueprint grid, amber orb, teal orb, violet depth glow.
- `.glass-panel`: high-impact translucent hero/header panel with inner highlight.
- `.paper-card`: default card treatment with translucent surface and deep shadow.
- `.blueprint-surface`: compact grid surface for graphs and empty states.
- `.command-strip`: amber-to-teal-to-violet strip used for command moments.
- `.micro-label`: technical uppercase label style.

---

## Components

### Cards

Cards are rounded, translucent, and tactile.

Use:

```tsx
<Card className="overflow-hidden">
```

Avoid plain white/gray cards. Nested item cards should use `bg-background/30`, borders, backdrop blur, and inner shadow.

### Buttons

Primary buttons use `.command-strip`, pill radius, bold type, and hover lift. Outline buttons are translucent and should reveal amber/teal on hover.

### Inputs

Inputs and textareas use rounded-xl, translucent backgrounds, inner shadows, and strong teal focus rings. They should feel embedded in the planning surface.

### Badges

Badges are mono, uppercase, wide-tracked pills. Use them for system state, streaming mode, and model metadata.

### Graphs

Graph containers use `.blueprint-surface`. React Flow nodes should look like mini glass cards, with teal edge strokes and compact mono field lists.

---

## Layout

Use a wide planning workspace:

```tsx
<main className="planner-bg min-h-screen flex-1 overflow-hidden">
  <div className="container mx-auto max-w-375 px-4 py-8 lg:py-12">
```

The main planner grid uses a sticky left command/graph rail and a wider right editing workspace:

```tsx
grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]
```

Mobile remains single-column with no sticky behavior.

---

## Interaction

- Hover lift: `hover:-translate-y-0.5`
- Focus: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Disabled: `disabled:pointer-events-none disabled:opacity-50`
- Page entrance: `animate-fade-up` and `animate-scale-in`
- Keep motion subtle and purposeful; avoid decorative loops that distract from editing.

---

## Accessibility

- Preserve visible focus rings on all interactive controls.
- Keep text contrast high on translucent panels.
- Provide text representations for graphs and generated data.
- Controls must remain usable on mobile, especially add/remove/edit actions.
