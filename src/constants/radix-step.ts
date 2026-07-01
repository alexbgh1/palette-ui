export const COLOR_STEP_COUNT = 12;

export const STEP_GROUPS = [
  {
    label: "Backgrounds",
    steps: [
      [1, "App background"],
      [2, "Subtle background"],
    ] as const,
  },
  {
    label: "Interactive components",
    steps: [
      [3, "UI element background"],
      [4, "Hovered UI element background"],
      [5, "Active / Selected UI element background"],
    ] as const,
  },
  {
    label: "Borders and separators",
    steps: [
      [6, "Subtle borders and separators"],
      [7, "UI element border and focus rings"],
      [8, "Hovered UI element border"],
    ] as const,
  },
  {
    label: "Solid Colors",
    steps: [
      [9, "Solid backgrounds"],
      [10, "Hovered solid backgrounds"],
    ] as const,
  },
  {
    label: "Accessible text",
    steps: [
      [11, "Low-contrast text"],
      [12, "High-contrast text"],
    ] as const,
  },
] as const;

export const SEMANTIC_NAMES: readonly string[] = [
  "bg",
  "bg-subtle",
  "bg-interactive",
  "bg-hover",
  "bg-active",
  "border-subtle",
  "border",
  "border-hover",
  "solid",
  "solid-hover",
  "text",
  "text-contrast",
];

// e.g. ["1", "2", "3", ..., "12"]
export const NUMERIC_LABELS: readonly string[] = Array.from({ length: COLOR_STEP_COUNT }, (_, i) => `${i + 1}`);
export const NUMERIC_LABELS_INDEXES: readonly number[] = Array.from({ length: COLOR_STEP_COUNT }, (_, i) => i);
