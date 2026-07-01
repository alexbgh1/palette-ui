import type { Appearance } from "./appearance";

export type ModeValues = {
  accent: string;
  gray: string;
  background: string;
  sliderH: number;
  sliderL: number;
  sliderC: number;
  chromaShift: number;
};

export type Modes = Record<Appearance, ModeValues>;

export type SliderKey = "sliderH" | "sliderL" | "sliderC" | "chromaShift";

export interface PaletteState {
  accent: string;
  gray: string;
  background: string;
  appearance: Appearance;
  sliderH: number;
  sliderL: number;
  sliderC: number;
  chromaShift: number;
  selected: { scale: "accent" | "gray"; step: number } | null;
  overrides: Record<string, string>;
  sidebarOpen: boolean;
}

export interface PaletteInputs {
  appearance: Appearance;
  accent: string;
  gray: string;
  background: string;
}

export interface GeneratedPalette {
  accentScale: string[];
  accentScaleAlpha: string[];
  accentScaleWideGamut: string[];
  accentScaleAlphaWideGamut: string[];
  accentContrast: string;
  grayScale: string[];
  grayScaleAlpha: string[];
  grayScaleWideGamut: string[];
  grayScaleAlphaWideGamut: string[];
  graySurface: string;
  graySurfaceWideGamut: string;
  accentSurface: string;
  accentSurfaceWideGamut: string;
  background: string;
}
