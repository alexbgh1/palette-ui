import { describe, it, expect } from "vitest";
import { buildTailwindV4 } from "../../lib/exporters/tailwind-v4";
import { buildTailwindV3 } from "../../lib/exporters/tailwind-v3";
import { mockPalette } from "../fixtures/palette";

describe("buildTailwindV4 / structure", () => {
  it("wraps in /* Light mode */ and @theme {}", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toMatch(/^\/\* Light mode \*\//);
    expect(out).toContain("@theme {");
    expect(out).toMatch(/\}$/);
  });

  it("uses --color- prefix on all variables", () => {
    const out = buildTailwindV4(mockPalette, false);
    const varLines = out.split("\n").filter((l) => l.includes(":"));
    varLines.forEach((l) => expect(l).toMatch(/--color-/));
  });

  it("does NOT generate module.exports - structural difference from v3", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).not.toContain("module.exports");
    expect(out).not.toContain("theme:");
    expect(out).not.toContain("extend:");
  });

  it("has no nested objects - flat CSS vars unlike v3", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).not.toMatch(/accent:\s*\{/);
    expect(out).not.toMatch(/gray:\s*\{/);
  });
});

describe("buildTailwindV4 / semantic", () => {
  it("non-semantic: --color-accent-1 ... --color-accent-12", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toContain("--color-accent-1:");
    expect(out).toContain("--color-accent-12:");
    expect(out).not.toContain("--color-accent-bg:");
  });

  it("semantic: --color-accent-bg, etc.", () => {
    const out = buildTailwindV4(mockPalette, true);
    expect(out).toContain("--color-accent-bg:");
    expect(out).not.toContain("--color-accent-1:");
  });

  it("gray always uses --color-gray- regardless of semantic", () => {
    const noSemantic = buildTailwindV4(mockPalette, false);
    const semantic = buildTailwindV4(mockPalette, true);
    expect(noSemantic).toContain("--color-gray-");
    expect(semantic).toContain("--color-gray-");
  });

  it("non-semantic: alpha scale with numeric index (--color-accent-a1)", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toContain("--color-accent-a1:");
    expect(out).toContain("--color-accent-a12:");
  });

  it("semantic: alpha scale with semantic label (--color-accent-abg)", () => {
    const out = buildTailwindV4(mockPalette, true);
    expect(out).toContain("--color-accent-abg:");
  });
});

describe("buildTailwindV4 / raw mode", () => {
  it("raw=false + rgb: values with rgb()", () => {
    const out = buildTailwindV4(mockPalette, false, "rgb", false);
    expect(out).toMatch(/rgb\(/);
    expect(out).not.toContain("<alpha-value>");
  });

  it("raw=true + rgb: values WITHOUT rgb() wrapper - never generates var() with <alpha-value>", () => {
    const out = buildTailwindV4(mockPalette, false, "rgb", true);
    expect(out).not.toContain("<alpha-value>");
    expect(out).not.toMatch(/var\(--/);
  });

  it("raw=true + rgb produces different output than raw=false", () => {
    const withRaw = buildTailwindV4(mockPalette, false, "rgb", true);
    const withoutRaw = buildTailwindV4(mockPalette, false, "rgb", false);
    expect(withRaw).not.toEqual(withoutRaw);
  });

  it("raw=true + hex: ignored - @theme requires # to recognize colors", () => {
    const out = buildTailwindV4(mockPalette, false, "hex", true);
    expect(out).toMatch(/: #[0-9a-f]/);
  });

  it("raw=true + rgb + semantic=true: no var(), semantic name in the key", () => {
    const out = buildTailwindV4(mockPalette, true, "rgb", true);
    expect(out).toContain("--color-accent-bg:");
    expect(out).not.toContain("<alpha-value>");
    expect(out).not.toMatch(/var\(--/);
  });
});

describe("buildTailwindV4 / differences from v3", () => {
  it("v4 does not include wide-gamut (accentScaleWideGamut) unlike buildCss", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).not.toContain("-p3-");
  });

  it("v4 does not include accentContrast nor accentSurface", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).not.toContain("accent-contrast");
    expect(out).not.toContain("accent-surface");
  });

  it("both versions produce incompatible outputs", () => {
    const v3 = buildTailwindV3(mockPalette, false, "hex");
    const v4 = buildTailwindV4(mockPalette, false, "hex");
    expect(v3).not.toEqual(v4);
    expect(v3).toContain("module.exports");
    expect(v4).toContain("@theme");
  });
});

describe("buildTailwindV4 / color spaces", () => {
  it("hex: direct #rrggbb", () => {
    const out = buildTailwindV4(mockPalette, false, "hex");
    expect(out).toMatch(/--color-accent-1: #[0-9a-fA-F]{6}/);
  });

  it("oklch: values with oklch()", () => {
    const out = buildTailwindV4(mockPalette, false, "oklch");
    expect(out).toMatch(/oklch\(/);
  });

  it("hsl: values with hsl()", () => {
    const out = buildTailwindV4(mockPalette, false, "hsl");
    expect(out).toMatch(/hsl\(/);
  });
});

describe("buildTailwindV4 / snapshots", () => {
  it("non-semantic hex", () => {
    expect(buildTailwindV4(mockPalette, false, "hex")).toMatchSnapshot();
  });

  it("semantic hex", () => {
    expect(buildTailwindV4(mockPalette, true, "hex")).toMatchSnapshot();
  });

  it("non-semantic rgb raw", () => {
    expect(buildTailwindV4(mockPalette, false, "rgb", true)).toMatchSnapshot();
  });

  it("semantic rgb raw", () => {
    expect(buildTailwindV4(mockPalette, true, "rgb", true)).toMatchSnapshot();
  });
});
