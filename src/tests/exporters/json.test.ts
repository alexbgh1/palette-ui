import { describe, it, expect } from "vitest";
import { buildJson } from "../../lib/exporters/json";
import { mockPalette } from "../fixtures/palette";

describe("buildJson", () => {
  it("parses as valid JSON", () => {
    expect(() => JSON.parse(buildJson(mockPalette, "hex", false))).not.toThrow();
  });

  it("has the expected keys", () => {
    const parsed = JSON.parse(buildJson(mockPalette, "hex", false));
    expect(parsed).toHaveProperty("accent");
    expect(parsed).toHaveProperty("accentAlpha");
    expect(parsed).toHaveProperty("accentP3");
    expect(parsed).toHaveProperty("gray");
    expect(parsed).toHaveProperty("grayAlpha");
    expect(parsed).toHaveProperty("accentContrast");
    expect(parsed).toHaveProperty("accentSurface");
    expect(parsed).toHaveProperty("background");
  });

  it("accent and gray are arrays of 12", () => {
    const parsed = JSON.parse(buildJson(mockPalette, "hex", false));
    expect(parsed.accent).toHaveLength(12);
    expect(parsed.gray).toHaveLength(12);
    expect(parsed.accentAlpha).toHaveLength(12);
  });

  it("background includes # (via withHash)", () => {
    const parsed = JSON.parse(buildJson(mockPalette, "hex", false));
    expect(parsed.background).toMatch(/^#/);
  });

  it("is pretty-printed with 2-space indent", () => {
    const out = buildJson(mockPalette, "hex", false);
    expect(out).toContain("  ");
    expect(out.split("\n").length).toBeGreaterThan(5);
  });

  it("respects colorSpace and raw parameters", () => {
    const parsedRgb = JSON.parse(buildJson(mockPalette, "rgb", false));
    expect(parsedRgb.accent[0]).toMatch(/^rgb\(/);

    const parsedRaw = JSON.parse(buildJson(mockPalette, "oklch", true));
    expect(parsedRaw.accent[0]).not.toMatch(/^oklch\(/);
  });

  it("snapshot", () => {
    expect(buildJson(mockPalette, "hex", false)).toMatchSnapshot();
  });
});
