import { describe, it, expect } from "vitest";
import { buildScss } from "../../lib/exporters/scss";
import { mockPalette } from "../fixtures/palette";

describe("buildScss", () => {
  it("non-semantic: uses $accent-1 ... $accent-12", () => {
    const out = buildScss(mockPalette, false);
    expect(out).toContain("$accent-1:");
    expect(out).toContain("$accent-12:");
    expect(out).not.toContain("$app-background");
  });

  it("semantic: uses semantic names ($bg, $bg-subtle, etc.)", () => {
    const out = buildScss(mockPalette, true);
    expect(out).toContain("$bg:");
    expect(out).toContain("$text-contrast:");
    expect(out).not.toContain("$accent-1:");
  });

  it("includes alpha scale with -a prefix", () => {
    const out = buildScss(mockPalette, false);
    expect(out).toContain("$accent-a1:");
    expect(out).toContain("$gray-");
  });

  it("does NOT include wide-gamut (unlike buildCss)", () => {
    const out = buildScss(mockPalette, false);
    expect(out).not.toContain("-p3-");
  });

  it("includes $accent-contrast and $accent-surface", () => {
    const out = buildScss(mockPalette, false);
    expect(out).toContain("$accent-contrast:");
    expect(out).toContain("$accent-surface:");
  });

  it("colorSpace rgb: values wrapped in rgb()", () => {
    const out = buildScss(mockPalette, false, "rgb");
    expect(out).toMatch(/rgb\(/);
  });

  it("raw=true with rgb: strips rgb() wrapper", () => {
    const withRaw = buildScss(mockPalette, false, "rgb", true);
    const withoutRaw = buildScss(mockPalette, false, "rgb", false);
    expect(withRaw).not.toEqual(withoutRaw);
    expect(withRaw).not.toMatch(/rgb\(/);
  });

  it("has no :root {} (unlike buildCss)", () => {
    const out = buildScss(mockPalette, false);
    expect(out).not.toContain(":root");
  });

  it("snapshot", () => {
    expect(buildScss(mockPalette, false, "hex")).toMatchSnapshot();
  });

  it("snapshot semantic", () => {
    expect(buildScss(mockPalette, true, "hex")).toMatchSnapshot();
  });
});
