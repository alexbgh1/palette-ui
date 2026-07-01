import { describe, it, expect } from "vitest";
import { buildCss } from "../../lib/exporters/css";
import { mockPalette } from "../fixtures/palette";

describe("buildCss", () => {
  it("wraps output in :root {}", () => {
    const out = buildCss(mockPalette, false);
    expect(out).toMatch(/:root \{/);
    expect(out).toMatch(/\}$/);
  });

  it("non-semantic mode: uses --accent-1 ... --accent-12", () => {
    const out = buildCss(mockPalette, false);
    expect(out).toContain("--accent-1:");
    expect(out).toContain("--accent-12:");
    expect(out).not.toContain("--app-background");
  });

  it("semantic mode: uses semantic names", () => {
    const out = buildCss(mockPalette, true);
    expect(out).toContain("--bg:");
    expect(out).not.toContain("--accent-1:");
  });

  it("includes alpha scale with -a prefix", () => {
    const out = buildCss(mockPalette, false);
    expect(out).toContain("--accent-a1:");
    expect(out).toContain("--gray-a1:");
  });

  it("includes wide-gamut scale with -p3 prefix", () => {
    const out = buildCss(mockPalette, false);
    expect(out).toContain("--accent-p3-1:");
  });

  it("includes --accent-contrast and --accent-surface", () => {
    const out = buildCss(mockPalette, false);
    expect(out).toContain("--accent-contrast:");
    expect(out).toContain("--accent-surface:");
  });

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

  it("raw=true: strips the wrapping function", () => {
    const withRaw = buildCss(mockPalette, false, "rgb", true);
    const withoutRaw = buildCss(mockPalette, false, "rgb", false);
    expect(withRaw).not.toEqual(withoutRaw);
  });

  it("outputs exactly 12 accent and 12 gray vars (non-semantic)", () => {
    const out = buildCss(mockPalette, false);
    const accentVars = out.match(/--accent-\d+:/g) ?? [];
    const grayVars = out.match(/--gray-\d+:/g) ?? [];
    expect(accentVars).toHaveLength(12);
    expect(grayVars).toHaveLength(12);
  });

  it("snapshot: stable output against accidental changes", () => {
    const out = buildCss(mockPalette, false, "hex");
    expect(out).toMatchSnapshot();
  });
});
