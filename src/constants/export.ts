import type { ExportFormat } from "../interfaces";
import type { ColorSpace } from "../interfaces";

export const EXPORT_COLOR_SPACES: { id: ColorSpace; label: string }[] = [
  { id: "hex", label: "HEX" },
  { id: "rgb", label: "RGB" },
  { id: "hsl", label: "HSL" },
  { id: "oklch", label: "OKLCH" },
];

export const DEFAULT_EXPORT_COLOR_SPACE: ColorSpace = "hex";

export const EXPORT_FORMATS: { id: ExportFormat; label: string; supportsSemantic: boolean }[] = [
  { id: "css", label: "CSS", supportsSemantic: true },
  { id: "scss", label: "Sass / SCSS", supportsSemantic: true },
  { id: "tailwind-v3", label: "Tailwind v3", supportsSemantic: true },
  { id: "tailwind-v4", label: "Tailwind v4", supportsSemantic: true },
  { id: "json", label: "JSON", supportsSemantic: false },
  { id: "ts", label: "JS / TS", supportsSemantic: true },
];

export const EXPORT_FORMATS_VALUES: Record<ExportFormat, ExportFormat> = {
  css: "css",
  scss: "scss",
  "tailwind-v3": "tailwind-v3",
  "tailwind-v4": "tailwind-v4",
  json: "json",
  ts: "ts",
};

export const DEFAULT_EXPORT_FORMAT: ExportFormat = EXPORT_FORMATS_VALUES.css;

// EXPORT POPOVER
export const POPOVER_WIDTH = 288;
export const POPOVER_HEIGHT = 240;
export const POPOVER_OFFSET = 8;

export const COLOR_PICKER_SIZE = "w-9 h-9";
