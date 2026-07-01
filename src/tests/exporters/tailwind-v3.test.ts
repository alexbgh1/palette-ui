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

  it("alpha scale lives inside the accent object, not its own", () => {
    const out = buildTailwindV3(mockPalette, false);
    const accentBlock = out.slice(out.indexOf("accent:"), out.indexOf("gray:"));
    expect(accentBlock).toContain("a1:");
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

describe("buildTailwindV3 / raw mode", () => {
  it("raw=false + rgb: formats color directly as rgb()", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", false);
    expect(out).toMatch(/rgb\(/);
    expect(out).not.toContain("<alpha-value>");
    expect(out).not.toContain("var(--");
  });

  it("raw=true + rgb: generates var() with <alpha-value> - unique to v3", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    expect(out).toContain("<alpha-value>");
    expect(out).toMatch(/rgb\(var\(--accent-\d+\) \/ <alpha-value>\)/);
  });

  it("raw=true + hsl: same pattern with hsl()", () => {
    const out = buildTailwindV3(mockPalette, false, "hsl", true);
    expect(out).toContain("<alpha-value>");
    expect(out).toMatch(/hsl\(var\(--accent-\d+\) \/ <alpha-value>\)/);
  });

  it("raw=true + hex: has no effect - raw only applies to rgb/hsl in v3", () => {
    const out = buildTailwindV3(mockPalette, false, "hex", true);
    expect(out).toMatch(/: '#/);
  });

  it("raw=true + rgb + semantic=false: var name uses numeric index (--accent-1)", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    expect(out).toContain("var(--accent-1)");
    expect(out).not.toContain("var(--color-bg)");
  });

  it("raw=true + rgb + semantic=true: var name uses semantic label (--color-bg)", () => {
    const out = buildTailwindV3(mockPalette, true, "rgb", true);
    expect(out).toContain("var(--color-bg)");
    expect(out).not.toContain("var(--accent-1)");
  });

  it("alpha scale does NOT use raw/var() even when raw=true - only main scale", () => {
    const out = buildTailwindV3(mockPalette, false, "rgb", true);
    const alphaLine = out.split("\n").find((l) => l.includes("a1:"));
    expect(alphaLine).toBeDefined();
    expect(alphaLine).not.toContain("<alpha-value>");
    expect(alphaLine).toMatch(/rgb\(/);
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
