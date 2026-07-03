import { describe, it, expect } from "vitest";
import { buildTailwindV3 } from "../../lib/exporters/tailwind-v3";
import { mockPalette } from "../fixtures/palette";

describe("buildTailwindV3 / structure", () => {
  it("generates a JS module with module.exports", () => {
    const out = buildTailwindV3(mockPalette, false);
    expect(out).toContain("module.exports = {");
    expect(out).toContain("theme:");
    expect(out).toContain("extend:");
    expect(out).toContain("colors:");
    expect(out).toMatch(/\};$/m);
  });

  it("has separate accent and gray objects", () => {
    const out = buildTailwindV3(mockPalette, false);
    expect(out).toMatch(/accent:\s*\{/);
    expect(out).toMatch(/gray:\s*\{/);
  });

  it("alpha scale and p3 scale live inside the accent object, not their own", () => {
    const out = buildTailwindV3(mockPalette, false);
    const accentBlock = out.slice(out.indexOf("accent:"), out.indexOf("gray:"));

    expect(accentBlock).toContain("a1:");
    expect(accentBlock).toContain("'p3-1':");
  });

  it("exports contrast, surface, and background at the root colors level", () => {
    const out = buildTailwindV3(mockPalette, false);
    expect(out).toContain("'accent-contrast':");
    expect(out).toContain("'accent-surface':");
    expect(out).toContain("background:");
  });
});

describe("buildTailwindV3 / semantic", () => {
  it("non-semantic: numeric keys in accent (1...12)", () => {
    const out = buildTailwindV3(mockPalette, false);
    expect(out).toContain("1:");
    expect(out).toContain("12:");
    expect(out).not.toContain("bg:");
  });

  it("semantic: semantic name keys in accent", () => {
    const out = buildTailwindV3(mockPalette, true);
    expect(out).toContain("bg:");
    expect(out).not.toMatch(/^\s+1:/m);
  });

  it("semantic: alpha scale uses semantic label prefixed with 'a'", () => {
    const out = buildTailwindV3(mockPalette, true);
    expect(out).toContain("abg:");
  });

  it("non-semantic: alpha scale uses numeric index (a1, a2...)", () => {
    const out = buildTailwindV3(mockPalette, false);
    expect(out).toContain("a1:");
    expect(out).toContain("a12:");
  });
});

describe("buildTailwindV3 / opacity mode", () => {
  it("opacity=false + rgb: formats color directly as rgb()", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", false);
    expect(out).toMatch(/rgb\(/);
    expect(out).not.toContain("<alpha-value>");
    expect(out).not.toContain("var(--");
  });

  it("opacity=true + rgb: emits var() pattern with <alpha-value> in single quotes", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    expect(out).toMatch(/'rgb\(var\(--accent-\d+\) \/ <alpha-value>\)'/);
  });

  it("opacity=true + hsl: same pattern with hsl()", () => {
    const out = buildTailwindV3(mockPalette, false, "hsl", true);
    expect(out).toMatch(/'hsl\(var\(--accent-\d+\) \/ <alpha-value>\)'/);
  });

  it("opacity=true + semantic=false: var name uses numeric index (--accent-1)", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    expect(out).toContain("var(--accent-1)");
    expect(out).not.toContain("var(--color-accent-bg)");
  });

  it("opacity=true + semantic=true: var name uses semantic label (--color-accent-bg)", () => {
    const out = buildTailwindV3(mockPalette, true, "rgb", true);
    expect(out).toContain("var(--color-accent-bg)");
    expect(out).not.toContain("var(--accent-1)");
  });

  it("alpha scale does NOT use <alpha-value> even when opacity=true because they are already transparent", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    const alphaLines = out.split("\n").filter((l) => l.includes("a1:"));
    expect(alphaLines.length).toBeGreaterThan(0);
    alphaLines.forEach((line) => {
      expect(line).not.toContain("<alpha-value>");
    });
  });

  it("opacity=true: appends CSS companion block as a comment", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    expect(out).toContain("* @layer base {");
    expect(out).toContain("CSS variables required for opacity support");
  });

  it("opacity=true: companion vars use raw channels without wrapper", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    expect(out).toMatch(/--accent-\d+: [\d.]+ [\d.]+ [\d.]+( \/ [\d.]+)?;/);
  });

  it("opacity=true + semantic: companion uses semantic var names", () => {
    const out = buildTailwindV3(mockPalette, true, "rgb", true);
    expect(out).toContain("--color-accent-bg:");
    expect(out).not.toContain("--accent-1:");
  });

  it("opacity=true + oklch: emits oklch(var(...) / <alpha-value>)", () => {
    const out = buildTailwindV3(mockPalette, false, "oklch", true);
    expect(out).toMatch(/'oklch\(var\(--/);
    expect(out).toContain("<alpha-value>");
  });

  it("opacity=false: no companion block appended", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", false);
    expect(out).not.toContain("@layer base");
    expect(out).not.toContain("CSS variables required");
  });
});

describe("buildTailwindV3 / color spaces", () => {
  it("hex: values formatted as #rrggbb in single quotes", () => {
    const out = buildTailwindV3(mockPalette, false, "hex");
    expect(out).toMatch(/'#[0-9a-fA-F]{6}'/);
  });

  it("oklch: values with oklch() in single quotes", () => {
    const out = buildTailwindV3(mockPalette, false, "oklch");
    expect(out).toMatch(/'oklch\(/);
  });
});

describe("buildTailwindV3 / snapshots", () => {
  it("non-semantic hex", () => {
    expect(buildTailwindV3(mockPalette, false, "hex")).toMatchSnapshot();
  });

  it("semantic hex", () => {
    expect(buildTailwindV3(mockPalette, true, "hex")).toMatchSnapshot();
  });

  it("non-semantic rgb raw", () => {
    expect(buildTailwindV3(mockPalette, false, "rgb", true)).toMatchSnapshot();
  });

  it("semantic rgb raw", () => {
    expect(buildTailwindV3(mockPalette, true, "rgb", true)).toMatchSnapshot();
  });
});
