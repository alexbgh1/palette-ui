/**
 * Implementation by WorkOS / Radix UI devs.
 * See: https://github.com/radix-ui/website/blob/52578d3c5956b26c117ad8328ee40ecc6170b648/components/generateRadixColors.tsx
 *
 * Mathematical engine to generate perceptual color scales (1-12)
 * maintaining contrast and harmony based on a single hex value.
 */

import * as RadixColors from "@radix-ui/colors";
import Color from "colorjs.io";
import BezierEasing from "bezier-easing";

import { APPEARANCES, BLACK, COLOR_SPACES_VALUES, NUMERIC_LABELS_INDEXES, WHITE } from "../constants";
import type { PaletteInputs, GeneratedPalette } from "../interfaces";

import { safeCoords } from "../lib/colorConvert";

const grayScaleNames = ["gray", "mauve", "slate", "sage", "olive", "sand"];

const scaleNames = [
  ...grayScaleNames,
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "brown",
  "orange",
  "sky",
  "mint",
  "lime",
  "yellow",
  "amber",
];

const arrayOf12 = NUMERIC_LABELS_INDEXES;

type ColorMap = Record<string, Color[]>;

function loadScales(suffix: string): ColorMap {
  return Object.fromEntries(
    scaleNames.map((name) => [
      name,
      Object.values(RadixColors[`${name}${suffix}` as keyof typeof RadixColors] as Record<string, string>).map((str) =>
        new Color(str).to("oklch"),
      ),
    ]),
  );
}

const lightColors = loadScales("P3");
const darkColors = loadScales("DarkP3");
const lightGrayColors: ColorMap = Object.fromEntries(
  grayScaleNames.map((name) => [
    name,
    Object.values(RadixColors[`${name}P3` as keyof typeof RadixColors] as Record<string, string>).map((str) =>
      new Color(str).to("oklch"),
    ),
  ]),
);
const darkGrayColors: ColorMap = Object.fromEntries(
  grayScaleNames.map((name) => [
    name,
    Object.values(RadixColors[`${name}DarkP3` as keyof typeof RadixColors] as Record<string, string>).map((str) =>
      new Color(str).to("oklch"),
    ),
  ]),
);

const darkModeEasing = [1, 0, 1, 0] as [number, number, number, number];
const lightModeEasing = [0, 2, 0, 2] as [number, number, number, number];

/**
 * Core Palette Generator
 * Orchestrates the creation of a full 12-step color system by:
 * 1. Deriving base gray and accent scales via OKLCH perceptual interpolation.
 * 2. Anchoring step 9 to the exact user-defined accent color (used for solid backgrounds).
 * 3. Calculating accessible contrast colors for text (step 12 or absolute white/black).
 * 4. Generating translucent (alpha) variants mathematically matched to the background.
 * 5. Formatting outputs for both standard hex (sRGB) and wide-gamut displays (P3).
 */
export function generateRadixColors({ appearance, accent, gray, background }: PaletteInputs): GeneratedPalette {
  const allScales = appearance === APPEARANCES.light ? lightColors : darkColors;
  const grayScales = appearance === APPEARANCES.light ? lightGrayColors : darkGrayColors;
  const backgroundColor = new Color(background).to("oklch");

  const grayBaseColor = new Color(gray).to("oklch");
  const grayScaleColors = getScaleFromColor(grayBaseColor, grayScales, backgroundColor);

  const accentBaseColor = new Color(accent).to("oklch");
  let accentScaleColors = getScaleFromColor(accentBaseColor, allScales, backgroundColor);

  const backgroundHex = backgroundColor.to("srgb").toString({ format: COLOR_SPACES_VALUES.hex });

  const accentBaseHex = accentBaseColor.to("srgb").toString({ format: COLOR_SPACES_VALUES.hex });
  if (accentBaseHex === BLACK || accentBaseHex === WHITE) {
    accentScaleColors = grayScaleColors.map((c) => c.clone());
  }

  const [accent9Color, accentContrastColor] = getStep9Colors(accentScaleColors, accentBaseColor);

  accentScaleColors[8] = accent9Color;
  accentScaleColors[9] = getButtonHoverColor(accent9Color, [accentScaleColors]);

  accentScaleColors[10].coords[1] = Math.min(
    Math.max(accentScaleColors[8].coords[1]!, accentScaleColors[7].coords[1]!),
    accentScaleColors[10].coords[1]!,
  );
  accentScaleColors[11].coords[1] = Math.min(
    Math.max(accentScaleColors[8].coords[1]!, accentScaleColors[7].coords[1]!),
    accentScaleColors[11].coords[1]!,
  );

  const accentScaleHex = accentScaleColors.map((color) =>
    formatHex(color.to("srgb").toString({ format: COLOR_SPACES_VALUES.hex })),
  );
  const accentScaleWideGamut = accentScaleColors.map(toOklchString);
  const accentScaleAlphaHex = accentScaleHex.map((color) => getAlphaColorSrgb(color, backgroundHex));
  const accentScaleAlphaWideGamutString = accentScaleHex.map((color) => getAlphaColorP3(color, backgroundHex));

  const accentContrastColorHex = formatHex(
    accentContrastColor.to("srgb").toString({ format: COLOR_SPACES_VALUES.hex }),
  );

  const grayScaleHex = grayScaleColors.map((color) =>
    formatHex(color.to("srgb").toString({ format: COLOR_SPACES_VALUES.hex })),
  );
  const grayScaleWideGamut = grayScaleColors.map(toOklchString);
  const grayScaleAlphaHex = grayScaleHex.map((color) => getAlphaColorSrgb(color, backgroundHex));
  const grayScaleAlphaWideGamutString = grayScaleHex.map((color) => getAlphaColorP3(color, backgroundHex));

  const accentSurfaceHex =
    appearance === APPEARANCES.light
      ? getAlphaColorSrgb(accentScaleHex[1], backgroundHex, 0.8)
      : getAlphaColorSrgb(accentScaleHex[1], backgroundHex, 0.5);

  const accentSurfaceWideGamutString =
    appearance === APPEARANCES.light
      ? getAlphaColorP3(accentScaleWideGamut[1], backgroundHex, 0.8)
      : getAlphaColorP3(accentScaleWideGamut[1], backgroundHex, 0.5);

  return {
    accentScale: accentScaleHex,
    accentScaleAlpha: accentScaleAlphaHex,
    accentScaleWideGamut,
    accentScaleAlphaWideGamut: accentScaleAlphaWideGamutString,
    accentContrast: accentContrastColorHex,

    grayScale: grayScaleHex,
    grayScaleAlpha: grayScaleAlphaHex,
    grayScaleWideGamut,
    grayScaleAlphaWideGamut: grayScaleAlphaWideGamutString,

    graySurface: appearance === APPEARANCES.light ? "#ffffffcc" : "rgba(0, 0, 0, 0.05)",
    graySurfaceWideGamut:
      appearance === APPEARANCES.light ? "color(display-p3 1 1 1 / 80%)" : "color(display-p3 0 0 0 / 5%)",

    accentSurface: accentSurfaceHex,
    accentSurfaceWideGamut: accentSurfaceWideGamutString,

    background: backgroundHex,
  };
}

interface ColorEntry {
  scale: string;
  color: Color;
  distance: number;
}

function getScaleFromColor(source: Color, scales: ColorMap, backgroundColor: Color): Color[] {
  const allColors: ColorEntry[] = [];

  Object.entries(scales).forEach(([name, scale]) => {
    for (const color of scale) {
      allColors.push({ scale: name, color, distance: source.deltaEOK(color) });
    }
  });

  allColors.sort((a, b) => a.distance - b.distance);

  const closestColors = allColors.filter(
    (color, i, arr) => i === arr.findIndex((value) => value.scale === color.scale),
  );

  const allAreGrays = closestColors.every((color) => grayScaleNames.includes(color.scale));
  if (!allAreGrays && grayScaleNames.includes(closestColors[0].scale)) {
    while (grayScaleNames.includes(closestColors[1].scale)) {
      closestColors.splice(1, 1);
    }
  }

  const colorA = closestColors[0];
  const colorB = closestColors[1];

  /**
   * Color Interpolation via Triangle Geometry
   * fForm a triangle in the OKLCH color space using deltaEOK distances:
   * a = distance from target color to the second closest scale
   * b = distance from target color to the closest scale
   * c = distance between the two reference scales themselves
   * Using the Law of Cosines, find the internal angles to project
   * the target color onto the axis connecting scaleA and scaleB.
   */
  const a = colorB.distance;
  const b = colorA.distance;
  const c = colorA.color.deltaEOK(colorB.color);

  const cosA = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
  const radA = Math.acos(cosA);
  const sinA = Math.sin(radA);

  const cosB = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c);
  const radB = Math.acos(cosB);
  const sinB = Math.sin(radB);

  /**
   * The ratio of the tangents determines the exact weight for interpolation.
   * It provides a 0-1 multiplier representing how much of scaleB
   * to mix into scaleA to accurately recreate the target color's trajectory.
   */
  const tanC1 = cosA / sinA;
  const tanC2 = cosB / sinB;
  const ratio = Math.max(0, tanC1 / tanC2) * 0.5;

  const scaleA = scales[colorA.scale];
  const scaleB = scales[colorB.scale];
  const scale = arrayOf12.map((i) => new Color(Color.mix(scaleA[i], scaleB[i], ratio)).to("oklch"));

  const baseColor = scale.slice().sort((a, b) => source.deltaEOK(a) - source.deltaEOK(b))[0];

  const bc = safeCoords(baseColor, "oklch");
  const sc = safeCoords(source, "oklch");
  const ratioC = bc[1] === 0 ? 1 : sc[1] / bc[1];

  scale.forEach((color) => {
    const cc = safeCoords(color, "oklch");
    color.coords[1] = Math.min(sc[1] * 1.5, cc[1] * ratioC);
    color.coords[2] = sc[2];
  });

  /**
   * Lightness Curve Compensation
   * Adjusts the lightness progression to ensure proper contrast against the background.
   * If the base color is light (> 0.5 lightness), assume a light theme context.
   */
  if (safeCoords(scale[0], "oklch")[0] > 0.5) {
    /**
     * Apply a Bezier curve (lightModeEasing) to stretch the lightness scale.
     * This prevents the lightest steps (1-3) from washing out against a white background.
     */
    const lightnessScale = scale.map((c) => safeCoords(c, "oklch")[0]);
    const backgroundL = Math.max(0, Math.min(1, safeCoords(backgroundColor, "oklch")[0]));
    const newLightnessScale = transposeProgressionStart(backgroundL, [1, ...lightnessScale], lightModeEasing);
    newLightnessScale.shift();
    newLightnessScale.forEach((lightness, i) => {
      scale[i].coords[0] = lightness;
    });
    return scale;
  }

  /**
   * Dark Mode Easing
   * For dark themes, dynamically adjust the curve based on the custom background's depth.
   */
  const ease = [...darkModeEasing];
  const referenceBackgroundColorL = safeCoords(scale[0], "oklch")[0];
  const backgroundColorL = Math.max(0, Math.min(1, safeCoords(backgroundColor, "oklch")[0]));
  const ratioL = backgroundColorL / referenceBackgroundColorL;

  /**
   * If the custom background is lighter than the reference (ratioL > 1),
   * compress the easing curve to maintain visual separation between the darkest UI steps (1-4).
   */
  if (ratioL > 1) {
    const maxRatio = 1.5;
    for (let i = 0; i < ease.length; i++) {
      const metaRatio = (ratioL - 1) * (maxRatio / (maxRatio - 1));
      ease[i] = ratioL > maxRatio ? 0 : Math.max(0, ease[i] * (1 - metaRatio));
    }
  }

  const lightnessScale = scale.map((c) => safeCoords(c, "oklch")[0]);
  const backgroundL = safeCoords(backgroundColor, "oklch")[0];
  const newLightnessScale = transposeProgressionStart(backgroundL, lightnessScale, ease);
  newLightnessScale.forEach((lightness, i) => {
    scale[i].coords[0] = lightness;
  });

  return scale;
}

/**
 * Anchors step 9 to the user's accent color.
 * If the accent is perceptually close to the background (< 25 deltaEOK),
 * falls back to the interpolated step 8 to avoid visual collision.
 */
function getStep9Colors(scale: Color[], accentBaseColor: Color): [Color, Color] {
  const referenceBackgroundColor = scale[0];
  const distance = accentBaseColor.deltaEOK(referenceBackgroundColor) * 100;

  if (distance < 25) {
    return [scale[8], getTextColor(scale[8])];
  }

  return [accentBaseColor, getTextColor(accentBaseColor)];
}

/**
 * Hover State Generator (Step 10)
 * Dynamically shifts lightness (L) and chroma (C) to create a natural interaction state.
 * Lighter colors are darkened, darker colors are lightened.
 * The result is then snapped to the closest hue in the reference scales for harmony.
 */
function getButtonHoverColor(source: Color, scales: Color[][]): Color {
  const [L, C, H] = safeCoords(source, "oklch");
  const newL = L > 0.4 ? L - 0.03 / (L + 0.1) : L + 0.03 / (L + 0.1);
  const newC = L > 0.4 && !isNaN(H) ? C * 0.93 + 0 : C;
  const buttonHoverColor = new Color("oklch", [newL, newC, H]);

  let closestColor = buttonHoverColor;
  let minDistance = Infinity;

  scales.forEach((scale) => {
    for (const color of scale) {
      const distance = buttonHoverColor.deltaEOK(color);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
  });

  buttonHoverColor.coords[1] = safeCoords(closestColor, "oklch")[1];
  buttonHoverColor.coords[2] = safeCoords(closestColor, "oklch")[2];
  return buttonHoverColor;
}

/**
 * Accessible Text Contrast
 * Uses APCA (Accessible Perceptual Contrast Algorithm) to evaluate contrast.
 * Checks if pure white text provides sufficient contrast (>= 40 Lc) against the solid background (Step 9).
 * If it fails, generates a deeply darkened version of the background hue for legible text.
 */
function getTextColor(background: Color): Color {
  const white = new Color("oklch", [1, 0, 0]);

  if (Math.abs(white.contrastAPCA(background)) < 40) {
    const [, C, H] = safeCoords(background, "oklch");
    return new Color("oklch", [0.25, Math.max(0.08 * C, 0.04), H]);
  }

  return white;
}

/**
 * Reverse Alpha Blending
 * Goal: Find an RGBA foreground that, when laid over the background, perfectly matches the target RGB.
 * First, identify which channel (R, G, or B) requires the greatest shift from the background.
 * This determines the absolute minimum alpha needed to reach the target without
 * pushing the required foreground color out of 8-bit bounds.
 */
function getAlphaColor(
  targetRgb: number[],
  backgroundRgb: number[],
  rgbPrecision: number,
  alphaPrecision: number,
  targetAlpha?: number,
): number[] {
  const [tr, tg, tb] = targetRgb.map((c) => Math.round(c * rgbPrecision));
  const [br, bg, bb] = backgroundRgb.map((c) => Math.round(c * rgbPrecision));

  if (
    tr === undefined ||
    tg === undefined ||
    tb === undefined ||
    br === undefined ||
    bg === undefined ||
    bb === undefined
  ) {
    throw Error("Color is undefined");
  }

  let desiredRgb = 0;
  if (tr > br) desiredRgb = rgbPrecision;
  else if (tg > bg) desiredRgb = rgbPrecision;
  else if (tb > bb) desiredRgb = rgbPrecision;

  const alphaR = (tr - br) / (desiredRgb - br);
  const alphaG = (tg - bg) / (desiredRgb - bg);
  const alphaB = (tb - bb) / (desiredRgb - bb);

  const isPureGray = [alphaR, alphaG, alphaB].every((alpha) => alpha === alphaR);

  if (!targetAlpha && isPureGray) {
    const V = desiredRgb / rgbPrecision;
    return [V, V, V, alphaR];
  }

  /**
   * Reverse the standard alpha blending equation: Foreground = (Target - Background * (1 - Alpha)) / Alpha
   */
  const clampRgb = (n: number) => (isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n)));
  const clampA = (n: number) => (isNaN(n) ? 0 : Math.min(alphaPrecision, Math.max(0, n)));
  const maxAlpha = targetAlpha ?? Math.max(alphaR, alphaG, alphaB);

  const A = clampA(Math.ceil(maxAlpha * alphaPrecision)) / alphaPrecision;
  let R = clampRgb(((br * (1 - A) - tr) / A) * -1);
  let G = clampRgb(((bg * (1 - A) - tg) / A) * -1);
  let B = clampRgb(((bb * (1 - A) - tb) / A) * -1);

  R = Math.ceil(R);
  G = Math.ceil(G);
  B = Math.ceil(B);

  const blendedR = blendAlpha(R, A, br);
  const blendedG = blendAlpha(G, A, bg);
  const blendedB = blendAlpha(B, A, bb);

  /**
   * Sub-pixel Fine-tuning
   * Due to rounding errors in standard sRGB blending, the resulting foreground
   * might fall short by a fraction. re blend and nudge the channels by 1 unit
   * if they don't perfectly match the original target.
   */
  if (desiredRgb === 0) {
    if (tr <= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg <= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb <= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }

  if (desiredRgb === rgbPrecision) {
    if (tr >= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg >= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb >= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }

  R = R / rgbPrecision;
  G = G / rgbPrecision;
  B = B / rgbPrecision;

  return [R, G, B, A];
}

/**
 * Standard alpha blending: foreground * alpha + background * (1 - alpha).
 * Optionally rounds to the nearest integer (for 8-bit channel math).
 */
function blendAlpha(foreground: number, alpha: number, background: number, round = true): number {
  if (round) {
    return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha);
  }
  return background * (1 - alpha) + foreground * alpha;
}

/**
 * sRGB alpha variant: derives a translucent foreground that renders as the target over the given background.
 */
function getAlphaColorSrgb(targetColor: string, backgroundColor: string, targetAlpha?: number): string {
  const [r, g, b, a] = getAlphaColor(
    safeCoords(new Color(targetColor), "srgb"),
    safeCoords(new Color(backgroundColor), "srgb"),
    255,
    255,
    targetAlpha,
  );
  return formatHex(new Color("srgb", [r, g, b], a).toString({ format: COLOR_SPACES_VALUES.hex }));
}

/**
 * P3 wide-gamut alpha variant: same as sRGB alpha but computed in the Display P3 color space
 * to preserve saturation on wide-gamut displays.
 */
function getAlphaColorP3(targetColor: string, backgroundColor: string, targetAlpha?: number): string {
  const [r, g, b, a] = getAlphaColor(
    safeCoords(new Color(targetColor), "p3"),
    safeCoords(new Color(backgroundColor), "p3"),
    255,
    1000,
    targetAlpha,
  );
  return new Color("p3", [r, g, b], a).toString({ precision: 4 }).replace("color(p3 ", "color(display-p3 ");
}

export { getAlphaColorSrgb, getAlphaColorP3 };

/**
 * Expands shorthand hex (#abc → #aabbcc, #abcd → #aabbccdd) for consistent output.
 */
function formatHex(str: string): string {
  if (!str.startsWith("#")) return str;
  if (str.length === 4) {
    const h = str.charAt(0),
      r = str.charAt(1),
      g = str.charAt(2),
      b = str.charAt(3);
    return h + r + r + g + g + b + b;
  }
  if (str.length === 5) {
    const h = str.charAt(0),
      r = str.charAt(1),
      g = str.charAt(2),
      b = str.charAt(3),
      a = str.charAt(4);
    return h + r + r + g + g + b + b + a + a;
  }
  return str;
}

/**
 * Transposes an array of values toward a target using a Bezier easing curve.
 * Used to shift lightness scales so step 1 matches the user's background color
 * while preserving the perceptual spacing of the original progression.
 */
function transposeProgressionStart(to: number, arr: number[], curve: number[]): number[] {
  return arr.map((n, i, arr) => {
    const lastIndex = arr.length - 1;
    const diff = arr[0] - to;
    const fn = BezierEasing(...(curve as [number, number, number, number]));
    return n - diff * fn(1 - i / lastIndex);
  });
}

/**
 * Formats a Color.js color as an oklch() CSS string with lightness as a percentage.
 */
export function toOklchString(color: Color): string {
  const L = +(safeCoords(color, "oklch")[0] * 100).toFixed(1);
  return color
    .to("oklch")
    .toString({ precision: 4 })
    .replace(/(\S+)(.+)/, `oklch(${L}%$2`);
}
