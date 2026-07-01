import { DEFAULT_APPEARANCE } from "../../constants";
import type { GeneratedPalette, Appearance, ColorSpace } from "../../interfaces";

import { withHash } from "../color";
import { formatColor } from "../colorConvert";

export function buildJson(
  p: GeneratedPalette,
  colorSpace: ColorSpace,
  rawValues: boolean,
  mode: Appearance = DEFAULT_APPEARANCE,
): string {
  const formatArray = (arr: string[]) => arr.map((c) => formatColor(c, colorSpace, rawValues));

  const formatSingle = (c: string) => formatColor(c, colorSpace, rawValues);

  const obj = {
    mode,
    accent: formatArray(p.accentScale),
    accentAlpha: formatArray(p.accentScaleAlpha),
    accentP3: p.accentScaleWideGamut,
    gray: formatArray(p.grayScale),
    grayAlpha: formatArray(p.grayScaleAlpha),
    accentContrast: formatSingle(p.accentContrast),
    accentSurface: formatSingle(p.accentSurface),
    background: formatSingle(withHash(p.background)),
  };

  return JSON.stringify(obj, null, 2);
}
