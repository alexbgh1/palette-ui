---
name: tailwind-radix-system
description: "Implement and review UI components using a custom Tailwind v4  semantic color scale based on the Radix Colors 12-step philosophy. Use this skill whenever the user is writing component markup with bg-*/text-*/border-* Tailwind classes, building buttons/cards/modals/inputs, choosing colors for a design system, doing a code review of UI/CSS, or asking about focus rings, hover/active states, alpha transparency, glassmorphism, accessibility of icon buttons, or contrast. Also trigger when the user pastes Tailwind class strings for feedback, mentions 'semantic tokens', 'accent/gray scale', or references this project's @theme color variables. Flag any hardcoded hex/rgb colors, default Tailwind palette colors (e.g. bg-blue-500), or raw numeric steps (e.g. bg-accent-3) used directly in component code instead of the semantic token equivalents."
---

# Custom Semantic Radix Scale (Tailwind v4)

This project uses a custom, wide-gamut (OKLCH) color system in Tailwind v4, strictly mapped to the Radix Colors 12-step philosophy.

While the underlying CSS uses numeric steps (1–12), **the UI code MUST use the Semantic Tokens**. This ensures UI consistency and semantic meaning.

## Contents

1. [The 12-Step Scale Architecture](#1-the-12-step-scale-architecture)
2. [Numeric vs. Semantic Token Mapping](#2-numeric-vs-semantic-token-mapping)
3. [Alpha Channels](#3-alpha-channels-a--alpha-preferences)
4. [UI/UX Rules & Interaction Patterns](#4-uiux-rules--interaction-patterns)
5. [Accessibility & Markup Baseline](#5-accessibility--markup-baseline)
6. [Anti-patterns (Flag in Code Reviews)](#6-anti-patterns-flag-in-code-reviews)
7. [Component Examples](#7-component-examples)

---

## 1. The 12-Step Scale Architecture

Every color scale is divided into 5 functional groups. Do not mix use cases across groups.

| Group                  | Step | Use Case                                |
| ---------------------- | ---- | --------------------------------------- |
| Backgrounds            | 1    | App background                          |
| Backgrounds            | 2    | Subtle background                       |
| Interactive Components | 3    | UI element background (normal state)    |
| Interactive Components | 4    | Hovered UI element background           |
| Interactive Components | 5    | Active / Selected UI element background |
| Borders and Separators | 6    | Subtle borders and separators           |
| Borders and Separators | 7    | UI element border and focus rings       |
| Borders and Separators | 8    | Hovered UI element border               |
| Solid Colors           | 9    | Solid backgrounds (highest chroma)      |
| Solid Colors           | 10   | Hovered solid backgrounds               |
| Accessible Text        | 11   | Low-contrast text                       |
| Accessible Text        | 12   | High-contrast text                      |

In addition to the 12-step scale, `background` (`--color-background`) is the root page background — slightly lighter/darker (based on theme) than Step 1. Use it on `<body>` or the outermost app wrapper, never inside components.

## 2. Numeric vs. Semantic Token Mapping

Always use the **Semantic Token** or its **Alpha Variant**. Never use the numeric utility (e.g., `bg-accent-1`) in component markup unless explicitly required for a non-standard override.

| Radix Step | Numeric Token | Semantic Token (`accent` / `gray`) | Alpha Semantic Token |
| ---------- | ------------- | ---------------------------------- | -------------------- |
| Step 1     | `*-1`         | `bg`                               | `abg`                |
| Step 2     | `*-2`         | `bg-subtle`                        | `abg-subtle`         |
| Step 3     | `*-3`         | `bg-interactive`                   | `abg-interactive`    |
| Step 4     | `*-4`         | `bg-hover`                         | `abg-hover`          |
| Step 5     | `*-5`         | `bg-active`                        | `abg-active`         |
| Step 6     | `*-6`         | `border-subtle`                    | `aborder-subtle`     |
| Step 7     | `*-7`         | `border`                           | `aborder`            |
| Step 8     | `*-8`         | `border-hover`                     | `aborder-hover`      |
| Step 9     | `*-9`         | `solid`                            | `asolid`             |
| Step 10    | `*-10`        | `solid-hover`                      | `asolid-hover`       |
| Step 11    | `*-11`        | `text`                             | `atext`              |
| Step 12    | `*-12`        | `text-contrast`                    | `atext-contrast`     |

_Note: Replace `*` with the palette name (e.g., `bg-accent-bg`, `border-gray-aborder`)._

---

## 3. Alpha Channels (`a` / `alpha`) Preferences

The scale includes wide-gamut Alpha variants (`-a1` to `-a12` mapped to `-abg`, `-aborder`, etc.). Alpha blending works differently in P3/OKLCH than sRGB, ensuring full saturation.

**When to use Alpha tokens (MANDATORY):**

1. **Focus Rings**: Always use `*-aborder-hover` (Step 8A) for focus rings so the underlying app background bleeds through naturally.
   - `focus-visible:ring-accent-aborder-hover`
2. **Glassmorphism / Blurs**: When using `backdrop-blur`, the background MUST be an alpha token.
   - `bg-gray-abg-subtle backdrop-blur-md`
3. **Overlays & Modals**: Modal backdrops must use dark alphas to obscure content.
   - `bg-gray-asolid text-white` (If using a dark overlay in both themes).
4. **Borders on Colored Backgrounds**: If a card has an `accent` background, use a `gray` alpha border so the accent color tints the border automatically.
   - `border-gray-aborder-subtle`

**When to use Solid (Opaque) tokens:**

1. **App Base**: The root `<body>` or main `<main>` wrappers.
2. **Primary Actions**: Solid buttons (Step 9) usually need opaque backgrounds to guarantee contrast.
3. **Overlapping Text**: Use opaque backgrounds when content scrolls behind a sticky header without a blur filter, preventing text collision.

---

## 4. UI/UX Rules & Interaction Patterns

### Contrast Guarantees

- `text-*-text` (Step 11) and `text-*-text-contrast` (Step 12) are guaranteed to pass WCAG contrast on top of `bg-*-bg-subtle` (Step 2) or `bg-*-bg` (Step 1).
- `*-solid` (Step 9) is usually for buttons or sliders, checkboxes, etc. in active state, not text. It must be paired with `text-white` (depending on theme setup).

### State Interactions

- **Buttons**: `bg-accent-solid hover:bg-accent-solid-hover text-white`
- **Secondary**: `bg-gray-bg-interactive hover:bg-gray-bg-hover text-gray-text-contrast`
- **Ghost**: `bg-transparent hover:bg-accent-abg-interactive text-accent-text` (Note the use of Alpha for the hover state).

### Typography

- Headings and primary values: `text-gray-text-contrast` (Step 12).
- Descriptions, icons, and metadata: `text-gray-text` (Step 11).

#### Text sizes — prefer utilities over arbitrary values

- **Prefer `text-xs` (12px)** for body copy, labels, and descriptions.
- **Avoid `text-[12px]`** — it is a hardcoded arbitrary value
- **If `text-[11px]` , `text-[10px]` or lower values are needed** (e.g. badges, timestamps, monospace meta), consider creating custom text-size utilities (e.g. `text-2xs`, `text-3xs`) in the Tailwind config before building more components that use the hardcoded value. This keeps sizing consistent across the project and avoids scattered arbitrary values.

### Card grids & nesting depth

When arranging multiple cards in a grid or nesting cards inside a parent card:

- **`gray` is the neutral workhorse** — use `gray-bg` / `gray-bg-subtle` for most containers and structural panels. Gray provides a neutral surface that works for the majority of UI chrome.
- **`accent` implies importance** — reserve `accent-bg-subtle` / `accent-bg` for highlighted areas, active selections, callouts, or feature-highlight cards. Using accent too broadly dilutes its signal.
- **Nesting depth rule of thumb**: step up one level (or switch palettes). See §7 for examples:
  - Level 1 (outer card): `bg-gray-bg` (Step 1)
  - Level 2 (inner container): `bg-gray-bg-subtle` (Step 2) or `bg-accent-bg-subtle`
  - Level 3 (innermost): `bg-accent-bg` (Step 1, accent) — Step 3 (`bg-interactive`) also works if you need a "filled" look

> This nesting pattern is not mandatory. You can use the same background (e.g. `--background`) for levels 0 (page) and 1 (card), or vary only the border (`--gray-4` or `--gray-5`) instead of stacking background steps. Choose the approach that matches the visual weight you need.

- **Grid gaps**: use `gap-4` (`16px`) between cards in a grid. Inside a parent card, keep grid children at `rounded-lg` (smaller than the parent's `rounded-xl`) so the nesting relationship is visually clear.
- **Ring-offset must match the immediate container**, not the page background. See §5 Focus states.

---

## 5. Accessibility & Markup Baseline

These rules apply on top of the color system above — flag violations the same way you'd flag a wrong token. The goal is that any interactive element is operable by keyboard, screen reader, and touch, not just visually styled correctly.

### Icon-only buttons

Any button whose only content is an icon (`<Icon />`, an SVG, etc.) **must** expose an accessible name. Prefer `sr-only` over `aria-label` — it's easier to spot in reviews and keeps the label co-located with the visual content:

```tsx
// Preferred
<button className="...">
  <TrashIcon aria-hidden="true" />
  <span className="sr-only">Remove user</span>
</button>

// Also valid (e.g. when the label text would be awkward as a child node)
<button aria-label="Remove user" className="...">
  <TrashIcon aria-hidden="true" />
</button>
```

`sr-only` is a built-in Tailwind utility — no extra CSS needed.

- Never rely on `title` alone — it's not announced by most screen readers and has no keyboard tooltip.
- Decorative icons next to visible text should get `aria-hidden="true"` so the icon name isn't announced redundantly: `<SaveIcon aria-hidden="true" /> Save`.

### Focus states

- Every interactive element (`button`, `a`, `input`, `select`, custom `role="button"` components) needs a visible `focus-visible` style — never `outline-none` without a replacement ring.
- Use the alpha border tokens per §3: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aborder-hover focus-visible:ring-offset-2 focus-visible:ring-offset-gray-bg`.
- Don't use `:focus` alone for mouse-driven components — use `:focus-visible` so the ring doesn't flash on mouse clicks, only on keyboard navigation.

#### Ring-offset follows the container background

The `ring-offset-*` color fills the gap between the element and the ring. It **must** match the element's immediate container background, not the page root:

- Element directly on page: `ring-offset-background`
- Element inside a card: `ring-offset-gray-bg` (or the card's `bg-*`)
- Element inside a nested card: `ring-offset-accent-bg-subtle` (that container's `bg-*`)

There is no automatic inheritance — always verify the offset color matches the current layer. Wrong offsets make the ring gap show the wrong color underneath.

### Hit targets & spacing

- Maintain at least `8px` (`gap-2`) between adjacent interactive elements (icon button groups, toolbar actions) to avoid mis-taps on touch devices.

### Disabled & loading states

- Disabled controls: `disabled:opacity-50 disabled:pointer-events-none` plus the actual `disabled` attribute (or `aria-disabled="true"` if the element must remain focusable to explain why, e.g. a submit button with a tooltip).
- Loading buttons: keep the button's width stable (avoid layout shift when swapping label → spinner), set `aria-busy="true"`, and disable the control while pending so it can't be double-submitted.

### Forms

- Every `<input>`/`<select>`/`<textarea>` needs a programmatically associated `<label htmlFor="...">` — placeholder text is not a label substitute.
- Use `aria-describedby` to associate helper/error text with its field instead of just placing it visually nearby.
- Error states: don't rely on color alone (`border-red-*`) — pair with an icon and/or text message, and set `aria-invalid="true"` on the field.

### Semantic HTML first

- Reach for native elements (`<button>`, `<a>`, `<dialog>`, `<details>`) before recreating their behavior with `<div onClick>`. If a `<div>` must act as a control, it needs `role`, `tabIndex={0}`, and the matching keyboard handlers (`Enter`/`Space`) — this is almost always more work and more bug-prone than just using the native element.
- Use exactly one `<h1>` per page/view; don't skip heading levels for visual sizing — control size with classes, not by picking the "right-looking" heading tag.

---

## 6. Anti-patterns (Flag in Code Reviews)

- **Hardcoded Colors**: Using hardcoded hex/rgb values instead of semantic tokens (e.g., `bg-[#ff0000]`).
- **Opaque Focus Rings**: Using `ring-accent-border-hover` instead of the alpha variant `ring-accent-aborder-hover`.
- **Text on Step 9**: Using `text-accent-text-contrast` inside a `bg-accent-solid` container. (Requires `text-white`).
- **Numeric Fallbacks**: Writing `bg-accent-3` instead of `bg-accent-bg-interactive`. Always enforce the semantic nomenclature.
- **Unlabeled icon buttons**: A `<button>` whose only child is an icon/SVG with no `aria-label` and no `sr-only` text node.
- **Outline removed without replacement**: `outline-none` (or `focus:outline-none`) with no accompanying `focus-visible:ring-*`.
- **`title`-only accessible name**: Relying on the `title` attribute as the sole accessible name for an icon button.
- **Color-only error/state signaling**: Red border with no icon, text, or `aria-invalid` to back it up.

## 7. Component Examples

Provide terse, file-path referenced feedback when reviewing code (e.g. `Button.tsx:14 — bg-accent-3 should be bg-accent-bg-interactive`).

The patterns below are extracted from real components in this project. Inline `style` attributes appear only because the palette generator injects live OKLCH values for preview — in actual component files, use the semantic Tailwind classes.

### Buttons

```tsx
{
  /* Primary / solid */
}
<button className="bg-accent-solid hover:bg-accent-solid-hover text-white px-3 py-1.5 rounded-md text-xs font-medium">
  Deploy
</button>;

{
  /* Ghost / icon-only */
}
<button className="p-1.5 rounded bg-transparent hover:bg-gray-bg-hover border-none text-gray-text">
  <PencilIcon aria-hidden="true" />
  <span className="sr-only">Edit user</span>
</button>;

/* Alternatives */
<button className="bg-gray-bg-interactive hover:bg-gray-bg-hover text-gray-text-contrast px-3 py-1.5 rounded-md text-xs font-medium">
  Cancel
</button>;

<button className="bg-transparent hover:bg-accent-abg-interactive text-accent-text px-3 py-1.5 rounded-md text-xs font-medium">
  Learn more
</button>;
```

### Tabs (underline style)

```tsx
<div className="flex gap-0 border-b border-gray-border-subtle text-xs w-full">
  {/* Inactive */}
  <button className="flex-1 px-2 py-2 border-b-2 border-transparent font-medium text-gray-text bg-transparent">
    Overview
  </button>
  {/* Active */}
  <button className="flex-1 px-2 py-2 border-b-2 border-solid font-medium text-text bg-transparent">Members</button>
</div>
```

### Toggle switch (`role="switch"`)

```tsx
{
  /* On */
}
<button
  type="button"
  role="switch"
  aria-checked={true}
  className="relative w-7 h-4 rounded-full bg-accent-solid cursor-pointer border-none shrink-0"
>
  <span className="sr-only">Developer API</span>
  <span className="absolute top-0.5 left-3.5 w-3 h-3 rounded-full bg-white" />
</button>;

{
  /* Off */
}
<button
  type="button"
  role="switch"
  aria-checked={false}
  className="relative w-7 h-4 rounded-full bg-gray-bg-active cursor-pointer border-none shrink-0"
>
  <span className="sr-only">Beta features</span>
  <span className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white" />
</button>;
```

### Checkbox (`role="checkbox"`)

```tsx
{
  /* Checked */
}
<button
  type="button"
  role="checkbox"
  aria-checked={true}
  className="flex items-center justify-center w-4 h-4 rounded bg-accent-solid border border-accent-solid shrink-0"
>
  <CheckIcon className="w-3 h-3 text-white" aria-hidden="true" />
</button>;

{
  /* Unchecked */
}
<button
  type="button"
  role="checkbox"
  aria-checked={false}
  className="flex items-center justify-center w-4 h-4 rounded bg-transparent border border-gray-border shrink-0"
></button>;
```

### Card / panel

```tsx
<div className="rounded-xl border border-gray-border-subtle bg-gray-bg shadow-sm p-4 space-y-4">
  <h3 className="text-sm font-semibold text-gray-text-contrast">Create project</h3>
  <p className="text-xs text-gray-text">Deploy a new repository.</p>
</div>
```

### Nesting depth examples (gray vs. accent)

Two complete cards showing 3 levels of nesting depth — one using only the gray scale, the other using only the accent scale. Compare how the same step pattern produces different visual weights.

```html
<!-- Gray-only depth (neutral, structural) -->
<div class="rounded-xl border border-gray-border-subtle bg-gray-bg shadow-sm p-4 space-y-3">
  <h2 class="text-sm font-semibold text-gray-text-contrast">Gray-only depth</h2>
  <div class="rounded-lg border border-gray-border-subtle bg-gray-bg-subtle p-3 space-y-2">
    <p class="text-xs text-gray-text-contrast font-medium">Level 2 — gray-bg-subtle</p>
    <div class="rounded border border-gray-border bg-gray-bg-interactive p-2 space-y-1">
      <p class="text-[10px] text-gray-text-contrast">Level 3 — gray-bg-interactive</p>
      <p class="text-[9px] text-gray-text">Step 3 as nested surface</p>
    </div>
  </div>
</div>

<!-- Accent-only depth (highlighted, draws attention) -->
<div class="rounded-xl border border-accent-border-subtle bg-accent-bg shadow-sm p-4 space-y-3">
  <h2 class="text-sm font-semibold text-accent-text-contrast">Accent-only depth</h2>
  <div class="rounded-lg border border-accent-border-subtle bg-accent-bg-subtle p-3 space-y-2">
    <p class="text-xs text-accent-text-contrast font-medium">Level 2 — accent-bg-subtle</p>
    <div class="rounded border border-accent-border bg-accent-bg-interactive p-2 space-y-1">
      <p class="text-[10px] text-accent-text-contrast">Level 3 — accent-bg-interactive</p>
      <p class="text-[9px] text-accent-text">Step 3 as nested surface</p>
    </div>
  </div>
</div>
```

> **Nesting depth rule**: Level 1 = `bg-*-bg`, Level 2 = `bg-*-bg-subtle`, Level 3 = `bg-*-bg-interactive`. Gray is the default neutral — use it for most structural containers. Accent draws attention — reserve it for highlighted areas, otherwise it loses its signal.

### Callout / note

```tsx
<div className="border-l-4 border-accent-border-subtle bg-accent-bg-subtle p-3 rounded-tl-xl text-xs">
  <h4 className="text-xs font-semibold text-accent-text">Note</h4>
  <p className="text-accent-text mt-1">
    Use <code className="font-mono text-accent-text-contrast">--accent-*</code> tokens for primary actions.
  </p>
</div>
```

> **Color collision**: If a callout sits inside a container that already uses `accent-bg-subtle`, bump the callout to `accent-bg` (Step 1) and its border to `accent-border` (Step 7) to keep visual separation. The "standard" callout colors assume a gray/neutral parent.

### User row (list item with icon actions)

```tsx
<div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-bg-hover">
  {/* Avatar */}
  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold bg-accent-bg-hover text-accent-text shrink-0">
    E
  </div>
  <div className="min-w-0 ml-3">
    <p className="text-xs font-medium text-gray-text-contrast truncate">Emily Adams</p>
    <p className="text-[10px] text-gray-text truncate">emily@example.com</p>
  </div>
  {/* Role badge */}
  <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-bg-interactive text-gray-text ml-auto mr-2">
    Admin
  </span>
  {/* Icon actions */}
  <div className="flex gap-0.5">
    <button className="p-1.5 rounded bg-transparent hover:bg-gray-bg-hover border-none text-gray-text">
      <PencilIcon aria-hidden="true" className="w-3 h-3" />
      <span className="sr-only">Edit Emily Adams</span>
    </button>
    <button className="p-1.5 rounded bg-transparent hover:bg-gray-bg-hover border-none text-gray-text">
      <TrashIcon aria-hidden="true" className="w-3 h-3" />
      <span className="sr-only">Remove Emily Adams</span>
    </button>
  </div>
</div>
```

> **Icon color clarification**: Icon buttons use `text-gray-text` (Step 11), not `text-gray-solid` (Step 9). Step 9 is a **background** step (highest chroma solid backgrounds, see §1 table) — using it for text is a semantic mismatch. Always use Step 11 for low-contrast icon/metadata text and Step 12 for high-contrast text.

### Form field

```tsx
<div>
  <label htmlFor="project-name" className="text-xs font-medium mb-1 block text-gray-text">
    Project name
  </label>
  <input
    id="project-name"
    type="text"
    placeholder="my-project"
    className="w-full px-2.5 py-1.5 rounded-md text-xs bg-gray-bg border border-gray-border-subtle text-gray-text-contrast outline-none focus-visible:ring-2 focus-visible:ring-accent-aborder-hover focus-visible:ring-offset-2 focus-visible:ring-offset-gray-bg"
  />
</div>
```

### Search input

```tsx
<label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-border-subtle bg-gray-bg-subtle text-gray-text text-xs cursor-text">
  <SearchIcon aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
  <input
    type="search"
    placeholder="Search users..."
    className="flex-1 bg-transparent border-none outline-none text-xs text-gray-text-contrast min-w-0"
  />
</label>
```

### Badge / pill

```tsx
{
  /* Accent */
}
<span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-accent-bg-hover text-accent-text">
  Fully-featured
</span>;
{
  /* Neutral */
}
<span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-gray-bg-interactive text-gray-text">
  Accessible
</span>;
```

### Blockquote with links

```tsx
{
  /* Accented */
}
<blockquote className="pl-4 border-l-2 border-accent-solid text-sm leading-relaxed text-gray-text-contrast">
  Text with an{" "}
  <a href="..." className="underline decoration-1 underline-offset-2 text-accent-text decoration-accent-border">
    accented link
  </a>
  .
</blockquote>;

{
  /* Muted */
}
<blockquote className="pl-4 border-l-2 border-gray-border-hover text-sm leading-relaxed text-gray-text">
  Text with a{" "}
  <a
    href="..."
    className="underline decoration-1 underline-offset-2 text-gray-text-contrast decoration-gray-border-hover"
  >
    muted link
  </a>
  .
</blockquote>;
```
