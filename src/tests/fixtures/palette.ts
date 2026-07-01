import type { GeneratedPalette } from "../../interfaces";

const ACCENT_12 = [
  "#0c111c", "#111725", "#172448", "#1d2e61",
  "#253974", "#2e4484", "#375097", "#415eb1",
  "#3e63dd", "#3f5cb0", "#93b4ff", "#d5e2ff",
];

const ACCENT_A12 = [
  "#0012fb0c", "#1156f916", "#2b64ff3b", "#3567ff56",
  "#4171fd6b", "#4d7afd7c", "#5581ff90", "#5883feac",
  "#4671ffdb", "#5580feab", "#93b4ff", "#d5e2ff",
];

const ACCENT_P3 = [
  "oklch(17.8% 0.0247 267)", "oklch(20.7% 0.0302 267)", "oklch(27.1% 0.0693 267)", "oklch(31.8% 0.0931 267)",
  "oklch(36.1% 0.1044 267)", "oklch(40.4% 0.1105 267)", "oklch(45% 0.1201 267)", "oklch(50.3% 0.1371 267)",
  "oklch(54.4% 0.191 267)", "oklch(49.7% 0.1371 267)", "oklch(77.7% 0.1232 267)", "oklch(91.1% 0.0428 267)",
];

const GRAY_12 = [
  "#111111", "#191919", "#222222", "#2a2a2a",
  "#313131", "#3a3a3a", "#484848", "#606060",
  "#6e6e6e", "#7c7c7c", "#b4b4b4", "#eeeeee",
];

const GRAY_A12 = [
  "#00000000", "#ffffff09", "#ffffff12", "#ffffff1b",
  "#ffffff22", "#ffffff2c", "#ffffff3b", "#ffffff55",
  "#ffffff64", "#ffffff73", "#ffffffaf", "#ffffffed",
];

export const mockPalette: GeneratedPalette = {
  accentScale:                ACCENT_12,
  accentScaleAlpha:           ACCENT_A12,
  accentScaleWideGamut:       ACCENT_P3,
  accentScaleAlphaWideGamut:  ACCENT_P3,
  accentContrast:             "#ffffff",
  accentSurface:              "#111d3980",
  accentSurfaceWideGamut:     "color(display-p3 0.078 0.11 0.22 / 0.5)",
  grayScale:                  GRAY_12,
  grayScaleAlpha:             GRAY_A12,
  grayScaleWideGamut:         GRAY_12,
  grayScaleAlphaWideGamut:    GRAY_A12,
  graySurface:                "#00000000",
  graySurfaceWideGamut:       "color(display-p3 0 0 0 / 0%)",
  background:                 "#111111",
};
