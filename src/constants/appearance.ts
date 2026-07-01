import type { Appearance } from "../interfaces";

export const APPEARANCES: Record<Appearance, Appearance> = {
  light: "light",
  dark: "dark",
};

export const DEFAULT_APPEARANCE: Appearance = APPEARANCES.light;
