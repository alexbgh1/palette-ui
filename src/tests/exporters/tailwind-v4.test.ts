import { describe, it, expect } from "vitest";
import { buildTailwindV4 } from "../../lib/exporters/tailwind-v4";
import { buildTailwindV3 } from "../../lib/exporters/tailwind-v3";
import { mockPalette } from "../fixtures/palette";
import { APPEARANCES } from "../../constants";

describe("buildTailwindV4 / structure", () => {
  it("wraps in /* Light mode */ and @theme {} by default", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toMatch(/^\/\* Light mode \*\//);
    expect(out).toContain("@theme {");
    expect(out).toMatch(/\}$/);
  });

  it("wraps in .dark { @theme {} } when mode is dark", () => {
    const out = buildTailwindV4(mockPalette, false, "hex", APPEARANCES.dark);
    expect(out).toMatch(/^\/\* Dark mode \*\//);
    expect(out).toContain(".dark {");
    expect(out).toContain("@theme {");
    expect(out).toMatch(/\}\n\}$/);
  });

  it("uses --color- prefix on all exported CSS variables", () => {
    const out = buildTailwindV4(mockPalette, false);
    const varLines = out.split("\n").filter((l) => l.includes(":") && !l.includes("@theme"));
    varLines.forEach((l) => expect(l).toMatch(/--color-/));
  });

  it("does NOT generate module.exports - structural difference from v3", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).not.toContain("module.exports");
    expect(out).not.toContain("theme:");
    expect(out).not.toContain("extend:");
  });

  it("has no nested objects - uses flat CSS vars unlike v3", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).not.toMatch(/accent:\s*\{/);
    expect(out).not.toMatch(/gray:\s*\{/);
  });
});

describe("buildTailwindV4 / semantic", () => {
  it("non-semantic: uses numeric indices (--color-accent-1 ... --color-accent-12)", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toContain("--color-accent-1:");
    expect(out).toContain("--color-accent-12:");
    expect(out).not.toContain("--color-accent-bg:");
  });

  it("semantic: uses semantic labels (--color-accent-bg, etc.)", () => {
    const out = buildTailwindV4(mockPalette, true);
    expect(out).toContain("--color-accent-bg:");
    expect(out).not.toContain("--color-accent-1:");
  });

  it("gray always uses --color-gray- regardless of semantic flag", () => {
    const noSemantic = buildTailwindV4(mockPalette, false);
    const semantic = buildTailwindV4(mockPalette, true);
    expect(noSemantic).toContain("--color-gray-");
    expect(semantic).toContain("--color-gray-");
  });

  it("non-semantic: alpha scale uses numeric index (--color-accent-a1)", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toContain("--color-accent-a1:");
    expect(out).toContain("--color-accent-a12:");
  });

  it("semantic: alpha scale uses semantic label (--color-accent-abg)", () => {
    const out = buildTailwindV4(mockPalette, true);
    expect(out).toContain("--color-accent-abg:");
  });
});

describe("buildTailwindV4 / opacity", () => {
  it("never emits <alpha-value> or var() regardless of colorSpace", () => {
    for (const cs of ["hex", "rgb", "hsl", "oklch"] as const) {
      const out = buildTailwindV4(mockPalette, false, cs);
      expect(out).not.toContain("<alpha-value>");
      expect(out).not.toMatch(/var\(--/);
    }
  });
});

describe("buildTailwindV4 / explicit exports and v3 differences", () => {
  it("v4 includes wide-gamut (accent-p3-...) unlike the v3 configuration", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toContain("--color-accent-p3-");
  });

  it("v4 includes accentContrast, accentSurface, and background", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toContain("--color-accent-contrast:");
    expect(out).toContain("--color-accent-surface:");
    expect(out).toContain("--color-background:");
  });

  it("v4 includes gray alpha scale (gray-a1...)", () => {
    const out = buildTailwindV4(mockPalette, false);
    expect(out).toContain("--color-gray-a1:");
  });

  it("both versions produce incompatible structural outputs", () => {
    const v3 = buildTailwindV3(mockPalette, false, "hex");
    const v4 = buildTailwindV4(mockPalette, false, "hex");
    expect(v3).not.toEqual(v4);
    expect(v3).toContain("module.exports");
    expect(v4).toContain("@theme");
  });
});

describe("buildTailwindV4 / color spaces", () => {
  it("hex: outputs direct #rrggbb", () => {
    const out = buildTailwindV4(mockPalette, false, "hex");
    expect(out).toMatch(/--color-accent-1: #[0-9a-fA-F]{6}/);
  });

  it("oklch: outputs values with oklch() wrapper", () => {
    const out = buildTailwindV4(mockPalette, false, "oklch");
    expect(out).toMatch(/oklch\(/);
  });

  it("hsl: outputs values with hsl() wrapper", () => {
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
    expect(buildTailwindV4(mockPalette, false, "rgb")).toMatchSnapshot();
  });

  it("semantic rgb raw", () => {
    expect(buildTailwindV4(mockPalette, true, "rgb")).toMatchSnapshot();
  });
});
