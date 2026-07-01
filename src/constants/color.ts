export const COLOR_SPACES = ["hex", "rgb", "hsl", "oklch"] as const;

export const COLOR_SPACES_VALUES: Record<(typeof COLOR_SPACES)[number], string> = {
  hex: "hex",
  rgb: "rgb",
  hsl: "hsl",
  oklch: "oklch",
};

export const BLACK = "#000000";
export const WHITE = "#ffffff";
