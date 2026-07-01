import type { Modes, ModeValues } from "../interfaces";

export const SLIDER_RANGES = {
  hue: { min: 0, max: 360, step: 1 },
  lightness: { min: 0, max: 1, step: 0.01 },
  chroma: { min: 0, max: 0.4, step: 0.001 },
  chromaShift: { min: -0.1, max: 0.1, step: 0.001 },
} as const;

export const DEFAULT_LIGHT_PALETTE: ModeValues = {
  accent: "0068d7",
  gray: "8a8a8a",
  background: "ffffff",
  sliderH: 226,
  sliderL: 0.5,
  sliderC: 0.1,
  chromaShift: 0,
};

export const DEFAULT_DARK_PALETTE: ModeValues = {
  accent: "3e63dd",
  gray: "8a8a8a",
  background: "111111",
  sliderH: 226,
  sliderL: 0.65,
  sliderC: 0.15,
  chromaShift: 0,
};

export const DEFAULT_MODES_CONFIG: Modes = {
  light: DEFAULT_LIGHT_PALETTE,
  dark: DEFAULT_DARK_PALETTE,
};
