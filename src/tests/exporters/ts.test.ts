import { describe, it, expect } from "vitest";
import { buildTs } from "../../lib/exporters/ts";
import { mockPalette } from "../fixtures/palette";

describe("buildTs", () => {
  it("exports the mode correctly at the top of the file", () => {
    const outLight = buildTs(mockPalette, false, "hex", false, "light");
    expect(outLight).toContain("export const mode = 'light';");

    const outDark = buildTs(mockPalette, false, "hex", false, "dark");
    expect(outDark).toContain("export const mode = 'dark';");
  });

  it("non-semantic: exports 'accent' with numeric keys", () => {
    const out = buildTs(mockPalette, false);
    expect(out).toContain("export const accent = {");
    expect(out).toContain("'1':");
    expect(out).not.toContain("'bg':");
  });

  it("semantic: exports 'accent' with semantic keys", () => {
    const out = buildTs(mockPalette, true);
    expect(out).toContain("export const accent = {");
    expect(out).toContain("'bg':");
    expect(out).not.toContain("'1':");
  });

  it("always exports all scales (alpha, P3, gray) regardless of the semantic flag", () => {
    for (const semantic of [false, true]) {
      const out = buildTs(mockPalette, semantic);
      expect(out).toContain("export const accentAlpha = {");
      expect(out).toContain("export const accentP3 = {");
      expect(out).toContain("export const gray = {");
      expect(out).toContain("export const grayAlpha = {");
    }
  });

  it("exports individual variables as constant strings (contrast, surface, background)", () => {
    const out = buildTs(mockPalette, false);
    expect(out).toContain("export const accentContrast =");
    expect(out).toContain("export const accentSurface =");
    expect(out).toContain("export const background =");
  });

  it("ensures the background value includes a hash when exported as hex", () => {
    const out = buildTs(mockPalette, false, "hex");
    expect(out).toMatch(/export const background = '#[0-9a-fA-F]{3,6}';/);
  });

  it("wraps hex values in single quotes", () => {
    const out = buildTs(mockPalette, false, "hex");
    expect(out).toMatch(/: '#[0-9a-fA-F]{6}'/);
  });

  it("colorSpace rgb: values are formatted as rgb() inside single quotes", () => {
    const out = buildTs(mockPalette, false, "rgb");
    expect(out).toMatch(/: 'rgb\(/);
  });

  it("raw=true with rgb: removes the rgb() wrapper from the value", () => {
    const withRaw = buildTs(mockPalette, false, "rgb", true);
    const withoutRaw = buildTs(mockPalette, false, "rgb", false);

    expect(withRaw).not.toEqual(withoutRaw);
    expect(withRaw).not.toMatch(/rgb\(/);
  });

  it("semantic with rgb: applies semantic keys and rgb formatting correctly together", () => {
    const out = buildTs(mockPalette, true, "rgb");
    expect(out).toContain("'bg': 'rgb(");
  });

  it("matches snapshot for non-semantic hex", () => {
    expect(buildTs(mockPalette, false, "hex")).toMatchSnapshot();
  });

  it("matches snapshot for semantic hex", () => {
    expect(buildTs(mockPalette, true, "hex")).toMatchSnapshot();
  });
});
