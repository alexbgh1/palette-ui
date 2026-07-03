import { DEFAULT_EXPORT_COLOR_SPACE, DEFAULT_APPEARANCE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels, themeComment, themeSelector } from "./_shared";
import { formatColor } from "../colorConvert";
import { withHash } from "../color";

const quoteKey = (k: string): string => (/[^a-zA-Z0-9_$]/.test(k) ? `'${k}'` : k);

export function buildTailwindV3(
  p: GeneratedPalette,
  semantic: boolean,
  colorSpace: ColorSpace = DEFAULT_EXPORT_COLOR_SPACE,
  opacity = false,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const l = labels(semantic);

  const cssVarName = (suffix: string) => (semantic ? `color-${suffix}` : suffix);
  const accentVarName = (i: number) => cssVarName(`accent-${l[i]}`);
  const accentAlphaVarName = (i: number) => cssVarName(`accent-a${l[i]}`);
  const grayVarName = (i: number) => cssVarName(`gray-${l[i]}`);
  const grayAlphaVarName = (i: number) => cssVarName(`gray-a${l[i]}`);

  const fmtValue = (v: string, varName: string, isAlpha = false): string => {
    // Alphas already have the alpha channel in the color value, so we don't need to apply opacity to them.
    // e.g. rgba(255, 0, 0, 0.5) is already semi-transparent so no "/ <alpha-value>" should be added.
    if (opacity && !isAlpha) return `'${colorSpace}(var(--${varName}) / <alpha-value>)'`;
    return `'${formatColor(v, colorSpace, false)}'`;
  };

  const toEntries = (values: string[], keyFn: (i: number) => string, varFn: (i: number) => string, isAlpha = false) =>
    values.map((v, i) => `      ${quoteKey(keyFn(i))}: ${fmtValue(v, varFn(i), isAlpha)}`).join(",\n");
  const accentP3Key = (i: number) => `p3-${semantic ? l[i] : i + 1}`;

  const accentEntries = toEntries(p.accentScale, (i) => l[i], accentVarName);
  const accentAlphaEntries = toEntries(p.accentScaleAlpha, (i) => `a${l[i]}`, accentAlphaVarName, true);
  const accentP3Entries = p.accentScaleWideGamut.map((v, i) => `      ${quoteKey(accentP3Key(i))}: '${v}'`).join(",\n");
  const grayEntries = toEntries(p.grayScale, (i) => l[i], grayVarName);
  const grayAlphaEntries = toEntries(p.grayScaleAlpha, (i) => `a${l[i]}`, grayAlphaVarName, true);

  const bgValue = `'${formatColor(withHash(p.background), colorSpace, false)}'`;

  const config = [
    themeComment(mode, "js"),
    "// tailwind.config.js",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      colors: {",
    `        accent: {\n${accentEntries},\n${accentAlphaEntries},\n${accentP3Entries}\n        },`,
    `        gray: {\n${grayEntries},\n${grayAlphaEntries}\n        },`,
    `        'accent-contrast': ${fmtValue(p.accentContrast, "accent-contrast")},`,
    `        'accent-surface': ${fmtValue(p.accentSurface, "accent-surface")},`,
    `        background: ${bgValue},`,
    "      },",
    "    },",
    "  },",
    "};",
  ].join("\n");

  if (!opacity) return config;

  const cssVars: string[] = [
    ...p.accentScale.map((v, i) => `    --${accentVarName(i)}: ${formatColor(v, colorSpace, true)};`),
    ...p.accentScaleAlpha.map((v, i) => `    --${accentAlphaVarName(i)}: ${formatColor(v, colorSpace, true)};`),
    ...p.grayScale.map((v, i) => `    --${grayVarName(i)}: ${formatColor(v, colorSpace, true)};`),
    ...p.grayScaleAlpha.map((v, i) => `    --${grayAlphaVarName(i)}: ${formatColor(v, colorSpace, true)};`),
    `    --accent-contrast: ${formatColor(p.accentContrast, colorSpace, true)};`,
    `    --accent-surface: ${formatColor(p.accentSurface, colorSpace, true)};`,
    `    --${cssVarName("background")}: ${formatColor(withHash(p.background), colorSpace, true)};`,
  ];

  const companion = [
    "/*",
    " * CSS variables required for opacity support.",
    " * Add this to your globals.css:",
    " *",
    " * @layer base {",
    ` *   ${themeSelector(mode)} {`,
    ...cssVars.map((line) => ` * ${line}`),
    " *   }",
    " * }",
    " */",
  ].join("\n");

  return `${config}\n\n${companion}`;
}
