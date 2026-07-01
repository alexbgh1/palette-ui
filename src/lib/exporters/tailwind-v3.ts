import { DEFAULT_EXPORT_COLOR_SPACE, COLOR_SPACES_VALUES, DEFAULT_APPEARANCE, APPEARANCES } from "../../constants";

import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels } from "./_shared";
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

  const fmtValue = (v: string, varName: string): string => {
    if (colorSpace !== COLOR_SPACES_VALUES.hex && opacity) {
      return `${colorSpace}(var(--${varName}) / <alpha-value>)`;
    }
    return `'${formatColor(v, colorSpace, false)}'`;
  };

  const varName = (i: number) => (semantic ? `color-${l[i]}` : `accent-${i + 1}`);

  const accentObj = p.accentScale.map((v, i) => `      ${quoteKey(l[i])}: ${fmtValue(v, varName(i))}`).join(",\n");

  const accentAlphaObj = p.accentScaleAlpha
    .map((v, i) => {
      const suffix = semantic ? l[i] : String(i + 1);
      const alphaVarName = semantic ? `color-a${suffix}` : `accent-a${i + 1}`;
      return `      ${quoteKey(`a${suffix}`)}: ${fmtValue(v, alphaVarName)}`;
    })
    .join(",\n");

  const grayObj = p.grayScale
    .map((v, i) => {
      const grayVarName = semantic ? `color-gray-${l[i]}` : `gray-${i + 1}`;
      return `      ${quoteKey(l[i])}: ${fmtValue(v, grayVarName)}`;
    })
    .join(",\n");

  const bgValue = `'${formatColor(withHash(p.background), colorSpace, false)}'`;

  return [
    `// ${mode === APPEARANCES.dark ? "Dark" : "Light"} mode`,
    "// tailwind.config.js",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      colors: {",
    `        accent: {\n${accentObj},\n${accentAlphaObj}\n        },`,
    `        gray: {\n${grayObj}\n        },`,
    `        background: ${bgValue},`,
    "      },",
    "    },",
    "  },",
    "};",
  ].join("\n");
}
