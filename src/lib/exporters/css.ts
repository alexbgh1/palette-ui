import { DEFAULT_EXPORT_COLOR_SPACE, DEFAULT_APPEARANCE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { labels, themeComment, themeSelector } from "./_shared";
import { formatColor } from "../colorConvert";
import { withHash } from "../color";

export function buildCss(
  p: GeneratedPalette,
  semantic: boolean,
  colorSpace: ColorSpace = DEFAULT_EXPORT_COLOR_SPACE,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const l = labels(semantic);
  const acc = "--accent-";
  const gray = "--gray-";
  const lines: string[] = [themeComment(mode), `${themeSelector(mode)} {`];
  const fmt = (v: string) => formatColor(v, colorSpace, false);

  const pushVar = (varName: string, value: string) => {
    lines.push(`  ${varName}: ${fmt(value)};`);
  };

  p.accentScale.forEach((v, i) => pushVar(`${acc}${l[i]}`, v));
  p.accentScaleAlpha.forEach((v, i) => pushVar(`${acc}a${l[i]}`, v));
  p.accentScaleWideGamut.forEach((v, i) => lines.push(`  ${acc}p3-${l[i]}: ${v};`));
  p.grayScale.forEach((v, i) => pushVar(`${gray}${l[i]}`, v));
  p.grayScaleAlpha.forEach((v, i) => pushVar(`${gray}a${l[i]}`, v));

  pushVar(`${acc}contrast`, p.accentContrast);
  pushVar(`${acc}surface`, p.accentSurface);
  pushVar("--background", withHash(p.background));

  lines.push("}");
  return lines.join("\n");
}
