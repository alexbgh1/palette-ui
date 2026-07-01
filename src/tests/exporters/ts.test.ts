import { describe, it, expect } from "vitest";
import { buildTs } from "../../lib/exporters/ts";
import { mockPalette } from "../fixtures/palette";

describe("buildTs", () => {
  it("non-semantic: export const accent = { '1': '...', ... }", () => {
    const out = buildTs(mockPalette, false);
    expect(out).toContain("export const accent = {");
    expect(out).not.toContain("export const colors = {");
  });

  it("semantic: export const colors = { 'bg': '...', ... }", () => {
    const out = buildTs(mockPalette, true);
    expect(out).toContain("export const colors = {");
    expect(out).not.toContain("export const accent = {");
  });

  it("always exports accentAlpha and gray regardless of semantic", () => {
    for (const semantic of [false, true]) {
      const out = buildTs(mockPalette, semantic);
      expect(out).toContain("export const accentAlpha = {");
      expect(out).toContain("export const gray = {");
    }
  });

  it("exports accentContrast and accentSurface as const strings", () => {
    const out = buildTs(mockPalette, false);
    expect(out).toContain("export const accentContrast =");
    expect(out).toContain("export const accentSurface =");
  });

  it("values are wrapped in single quotes", () => {
    const out = buildTs(mockPalette, false, "hex");
    expect(out).toMatch(/: '#[0-9a-fA-F]{6}'/);
  });

  it("colorSpace rgb: values with rgb() inside single quotes", () => {
    const out = buildTs(mockPalette, false, "rgb");
    expect(out).toMatch(/: 'rgb\(/);
  });

  it("raw=true with rgb: strips rgb() wrapper", () => {
    const withRaw = buildTs(mockPalette, false, "rgb", true);
    const withoutRaw = buildTs(mockPalette, false, "rgb", false);
    expect(withRaw).not.toEqual(withoutRaw);
    expect(withRaw).not.toMatch(/rgb\(/);
  });

  it("snapshot non-semantic hex", () => {
    expect(buildTs(mockPalette, false, "hex")).toMatchSnapshot();
  });

  it("snapshot semantic hex", () => {
    expect(buildTs(mockPalette, true, "hex")).toMatchSnapshot();
  });
});
