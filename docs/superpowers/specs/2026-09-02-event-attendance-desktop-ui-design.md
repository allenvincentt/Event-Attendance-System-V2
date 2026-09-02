# UD Event Attendance System V2 — Admin Desktop App UI/UX Design Spec

- **Date:** 2026-09-02
- **Status:** Approved for implementation planning
- **Scope:** Front-end UI/UX only. No backend, no API, no real persistence. All data is mock/seeded in the front end.
- **App:** `admin-desktop-app/` — Tauri 2 + React 19 + Vite 7 + TypeScript (existing template scaffold).
- **Audience:** University of Davao Events Office administrators.

---

## 1. Goals & non-goals

### Goals

- A polished, modern, borderless desktop application for managing university events and attendance.
- Faithfully realize the intent, hierarchy, and layout of the ten reference screenshots **without reproducing them pixel-for-pixel**.
- One consistent visual system across every window and view.
- Custom window chrome (minimize / maximize-restore / close) with smooth transitions for maximize/restore, minimize/restore, and resize.
- Fully responsive layouts (the main window resizes freely above its minimum), accessible (WCAG 2.2 AA targets), 60 FPS motion.

### Non-goals

- No Rust business logic beyond window configuration and window-management commands already provided by `@tauri-apps/api`.
- No authentication backend — sign-in is mocked.
- No CSV import/export implementation — those controls are stubs that emit toasts.
- No dark theme in v1 (tokens are structured so it can be added later).
- No real-time data, websockets, or polling.

---

## 2. Design language

### 2.1 Source skills

- **`ui-ux-pro-max`** is the primary UI/UX guide. Its `--design-system` search for this product resolves to **Minimalism / Swiss style**: clean, spacious, functional, white space, high contrast, grid-based, sans-serif. Typography recommendation: **Inter**. Motion: standard stagger lists, 200–320 ms, `prefers-reduced-motion` respected. Pre-delivery checklist (no emoji icons, cursor-pointer on clickables, smooth 150–300 ms hover, 4.5:1 contrast, visible focus, reduced motion, responsive at 375/768/1024/1440) applies.
- **`allens-ui-design`** supplies component structure and interaction specs. **The glass theme is explicitly excluded** — every glass/frosted surface is replaced by a solid elevated surface (white card, hairline border, soft shadow). What is kept from that system:
  - General button: hover = brighten + shadow grow + 3 px vertical lift; press = 96 % scale; disabled = 50 % opacity. This is the system-wide interaction baseline.
  - KPI cards: staggered fade + slide-up entrance, count-up numbers, progress-bar fill, hover lift + contextual (not fixed) border glow.
  - Floating-label inputs: label rests vertically centered, animates to the **top-right** corner on focus/fill (deliberate deviation from the usual top-left).
  - StepperModal: horizontal step track + sliding panels on wide screens; vertical accordion on narrow screens; mobile keyboard never obscures fields or the primary action.
  - Modal: fade + scale-up from center; flat scrim (no blur); exit faster than enter; bottom-sheet docking below ~640 px logical width.
  - Responsive table → card: each row becomes a stacked card with `label : value` pairs below a breakpoint; never rely on horizontal scroll.
  - Sidebar: 248 px expanded → 84 px collapsed; labels fade, icons center, corner radius grows when collapsed.
  - Gradient signature: **106° angle, color stops at 37 % and 100 %** for all gradient fills.
  - Shared entrance animation: fade (0→1) + slide-up (44 px) + gentle scale (98.5 %→100 %), plays **once**, threshold ~88 % of viewport.

### 2.2 Brand

- Primary crimson `#B20A07`; hover `#C81410`; pressed `#8E0805`; soft `rgba(178,10,7,0.08)`.
- Secondary gold `#F5CF28`; soft `rgba(245,207,40,0.16)` — sidebar active state, highlight accents on dark surfaces only.
- Logos: `src/assets/brand/UD.png` (full horizontal lockup), `src/assets/brand/UDLogo.png` (mark only). App icon uses the existing `src-tauri/icons/`.

### 2.3 Styling mechanism — **no Tailwind, no CSS framework, no per-component `.css` files**

- Components are styled with **inline `style={{…}}` objects** whose every value comes from a typed **`src/app/theme/tokens.ts`**. No raw hex or magic numbers outside that file.
- **One** global stylesheet, `src/app/theme/GlobalStyle.tsx`, injected once per window root, covering only what inline styles cannot: CSS reset, `@font-face` (Inter variable woff2), `@keyframes`, `:focus-visible` ring, custom scrollbars, `::selection`, and the `@media (prefers-reduced-motion: reduce)` kill-switch. A small set of CSS custom properties mirrors the tokens so the stylesheet and inline styles agree.
- **Framer Motion** (`framer-motion`) handles interaction states (`whileHover`, `whileTap`, `whileInView`), enter/exit (`AnimatePresence`), layout transitions (`layout`), and staggering — this removes most of the need for CSS pseudo-class styling.
- **Recharts** for all dashboard charts.
- **`@tanstack/react-virtual`** for long lists/tables (Student Management ≈ 312 rows; attendee lists).

### 2.4 Tokens (`src/app/theme/tokens.ts`)

- **Color (semantic):**
  - `brand.primary/primaryHover/primaryPressed/primarySoft`, `brand.gold/goldSoft`.
  - `surface.canvas #F4F5F7`, `surface.card #FFFFFF`, `surface.sunken #FAFAFA`, `surface.sidebar` = 106° gradient `#B20A07 → #8E0805`.
  - `text.strong #1A1A1A`, `text.default #3F3F46`, `text.muted #71717A`, `text.onBrand #FFFFFF`, `text.onSidebar rgba(255,255,255,0.92)`, `text.onSidebarMuted rgba(255,255,255,0.72)`.
  - `border.default #E7E7EA`, `border.strong #D4D4D8`, `focus #2563EB` (blue — meets contrast on both white and crimson).
  - Status families, each `{ base, soft }`: `success #15803D`, `warning #B45309`, `danger #B20A07`, `info #1D4ED8`, `neutral #52525B`. Drives `StatusBadge` for event statuses (Draft, Upcoming, Ongoing, Completed, Cancelled) and attendance states (Present, No time-out, Absent).
- **Spacing scale (dashboard-dense):** 4, 8, 12, 16, 20, 24, 32, 40, 48.
- **Radius:** sm 6, md 10, lg 14, xl 20, pill 999.
- **Elevation (solid, non-glass):** `e1` card rest, `e2` card hover / dropdown / popover, `e3` modal / window.
- **Typography (Inter):** 11 (caps label), 12 (caption), 13 (body-sm), 14 (body), 16 (subtitle), 20 / 24 / 32 (headings); KPI number 28 semibold with `font-variant-numeric: tabular-nums`. Base line-height 1.5.
- **Motion:** durations `fast 120`, `base 200`, `slow 320`, `window 260` (ms); easings `standard cubic-bezier(.2,0,0,1)`, `decel cubic-bezier(0,0,0,1)`; a Framer spring preset. Everything gated by a `prefersReducedMotion` flag.
- **Breakpoints (logical px, applied per-window via `useMediaQuery`):** `sm 640`, `md 760`, `lg 1024`, `xl 1280`.

---

## 3. Architecture

### 3.1 Window-root dispatcher (`src/app/main.tsx`)

`main.tsx` inspects `getCurrentWindow().label` (fallback: `?w=` query param) and mounts one root:

| Window label | Root component | Tauri window config |
|---|---|---|
| `signin` | `SignInWindow` | 800 × 500, `resizable: false`, `decorations: false`, centered, `shadow: true`. **Startup window** declared in `tauri.conf.json`. |
| `main` | `AppShellWindow` | **min 1080 × 720**, `resizable: true`, `maximizable: true`, `decorations: false`. Spawned on successful mock login; the sign-in window then closes. |
| `attendees-{deptCode}-{session}` | `EventAttendeesWindow` | 960 × 640, min 720 × 480, `resizable: true`, `decorations: false`. Spawned from `EventDetailsModal`. Reopening the same key re-focuses the existing window instead of creating a duplicate. |

Each root renders inside `WindowFrame` and is wrapped by `GlobalStyle`, `MockDataProvider`, and the reduced-motion context provider.

### 3.2 Tauri window helper (`src/app/lib/window.ts`)

Thin wrapper over `@tauri-apps/api/window` / `@tauri-apps/api/webviewWindow`:

- `minimize()`, `toggleMaximize()`, `close()`, `startDragging()`, `startResizeDragging(direction)`.
- `openMainWindow()`, `openAttendeesWindow(deptCode, session)`, `openSignInWindow()`.
- Subscriptions: `onResized`, `onFocusChanged`, `onScaleChanged`, `onMaximizeChanged` (derived).
- Minimum size is enforced by Tauri config; a JS clamp inside the throttled `onResized` handler is the backstop.

Requires updating `src-tauri/capabilities/default.json` to permit `core:window:*` and multi-window creation for the front end. No Rust code beyond this.

### 3.3 View switching

No router. `AppShellWindow` holds `view: 'dashboard' | 'events' | 'students'` in state. `AnimatePresence` crossfades views (outgoing `opacity→0` at `fast`; incoming `opacity 0→1` + `y 8→0` at `base`). Modals and the create/edit wizard are local component state. The sidebar collapse state also lives in `AppShellWindow` and animates the grid column via Framer `layout`.

### 3.4 Window chrome (`src/app/chrome/`)

- **`WindowFrame.tsx`** — borderless shell for every window: `radius.lg` corners (→ 0 when maximized), `e3` shadow, 1 px inner hairline. Hosts `GlobalStyle`, the title bar, and children. When `resizable`, mounts six invisible 4 px resize strips (edges + corners) that call `startResizeDragging(direction)`. Resize is never the *only* affordance — the maximize button and OS Snap remain (WCAG 2.2 "Dragging Movements").
- **`TitleBar.tsx`** — 40 px (52 px for the main window, which merges the top bar into this row), `data-tauri-drag-region`. Left: app mark + contextual title. Right: `WindowControls`. Double-click toggles maximize. Interactive children opt out of the drag region.
- **`WindowControls.tsx`** — three 46 × 32 hit targets (Windows control-strip metrics), inline SVG glyphs (minimize, maximize/restore, close). Hover fills `surface.sunken`; close hover fills `brand.primary` with a white glyph. `aria-label` on each; `focus-visible` ring; `whileTap` scale 0.94.

### 3.5 Window transition choreography (`src/app/motion/windowAnimations.ts`) — **Approach C (hybrid)**

One hook, `useWindowChoreography()`, mounted in every `WindowFrame`:

- **Minimize** — content `motion.div` animates `scale 1→0.92`, `opacity 1→0`, `y 0→8`, transform-origin bottom-center, `window` duration, `decel` — *then* `minimize()`. On the next `onFocusChanged(true)` following a minimize, content starts at that end state and springs back.
- **Maximize / restore** — call the real `toggleMaximize()` immediately. `onResized` fires → content plays a `scale 0.99→1` + `opacity 0.85→1` settle (`fast`); the shell grid (sidebar column, KPI grid) carries a CSS `transition` + Framer `layout` so regions ease into the new size instead of snapping; corner radius animates lg↔0.
- **User edge-resize** — `onResized` throttled to `requestAnimationFrame`; major layout regions have `layout` transitions so column-count and table↔card breakpoint changes cross-fade rather than jump. `will-change: transform` is set only during an active resize and cleared on settle.
- **Window open (spawn)** — `WindowFrame` mounts hidden; content does `opacity 0→1`, `scale 0.96→1`, `y 12→0` (`slow`); then `window.show()` — no white flash.
- Under `prefers-reduced-motion`, all of the above collapse to the instant final state (real OS `minimize`/`maximize` still fire).

### 3.6 Mock data (`src/data/`)

| File | Contents |
|---|---|
| `types.ts` | `Department`, `Student`, `EventRecord`, `Session` (`'morning' \| 'afternoon' \| 'evening'`), `SessionSchedule`, `AttendeeRecord`, `EventStatus`, `AttendanceStatus`, dashboard aggregate types. |
| `departments.ts` | 12 departments — BED, CAE, CAFAE, CASE, CCE, CCJE, CEE, CHE, CHSE, CTE, PS, TS — each `{ code, name, shortName, logo }` importing the matching `src/assets/departments/<CODE>.png`. |
| `students.ts` | ≈ 312 students from a **seeded deterministic generator**: `{ id: 'YYYY-NNNNNN', name, departmentCode, section }`. Stable across reloads. |
| `events.ts` | 7 events matching the Events screen: Nightly Cultural Show (Draft), General Assembly – First Semester (Upcoming), Intramurals Opening Ceremony (Upcoming), University Foundation Day 2026 (Ongoing), Research Colloquium (Completed), Career and Job Fair (Completed), Community Outreach – Barangay Visit (Cancelled). Each `{ id, name, venue, date, status, sessions: SessionSchedule[], departmentCodes[] }`. |
| `attendance.ts` | Per event × session × department: invited count + attendee rows (`{ studentId, timeIn, timeOut }`), with derived `AttendanceStatus`. Seeded so figures reproduce the screenshots. |
| `selectors.ts` | Dashboard aggregates tuned to the reference numbers: attendance rate 64.5 %, present 1,101 / invited 1,707, did-not-attend 606, per-department enrolled-vs-attended, session split (Evening 41 %), department ranking (CAFAE 71 % · BED 63 % · CTE 61 %), recent-events trend series. |
| `MockDataProvider.tsx` | React context + typed hooks: `useDepartments()`, `useEvents()`, `useEvent(id)`, `useStudents(filter)`, `useAttendees(eventId, session, deptCode)`, `useDashboard(eventId)`. A `LATENCY_MS` constant (default `0`) gates optional artificial delay so `Skeleton` states are exercisable. Mutations (create/edit/delete event, add student) update in-memory context state only. |

---

## 4. Shell

### 4.1 `AppShellWindow.tsx`

CSS grid inside `WindowFrame`: `grid-template-columns: <sidebar width> 1fr`; `grid-template-rows: 52px 1fr`. The 52 px top row spans full width and is the drag region (references show a single merged bar). Content area: `surface.canvas`, `overflow: auto`, padding `24 32`, section gap `24`, card gap `16`.

### 4.2 `shell/Sidebar.tsx`

- Width 248 → 84 px (`layout`, `slow`). Background = 106° `#B20A07 → #8E0805`. Radius 0 expanded; top-right + bottom-right `lg` when collapsed.
- Header: `UD.png` lockup (h 40) expanded; crops to `UDLogo.png` mark centered when collapsed; cross-fade, no layout jump.
- `MENU` caps label (`text.onSidebarMuted`), hidden when collapsed.
- Items: Dashboard, Event, Student Management — 22 px stroke SVG icon + label. Rest: label `rgba(255,255,255,0.72)`, muted-white icon. Hover: `rgba(255,255,255,0.10)` overlay + white label (`fast`). **Active:** `brand.goldSoft` fill, 3 px `brand.gold` left bar, white label + icon at weight 600; the active bar slides between items via a `layout` transition (non-glass stand-in for the lens). Collapsed: icons center, labels fade, active = full gold-soft pill.
- Footer: "Collapse menu" toggle (chevron rotates 180°), "Sign out" (closes main window, opens sign-in), `v0.1 · front-end preview` micro-text (hidden collapsed).
- a11y: `<nav>`, `aria-current="page"`, `aria-label` retained on collapsed icon-only items, `aria-expanded` on the toggle, roving tabindex with arrow keys.

### 4.3 `shell/TopBar.tsx`

Extends `TitleBar` for the main window — one 52 px row, `surface.card`, bottom hairline, drag region.

- Left: refresh `IconButton` — spins 360° (`slow`) on click and re-runs the mock selectors.
- Right cluster (opts out of drag): **date chip** (`Wed, Sep 2, 2026` + calendar glyph, updates each minute) · **clock chip** (`7:16:55 pm`, `tabular-nums`, updates each second) — solid `surface.sunken` pills, `border.default`, pill radius · **user menu**: `Avatar` (initials "AD", `brand.primary`) + name/role stack (hidden < `lg`) + chevron (rotates on open); dropdown (`e2`, radius md) with Profile and Sign out; `whileTap` 0.97.
- Far right: `WindowControls`.
- Compact < `lg`: role text drops; chips shrink to icon + value.

---

## 5. Primitive components (`src/app/components/`)

Each is a focused `.tsx` with an inline-styled root, Framer Motion interactions, and tokenized values.

### 5.1 Controls

- **`Button`** — variants `primary` (crimson 106° / 37–100 % gradient), `secondary` (white + `border.strong`), `ghost`, `danger`; sizes `sm` / `md`. Hover: brighten + `e1→e2` + `y:-3`. Press: `scale .96`. Disabled: `opacity .5`, no pointer. Optional left icon; optional right suffix (shortcut/badge, rendered larger). `focus-visible` ring. Loading → inline spinner, label retained, width locked.
- **`IconButton`** — 32–36 px square, same hover/press/disabled language, **mandatory `aria-label`**, `title` tooltip.
- **`FilterChips`** — segmented pill row. Active = `brand.primary` fill + white; rest = `surface.card` + `border.default`; active indicator slides via `layout`. `role="tablist"` / `tab`, arrow-key navigation.
- **`Tabs`** — underline style. Inactive muted + dim icon; active `text.strong` + 2 px `brand.primary` underline that slides (`layout`). Disabled tab (e.g. an unscheduled session) = 40 % opacity, not focusable.
- **`Toggle`** — session on/off; crimson when on; 44 × 44 hit area; keyboard operable; `fast` transition.
- **`Checkbox`** — "Select all" / row selection; crimson when checked; 44 × 44 hit area around the ~20 px visual.

### 5.2 Surfaces

- **`Card`** — white, `radius.lg`, `border.default`, `e1`. Interactive variant: hover `y:-2` + `e2` + border tints to a contextual color prop. Header / body / footer slots.
- **`KpiCard`** — specialization of interactive Card. Entrance: `opacity 0→1`, `y 44→0`, `scale .985→1` (`slow`), **staggered 0.06 s** across the row (`staggerChildren`), plays once. Number **counts up** from 0 via `useCountUp` (`tabular-nums`, `%` / `,` formatting; reduced-motion → final value immediately). Optional `ProgressBar` fills after the count. Hover: lift + contextual border glow (attendance-rate card → crimson, students-present card → success, etc.).
- **`ProgressBar`** — track `border.default`; fill = brand or status color; width animates (`slow`, `decel`). Used in KPI cards, department ranking, session-split bars.

### 5.3 Overlays

- **`Modal`** — portaled to the window root. Backdrop `rgba(20,20,22,0.45)` fade-in — **flat scrim, no blur**. Panel: `opacity 0→1`, `scale .94→1`, `y 18→0` (`base`, `decel`); exit reverses faster (`fast`). `radius.xl`, `e3`. Focus trap; `Esc` closes; `role="dialog"` + `aria-modal`; focus restored to the trigger on close. Backdrop-click dismissal configurable. Scrollable body with sticky header/footer. Below `sm` logical width, docks as a bottom sheet with a grab handle.
- **`ConfirmDialog`** — thin wrapper over `Modal` for destructive confirmations (delete event): title, body naming the target, `Cancel` / `Delete` (danger). Same motion.
- **`Stepper`** — drives `EventCreateDeleteModal`. **Wide (≥ 720 px logical — the default here):** horizontal numbered track (Event details · Departments · Review) with a 106° gradient progress connector that fills as steps complete; panels slide `x: ±30` + fade (out 130 ms / in 210 ms). **Narrow:** steps collapse to an accordion rail. Bullet states: upcoming (sunken), active (crimson ring + `e2`), done (crimson fill + check). Footer: `Cancel` / `Back` + `Next` / final action. Step counter `2/3`. `Next` disabled until the current step's required fields validate; errors render inline beneath fields, not only as a top summary. Each step is a `<fieldset>` with `<legend>`; the track is a `tablist`; focus moves to the first field (or first error) on step change; closing while dirty prompts to discard.
- **`Toast`** — bottom-right stack, slide + fade in, auto-dismiss 4 s (pause on hover), manual close, `success` / `error` / `info`, `role="status"`.

### 5.4 Data display

- **`DataTable<T>`** — generic. **Desktop:** real `<table>`; sticky header (`surface.sunken`, 11 px caps labels); rows ≥ 44 px; hover row tint `brand.primarySoft`; optional leading checkbox column + bulk-action bar; sortable headers with an arrow indicator; per-row action buttons and/or row-click. Empty → `EmptyState`; loading → `Skeleton` rows. Virtualized past ≈ 80 rows via `@tanstack/react-virtual`. **Below `md`:** each row becomes a stacked `Card` of `column-label : value` pairs, order preserved, `layout` transition across the breakpoint — no horizontal scroll.
- **`StatusBadge`** — pill: `<status>.soft` background + `<status>.base` text + 6 px leading dot.
- **`Avatar`** — initials on `brand.primary` (or a department color); sizes `sm` / `md`.
- **`DepartmentLogo`** — `src/assets/departments/<CODE>.png` in a circular `surface.sunken` frame with `border.default`; `sm` (list rows) / `lg` (wizard cards); `alt` = department name; monogram fallback on image error.
- **`Skeleton`** — shimmer block (`skeleton-shimmer` keyframe); presets for KPI card, table row, chart area, list item.
- **`EmptyState`** — centered icon + title + one-line hint + optional action.

### 5.5 Inputs

- **`FloatingLabelInput`** — label vertically centered at rest; on focus/fill animates to the **top-right** corner and shrinks to 11 px. Border `border.strong` → `brand.primary` on focus, `danger` + message below on error.
- **`SearchField`** — leading magnifier; placeholder shortens at narrow widths; clearable; 200 ms debounce; `type="search"`.
- **`Select`** — custom listbox with native `<select>` a11y semantics (`role`, keyboard type-ahead); chevron rotates on open; panel `e2`; checkmark on the selected option. Used for event picker, Status, "All departments".
- **`TimeStampField`** — hour / minute / AM–PM mini-`Select`s + a computed `8:00 AM – 12:00 PM` summary; disabled ("Not scheduled") when its session toggle is off.
- **`DateField`** — display text (`Wednesday, 2 September 2026`) + popover month calendar; arrow-key date navigation; `Esc` closes.

### 5.6 Shared motion (`src/app/motion/`)

- `transitions.ts` — shared Framer variants, durations, easings.
- `Reveal.tsx` / `useReveal` — the shared entrance animation (fade + slide-up 44 px + scale .985→1, ~980 ms, threshold 88 %, once), reused by KPI rows, chart cards, table sections.
- `useCountUp.ts` — number count-up, reduced-motion aware.
- `windowAnimations.ts` — §3.5.
- All motion reads the shared `prefersReducedMotion` context.

---

## 6. Screens

### 6.1 Sign-in — `src/app/auth/SignInWindow.tsx` (reference image 10)

- Window 800 × 500, non-resizable, borderless, centered, `e3`, `radius.lg`. Chrome = minimize + close `IconButton`s at the right panel's top-right; the left panel and a top strip are `data-tauri-drag-region`.
- Split layout: left ~42 % crimson 106° gradient panel — `UDLogo.png` mark, "THE UNIVERSITY OF DAVAO" / "Event Attendance System" wordmark, faint decorative circles. Right ~58 % white — "Welcome back" (h2), "Sign in to manage events and attendance." subtitle, `FloatingLabelInput` username (person icon) + password (lock icon + eye show/hide), row with "Keep me signed in" `Checkbox` and "Forgot password?" link (crimson), full-width **Log-In** `Button` (primary).
- Mock auth: any non-empty username + password succeeds. Blank/failed submit → card shake (`x:[0,-8,8,-6,6,0]`, `base`) + inline error under the password field, announced via `aria-live`. Success → 250 ms spinner → `openMainWindow()` → close self.
- Entrance: right-panel content fade + slide-up; left mark `scale .9→1`.
- "Forgot password?" → toast only. `<form>` landmark; Enter submits; initial focus on username.

### 6.2 Dashboard — `src/app/views/DashboardView.tsx` (reference images 1–2)

- Header: "Attendance overview" (h1) + "Live figures for the event you select." subtitle; right = event-picker `Select` ("Nightly Cultural Show — Aug 20, 2026").
- **KPI row** — 4 `KpiCard`s, stagger + count-up:
  1. Attendance rate `64.5 %` · "Draft · Evening" · crimson tint.
  2. Students present `1,101` · "of 1,707 invited" · success tint.
  3. Departments `3` · "of 12 in the university" · info tint.
  4. Events this term `7` · "2 upcoming · 2 completed" · neutral tint.
- **Row 2** (2 cards):
  - **Overall turnout** — `DonutChart`, `64%` center label; legend Attended `1,101` / Did not attend `606`; three session-split `ProgressBar`s (Morning / Afternoon / Evening `41%`).
  - **Students by department** — `DepartmentBarChart`, grouped Enrolled vs Attended for BED / CTE / CAFAE; hover tooltip with exact figures.
- **Row 3** (2 cards):
  - **Attendance rate over recent events** — `AttendanceTrendChart` (line + gradient area fill); x = Jul 18 / Jul 24 / Jul 30; y 0–100 %; dots on points.
  - **Department ranking** — `RankingBars`: CAFAE `71%` (324 of 456) · BED `63%` (467 of 742) · CTE `61%` (310 of 509); each row = `DepartmentLogo` + name + `ProgressBar` + % + count; sorted descending; bars fill on reveal.
- Chart palette: crimson = actual/attended, muted gray = enrolled/target, gold reserved for highlights. Charts are never color-only — each series carries a label and tooltip. `ResponsiveContainer` throughout.
- Responsive: KPI 4 → 2 → 1; chart rows 2 → 1. Topbar refresh → brief skeleton flash → re-run selectors.

### 6.3 Events — `src/app/views/EventView.tsx` (reference image 3)

- Header: "Events" (h1) + "7 events scheduled" + **New event** `Button` (primary, + icon, top-right).
- Toolbar: `SearchField` ("Search event, venue…") left; "Status" label + `FilterChips` (All / Ongoing / Upcoming / Completed) right.
- `DataTable` columns: Event name (calendar icon + name + "N departments" subtext) · Venue (pin icon) · Date (`Aug 20, 2026` / weekday) · Start & end time (`6:00 PM – 9:30 PM` + session tags) · Status (`StatusBadge`) · Actions (**View** / **Edit** pill buttons). The Draft row carries a crimson left accent + `brand.primarySoft` background.
- Actions: View → `EventDetailsModal`; Edit → `EventCreateDeleteModal` (edit mode, prefilled); New event → wizard (create mode); row-click → View. Delete → from the edit modal footer → `ConfirmDialog` → toast + the row exits with a list `layout` animation.
- Default sort: date descending; Date & Status sortable. Filtered-empty → `EmptyState`.
- Responsive: table → stacked cards below `md`; action buttons go full-width.

### 6.4 Create / edit / delete event — `src/app/views/EventCreateDeleteModal.tsx` (reference images 4–6)

`Stepper` modal, 3 steps, horizontal track, counter `1/3`, gradient progress connector. Title "Create event" / "Edit event" + "Three quick steps to publish an event".

- **Step 1 — Event details:** `FloatingLabelInput` Name + Venue · `DateField` · `Select` Status (Upcoming / Ongoing / Completed / Draft / Cancelled) · **Time stamps** section — Morning / Afternoon / Evening rows, each `Toggle` + `TimeStampField` Start/End + computed summary or "Not scheduled" · live "N session on" badge. Validation: name + venue + date required; ≥ 1 session on. Inline errors.
- **Step 2 — Departments:** "Choose departments" + "N of 12 selected" + "Select all" `Checkbox`. Responsive grid of department cards (`DepartmentLogo` lg from `src/assets/departments/*.png` + code + full name); selected = crimson ring + check badge; hover-lift.
- **Step 3 — Review:** summary card (name, `StatusBadge`, venue, date) · time-stamps recap · department chips + computed "N students" (Σ selected departments' enrolment) · info note "Attendance sheets are generated per department for every session you switched on" · **Create event** / **Save changes** primary.
- Submit: 250 ms mock → close → toast → new/updated row animates in `EventView`.
- Delete: in edit mode the footer shows a ghost-danger **Delete event** link → nested `ConfirmDialog` → confirms → closes both → toast → row removed.
- Motion: panels slide/fade; connector fills; bullets transition. a11y per §5.3.

### 6.5 Event details — `src/app/views/EventDetailsModal.tsx` (reference image 7)

- `Modal` ~940 px. Header: event name + `StatusBadge`; subtitle `Thursday, August 20, 2026 · Open Quadrangle · 6:00 PM – 9:30 PM`.
- Summary strip: Departments `3` · Students invited `1,707` · Sessions `Evening` · Overall turnout `64.5%`.
- Session `Tabs` (Morning / Afternoon / Evening) — unscheduled sessions disabled. Active session shows `6:00 PM – 9:30 PM · 693 of 1,707 students timed in (40.6%)` + "3 departments".
- Department list: `DepartmentLogo` + full name + code + **View Attendees** `Button` → `openAttendeesWindow(deptCode, session)` (real window).
- Footer: **Edit event** (→ wizard edit) + **Close**.
- Motion: standard modal; tab-content crossfade; rows reveal-stagger. Summary strip wraps / rows stack when narrow.

### 6.6 Attendees window — `src/app/views/EventAttendeesWindow.tsx` (reference image 8)

- Separate `WebviewWindow` `attendees-{deptCode}-{session}`, 960 × 640 (min 720 × 480), own `TitleBar`: department badge + "Attendees — Basic Education Department", subtitle "Nightly Cultural Show · Evening session · Aug 20, 2026", full window controls.
- Toolbar: `SearchField` ("Search student, section…") + `FilterChips` (All / Present / No time-out / Absent).
- `DataTable`: Student name (+ section subtext) · Department (badge) · Time in (green clock + `6:06 PM`, or `–`) · Time out (clock + `9:23 PM` + duration `3h 17m`, or `—`).
- Footer bar: "Showing 24 of 24 · 22 timed in · 4 without time-out" + hint "Non-modal window — keep it open while you browse other departments".
- Multiple attendee windows coexist (one per department/session); reopening the same key re-focuses. Virtualized list; chips recompute counts. Table → cards when narrow.

### 6.7 Student management — `src/app/views/StudentManagementView.tsx` (reference image 9)

- Header: "Student Management" (h1) + "312 students across 12 departments" + right: **Import / export** menu-button (Import CSV / Export CSV — stubs, toast only) + **Add student** `Button` (primary, + icon).
- Toolbar: `SearchField` ("Search name, section, ID…") + filter icon + `Select` "All departments".
- `DataTable` (virtualized, ≈ 312 rows, sticky header): Student name (`Avatar` + name + ID `2022-940567` subtext) · Department (`DepartmentLogo` sm + code + full name) · Section (mono pill `TECHVOC-2A`). Sortable name / department.
- **Add student** → `Modal` form (`FloatingLabelInput` name + ID, `Select` department + section) → validate → toast + row inserts with a `layout` animation.
- Row click → read-only student `Modal` (name, ID, department, section, + mock list of events invited/attended).
- Responsive: table → cards below `md`.

---

## 7. Accessibility & quality bar

- Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI boundaries; verified for crimson-on-white, white-on-crimson, muted text, and status pills.
- Visible `:focus-visible` ring on every interactive control, including inside modals and windows.
- All icon-only controls carry `aria-label`; decorative SVGs are `aria-hidden`.
- Full keyboard operation: Tab / Shift-Tab order follows visual order; `Esc` closes overlays; `Enter` submits forms; arrow keys drive chips, tabs, menus, and table sorting; focus trapped in modals and restored on close.
- Hit targets ≥ 44 × 44 px (window-control glyphs use the 46 × 32 Windows metric with adequate spacing).
- `prefers-reduced-motion`: entrance animations, count-ups, slides, and window content choreography reduce to instant final states; real OS window operations still occur.
- No emoji as icons — inline SVG set only (~30 stroke glyphs).
- Number formatting: thousands separators and `%` everywhere; `tabular-nums` for figures that update.
- Responsive verification at 1080 (min), 1280, 1440, and a maximized window; the Attendees window at 720 (min) and 960; the Sign-in window fixed at 800 × 500.
- Target 60 FPS: animate `transform` / `opacity` only; `will-change` scoped to active interactions; lists virtualized past ~80 rows; charts via `ResponsiveContainer` with debounced resize.

---

## 8. File map (new / changed)

```
admin-desktop-app/
  package.json                      + framer-motion, recharts, @tanstack/react-virtual
  index.html                        title, icon, remove template markup
  tauri.conf.json                   borderless, min size, signin startup window
  src-tauri/capabilities/default.json  core:window:* + multi-window create perms
  src/
    main.tsx                        REPLACED — window-root dispatcher
    App.tsx / App.css               REMOVED (template)
    assets/fonts/Inter-*.woff2      NEW
    app/
      theme/    tokens.ts · GlobalStyle.tsx · useMediaQuery.ts · reduced-motion.tsx
      chrome/   WindowFrame.tsx · TitleBar.tsx · WindowControls.tsx
      motion/   transitions.ts · windowAnimations.ts · useCountUp.ts · Reveal.tsx
      lib/      window.ts
      shell/    Sidebar.tsx · TopBar.tsx
      components/  Button · IconButton · Card · KpiCard · ProgressBar · Modal ·
                   ConfirmDialog · Stepper · Toast · DataTable · StatusBadge ·
                   Avatar · DepartmentLogo · Skeleton · EmptyState · FilterChips ·
                   Tabs · Toggle · Checkbox · FloatingLabelInput · SearchField ·
                   Select · TimeStampField · DateField
      charts/   DonutChart · DepartmentBarChart · AttendanceTrendChart · RankingBars
      auth/     SignInWindow.tsx
      AppShellWindow.tsx
      views/    DashboardView · EventView · EventCreateDeleteModal ·
                EventDetailsModal · EventAttendeesWindow · StudentManagementView
  src/data/    types.ts · departments.ts · students.ts · events.ts ·
               attendance.ts · selectors.ts · MockDataProvider.tsx
```

---

## 9. Open items for the implementation plan

- Exact icon inventory (enumerate the ~30 glyphs and their usages).
- Seeded-generator algorithm details for `students.ts` / `attendance.ts` and the constants that lock figures to the screenshots.
- `tauri.conf.json` / capabilities exact diff and whether a second static window entry (`main`) is pre-declared hidden vs. created dynamically.
- Recharts theming wrapper (shared axis/tooltip/legend components) to keep all four charts consistent.
- Whether the Sign-out flow fully closes and re-spawns windows or reuses a hidden sign-in window.
