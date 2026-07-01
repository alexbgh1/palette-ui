import Color from "colorjs.io";
import type { GeneratedPalette } from "../interfaces";
import { getAlphaColorSrgb, getAlphaColorP3, toOklchString } from "../engine/generate";
import { withHash } from "./color";

export function applyOverrides(palette: GeneratedPalette, overrides: Record<string, string>, background: string): GeneratedPalette {
  const keys = Object.keys(overrides);
  if (keys.length === 0) return palette;

  const bg = withHash(background);
  const accentSolid = [...palette.accentScale];
  const accentAlpha = [...palette.accentScaleAlpha];
  const accentP3 = [...palette.accentScaleWideGamut];
  const accentP3Alpha = [...palette.accentScaleAlphaWideGamut];
  const graySolid = [...palette.grayScale];
  const grayAlpha = [...palette.grayScaleAlpha];
  const grayP3 = [...palette.grayScaleWideGamut];
  const grayP3Alpha = [...palette.grayScaleAlphaWideGamut];

  for (const key of keys) {
    const hex = withHash(overrides[key]);
    const [scale, stepStr] = key.split("-");
    const i = +stepStr - 1;
    if (i < 0 || i > 11) continue;

    const oklchColor = new Color(hex).to("oklch");

    if (scale === "accent") {
      accentSolid[i] = hex;
      accentAlpha[i] = getAlphaColorSrgb(hex, bg);
      accentP3[i] = toOklchString(oklchColor);
      accentP3Alpha[i] = getAlphaColorP3(hex, bg);
    } else if (scale === "gray") {
      graySolid[i] = hex;
      grayAlpha[i] = getAlphaColorSrgb(hex, bg);
      grayP3[i] = toOklchString(oklchColor);
      grayP3Alpha[i] = getAlphaColorP3(hex, bg);
    }
  }

  return {
    ...palette,
    accentScale: accentSolid,
    accentScaleAlpha: accentAlpha,
    accentScaleWideGamut: accentP3,
    accentScaleAlphaWideGamut: accentP3Alpha,
    grayScale: graySolid,
    grayScaleAlpha: grayAlpha,
    grayScaleWideGamut: grayP3,
    grayScaleAlphaWideGamut: grayP3Alpha,
  };
}