# Design System

A clean, professional SaaS design system. The visual language is **light, precise, and trustworthy** — the kind that signals reliability to enterprise buyers, professors, and investors alike.

---

## Stack

- **Framework:** Next.js App Router + React + TypeScript
- **Styling:** Tailwind CSS v4 via `@theme inline` in `app/globals.css`
- **Components:** shadcn-style primitives in `components/ui`
- **Icons:** Lucide React (or Tabler Icons)
- **Fonts:** Plus Jakarta Sans (UI + body), JetBrains Mono (code/labels)
- **Dark mode:** `next-themes`, class-based, **light default**
- **Utilities:** `cn()` from `@/lib/utils`

---

## Visual Direction

The interface is a **professional B2B SaaS product** — precise, trustworthy, and calm.

- Light canvas with generous whitespace and clear visual hierarchy.
- Blue as the single primary action color; semantic greens, ambers, and reds for status only.
- Flat surfaces with hairline borders — no gradients, no glows, no decorative noise.
- Typography does the heavy lifting: tight tracking on headings, high contrast body copy.
- Interactions feel responsive but restrained — no decorative animations.

Think: Linear, Vercel, Notion, or Stripe. Not a gaming dashboard.

---

## Tokens

All semantic tokens live in `app/globals.css` and are bridged to Tailwind with `@theme inline`.

| Token                | Light                 | Dark                  | Usage                   |
| -------------------- | --------------------- | --------------------- | ----------------------- |
| `background`         | `#F8FAFC` (slate-50)  | `#0F172A` (slate-900) | Page canvas             |
| `foreground`         | `#0F172A` (slate-900) | `#F1F5F9` (slate-100) | Primary text            |
| `card`               | `#FFFFFF`             | `#1E293B` (slate-800) | Surface panels          |
| `primary`            | `#2563EB` (blue-600)  | `#3B82F6` (blue-500)  | CTAs, active states     |
| `primary-foreground` | `#FFFFFF`             | `#FFFFFF`             | Text on primary bg      |
| `secondary`          | `#F1F5F9` (slate-100) | `#1E293B` (slate-800) | Secondary surfaces      |
| `muted`              | `#F8FAFC` (slate-50)  | `#0F172A`             | Subtle backgrounds      |
| `muted-foreground`   | `#64748B` (slate-500) | `#94A3B8` (slate-400) | Supporting copy, labels |
| `border`             | `#E2E8F0` (slate-200) | `#334155` (slate-700) | All borders             |
| `ring`               | `#2563EB` (blue-600)  | `#3B82F6` (blue-500)  | Focus rings             |
| `destructive`        | `#DC2626` (red-600)   | `#EF4444` (red-500)   | Delete/error            |
| `success`            | `#16A34A` (green-600) | `#22C55E` (green-500) | Confirm/active          |
| `warning`            | `#D97706` (amber-600) | `#F59E0B` (amber-500) | Review/caution          |

---

## Typography

| Token            | Font              | Weight        | Usage                      |
| ---------------- | ----------------- | ------------- | -------------------------- |
| `--font-body`    | Plus Jakarta Sans | 400, 500, 600 | All UI text                |
| `--font-display` | Plus Jakarta Sans | 700, 800      | Headings, hero             |
| `--font-mono`    | JetBrains Mono    | 400, 500      | Labels, version tags, code |

### Scale

```
Hero:       text-4xl / font-extrabold / tracking-tight / leading-tight
Page title: text-2xl / font-bold / tracking-tight
Section:    text-lg  / font-semibold
Card title: text-sm  / font-semibold
Body:       text-sm  / font-normal / leading-6
Caption:    text-xs  / text-muted-foreground
Code label: font-mono text-xs
```

### Rules

- Headings always use `tracking-tight` (−0.025em to −0.04em).
- Body copy: `text-sm leading-6` — never smaller than 13px rendered.
- Mono is for technical labels, version strings, code blocks, and API keys only.
- No decorative large display fonts. If a heading is big, it earns the size through content importance.

---

## Core Utilities

Defined in `app/globals.css`:

### `.page-bg`

Flat slate-50 canvas. In dark mode, slate-900. No textures, no grid.

```css
.page-bg {
  background-color: hsl(var(--background));
  min-height: 100vh;
}
```

### `.surface-card`

Default panel: white background, hairline border, medium radius.

```css
.surface-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
}
```

### `.micro-label`

Uppercase technical label — for table headers, section markers, metadata.

```css
.micro-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: hsl(var(--muted-foreground));
}
```

### `.focus-ring`

Blue focus ring, 3px offset.

```css
.focus-ring {
  outline: none;
  ring: 2px solid hsl(var(--ring));
  ring-offset: 2px;
}
```

---

## Components

### Cards

Clean white surface with a single hairline border.

```tsx
<div className="surface-card p-5">
  <p className="text-sm font-semibold text-foreground mb-1">Card Title</p>
  <p className="text-sm text-muted-foreground">Supporting detail here.</p>
</div>
```

**Rules:**

- No blurs, no translucency, no `backdrop-filter` on cards.
- Nested items inside cards use `bg-secondary` and `border border-border rounded-md`.
- Never use colored card backgrounds for data cards — color belongs in badges and status, not containers.

### Metric Cards

For dashboard numbers:

```tsx
<div className="surface-card p-4">
  <p className="text-xs text-muted-foreground mb-1">Total Screened</p>
  <p className="text-3xl font-bold tracking-tight">2,841</p>
  <Badge variant="success" className="mt-2">
    +12.4% this week
  </Badge>
</div>
```

### Buttons

One clear hierarchy. Primary is always blue.

| Variant       | When to use                 |
| ------------- | --------------------------- |
| `primary`     | Main CTA — one per section  |
| `outline`     | Secondary action            |
| `ghost`       | Tertiary, table row actions |
| `destructive` | Permanent delete only       |

```tsx
// Primary
<Button>Add Candidate</Button>

// Outline
<Button variant="outline"><Upload className="w-4 h-4 mr-2" />Import CSV</Button>

// Ghost (table row)
<Button variant="ghost" size="sm">Review</Button>

// Destructive
<Button variant="destructive" size="sm"><Trash className="w-4 h-4 mr-2" />Delete</Button>
```

Buttons use `rounded-md` (7px), not pills. Pills are for badges only.

### Inputs

Light background, visible border, strong blue focus ring. No inner shadows.

```tsx
<div className="space-y-1.5">
  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
    Email
  </Label>
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input id="email" placeholder="name@company.com" className="pl-9" />
  </div>
</div>
```

Input height: **36px** (`h-9`). Use `rounded-md` always.

### Badges / Status Pills

Badges are the only pill-shaped element in the system. They encode status, never cosmetic decoration.

| Variant       | Color | When                           |
| ------------- | ----- | ------------------------------ |
| `default`     | Blue  | Informational / active         |
| `success`     | Green | Shortlisted / live / confirmed |
| `warning`     | Amber | In review / pending            |
| `destructive` | Red   | Rejected / error               |
| `secondary`   | Slate | Draft / inactive               |

```tsx
<Badge variant="success">
  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
  Shortlisted
</Badge>
```

### Tables

Standard data table with sticky header. Column headers use `.micro-label`.

```tsx
<div className="surface-card overflow-hidden">
  <Table>
    <TableHeader className="bg-secondary">
      <TableRow>
        <TableHead className="micro-label">Candidate</TableHead>
        <TableHead className="micro-label">Role</TableHead>
        <TableHead className="micro-label">Score</TableHead>
        <TableHead className="micro-label">Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>{/* rows */}</TableBody>
  </Table>
</div>
```

### Navigation

Top nav: **52px tall**, white background, hairline bottom border, no shadow.

```tsx
<nav className="h-13 border-b border-border bg-card flex items-center px-6 gap-8 sticky top-0 z-50">
  <span className="text-sm font-bold tracking-tight">
    hire<span className="text-primary">IQ</span>
  </span>
  {/* links */}
  <Button size="sm" className="ml-auto">
    Upgrade plan
  </Button>
</nav>
```

### Sidebar

Left sidebar: **240px wide**, `bg-card border-r border-border`.

- Group labels: `.micro-label` with 8px vertical padding
- Items: `text-sm text-muted-foreground`, hover `bg-secondary`
- Active item: `bg-primary/10 text-primary font-medium`

### Modals / Dialogs

```tsx
<DialogContent className="sm:max-w-md">
  <DialogHeader>
    <DialogTitle className="text-base font-semibold tracking-tight">
      Delete candidate?
    </DialogTitle>
    <DialogDescription>
      This will permanently remove the candidate and all screening data.
    </DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <Button variant="outline">Cancel</Button>
    <Button variant="destructive">Delete</Button>
  </DialogFooter>
</DialogContent>
```

---

## Layout

### Page shell

```tsx
<div className="page-bg">
  <Navbar />
  <div className="flex">
    <Sidebar />
    <main className="flex-1 min-w-0 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">{/* content */}</div>
    </main>
  </div>
</div>
```

### Dashboard grid

4-column metric card row, then full-width table or split (chart + table):

```tsx
// Metric row
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

// Split layout
<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
```

### Max widths

- Sidebar: `w-60` (240px)
- Content area: `max-w-6xl`
- Modals: `max-w-md` (448px)
- Prose sections: `max-w-2xl`

---

## Interaction

```
Hover (buttons/items):  bg-secondary or brightness-95
Active:                 scale(0.98)
Focus:                  ring-2 ring-ring ring-offset-2
Disabled:               opacity-50 pointer-events-none
Page transitions:       opacity fade, 150ms ease
Skeleton loading:       animate-pulse bg-secondary rounded
```

Animations are functional, not decorative. A skeleton loader on data is appropriate. A rotating orb is not.

---

## Charts

Use **Recharts** with the following palette:

| Series    | Color     | Tailwind  |
| --------- | --------- | --------- |
| Primary   | `#2563EB` | blue-600  |
| Secondary | `#64748B` | slate-500 |
| Success   | `#16A34A` | green-600 |
| Warning   | `#D97706` | amber-600 |
| Danger    | `#DC2626` | red-600   |

Chart containers use `surface-card p-5` with a `text-sm font-semibold` title above the chart component. No decorative grid textures inside chart areas.

---

## Accessibility

- All interactive elements have visible focus rings (`ring-2 ring-ring ring-offset-2`).
- Color is never the only differentiator — badges have both color and a dot or icon.
- Minimum body text: 13px rendered (never smaller).
- Contrast ratio: ≥ 4.5:1 for all text on card backgrounds.
- Table rows have sufficient padding (py-2.5) for touch targets.
- Inputs have associated `<Label>` elements with matching `htmlFor`/`id`.

---

## What to avoid

| ❌ Old pattern                     | ✅ New pattern                             |
| ---------------------------------- | ------------------------------------------ |
| Dark ink + amber war-room theme    | White canvas, blue primary                 |
| Blueprint grid texture backgrounds | Flat `bg-slate-50` or `bg-white`           |
| Glassy translucent panels          | Opaque cards with hairline borders         |
| Fraunces display font              | Plus Jakarta Sans bold                     |
| Pill-shaped buttons                | `rounded-md` buttons (pills = badges only) |
| Decorative color orbs/glows        | No decorative backgrounds                  |
| `backdrop-blur` everywhere         | No blur on cards or panels                 |
| Amber as a primary action color    | Blue-600 is the only primary action        |
| Heavy shadows                      | No box-shadow except focus rings           |
