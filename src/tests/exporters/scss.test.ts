import { describe, it, expect } from "vitest";
import { buildScss } from "../../lib/exporters/scss";
import { mockPalette } from "../fixtures/palette";
import { APPEARANCES } from "../../constants";

describe("buildScss / structure", () => {
  it("has no :root {} wrapper (unlike buildCss, SCSS uses flat variables)", () => {
    const out = buildScss(mockPalette, false);
    expect(out).not.toContain(":root");
    expect(out).not.toContain("{");
  });

  it("exports contrast, surface, and background variables", () => {
    const out = buildScss(mockPalette, false);
    expect(out).toContain("$accent-contrast:");
    expect(out).toContain("$accent-surface:");
    expect(out).toContain("$background:");
  });
});

describe("buildScss / semantic labels", () => {
  it("non-semantic mode: uses numeric keys ($accent-1 ... $accent-12)", () => {
    const out = buildScss(mockPalette, false);
    expect(out).toContain("$accent-1:");
    expect(out).toContain("$accent-12:");
    expect(out).not.toContain("$accent-bg:");
  });

  it("semantic mode: uses semantic labels appended to the scale prefix ($accent-bg, $gray-bg)", () => {
    const out = buildScss(mockPalette, true);
    expect(out).toContain("$accent-bg:");
    expect(out).toContain("$gray-bg:");
    expect(out).toContain("$accent-text-contrast:");
    expect(out).not.toContain("$accent-1:");
  });

  it("includes alpha scale with 'a' injected into the prefix/label ($accent-a1 or $accent-abg)", () => {
    const nonSemantic = buildScss(mockPalette, false);
    expect(nonSemantic).toContain("$accent-a1:");
    expect(nonSemantic).toContain("$gray-a1:");

    const semantic = buildScss(mockPalette, true);
    expect(semantic).toContain("$accent-abg:");
    expect(semantic).toContain("$gray-abg:");
  });

  it("includes wide-gamut scale with 'p3-' injected into the prefix/label ($accent-p3-1 or $accent-p3-bg)", () => {
    const nonSemantic = buildScss(mockPalette, false);
    expect(nonSemantic).toContain("$accent-p3-1:");

    const semantic = buildScss(mockPalette, true);
    expect(semantic).toContain("$accent-p3-bg:");
  });
});

describe("buildScss / color spaces", () => {
  it("colorSpace rgb: values wrapped in rgb()", () => {
    const out = buildScss(mockPalette, false, "rgb");
    expect(out).toMatch(/rgb\(/);
  });

  it("colorSpace hex: values formatted as #rrggbb", () => {
    const out = buildScss(mockPalette, false, "hex");
    expect(out).toMatch(/: #[0-9a-fA-F]{3,6}/);
  });

  it("never includes channel variables or usage comments as opacity logic was removed", () => {
    const out = buildScss(mockPalette, false, "rgb");
    expect(out).not.toMatch(/-rgb:/);
    expect(out).not.toContain("Usage: rgb(var(");
  });
});

describe("buildScss / snapshots", () => {
  it("snapshot for non-semantic hex", () => {
    expect(buildScss(mockPalette, false, "hex")).toMatchSnapshot();
  });

  it("snapshot for semantic hex in dark mode", () => {
    expect(buildScss(mockPalette, true, "hex", APPEARANCES.dark)).toMatchSnapshot();
  });
});
