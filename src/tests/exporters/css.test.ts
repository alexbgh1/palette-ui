import { describe, it, expect } from "vitest";
import { buildCss } from "../../lib/exporters/css";
import { mockPalette } from "../fixtures/palette";
import { APPEARANCES } from "../../constants";

describe("buildCss / structure", () => {
  it("wraps output in :root, .light, .light-theme {} for light mode", () => {
    const out = buildCss(mockPalette, false, "rgb", APPEARANCES.light);
    expect(out).toMatch(/:root, \.light, \.light-theme \{/);
    expect(out).toMatch(/\}$/);
  });

  it("wraps output in .dark, .dark-theme {} for dark mode", () => {
    const out = buildCss(mockPalette, false, "rgb", APPEARANCES.dark);
    expect(out).toMatch(/\.dark, \.dark-theme \{/);
    expect(out).toMatch(/\}$/);
  });

  it("exports contrast, surface, and background variables", () => {
    const out = buildCss(mockPalette, false);
    expect(out).toContain("--accent-contrast:");
    expect(out).toContain("--accent-surface:");
    expect(out).toContain("--background:");
  });

  it("outputs exactly 12 accent and 12 gray variables (non-semantic base scale)", () => {
    const out = buildCss(mockPalette, false);
    // Regex counts exactly --accent-1 to --accent-12 (ignores -a or -p3)
    const accentVars = out.match(/--accent-\d+:/g) ?? [];
    const grayVars = out.match(/--gray-\d+:/g) ?? [];
    expect(accentVars).toHaveLength(12);
    expect(grayVars).toHaveLength(12);
  });
});

describe("buildCss / semantic labels", () => {
  it("non-semantic mode: uses numeric keys (--accent-1 ... --accent-12)", () => {
    const out = buildCss(mockPalette, false);
    expect(out).toContain("--accent-1:");
    expect(out).toContain("--accent-12:");
    expect(out).not.toContain("--accent-bg:");
  });

  it("semantic mode: uses semantic labels appended to the scale prefix (--accent-bg, --gray-bg)", () => {
    const out = buildCss(mockPalette, true);
    expect(out).toContain("--accent-bg:");
    expect(out).toContain("--gray-bg:");
    expect(out).toContain("--accent-text-contrast:");
    expect(out).not.toContain("--accent-1:");
  });

  it("includes alpha scale with 'a' injected into the prefix/label (--accent-a1 or --accent-abg)", () => {
    const nonSemantic = buildCss(mockPalette, false);
    expect(nonSemantic).toContain("--accent-a1:");
    expect(nonSemantic).toContain("--gray-a1:");

    const semantic = buildCss(mockPalette, true);
    expect(semantic).toContain("--accent-abg:");
    expect(semantic).toContain("--gray-abg:");
  });

  it("includes wide-gamut scale with 'p3-' injected into the prefix/label (--accent-p3-1 or --accent-p3-bg)", () => {
    const nonSemantic = buildCss(mockPalette, false);
    expect(nonSemantic).toContain("--accent-p3-1:");

    const semantic = buildCss(mockPalette, true);
    expect(semantic).toContain("--accent-p3-bg:");
  });
});

describe("buildCss / color spaces formatting", () => {
  it("colorSpace hex: values formatted as #rrggbb", () => {
    const out = buildCss(mockPalette, false, "hex");
    const hexLine = out.split("\n").find((l) => l.includes("--accent-1:"));
    expect(hexLine).toMatch(/#[0-9a-fA-F]{3,6}/);
  });

  it("colorSpace rgb: values formatted as rgb(...)", () => {
    const out = buildCss(mockPalette, false, "rgb");
    expect(out).toMatch(/rgb\(/);
  });

  it("colorSpace oklch: values formatted as oklch(...)", () => {
    const out = buildCss(mockPalette, false, "oklch");
    expect(out).toMatch(/oklch\(/);
  });

  it("never includes <alpha-value> markers as css exporter is purely static", () => {
    const out = buildCss(mockPalette, false, "rgb");
    expect(out).not.toContain("<alpha-value>");
  });
});

describe("buildCss / snapshots", () => {
  it("snapshot: matches the exact output format for non-semantic hex", () => {
    expect(buildCss(mockPalette, false, "hex")).toMatchSnapshot();
  });

  it("snapshot: matches the exact output format for semantic rgb dark mode", () => {
    expect(buildCss(mockPalette, true, "rgb", APPEARANCES.dark)).toMatchSnapshot();
  });
});
