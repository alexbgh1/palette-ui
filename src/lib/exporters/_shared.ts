import { APPEARANCES, NUMERIC_LABELS, SEMANTIC_NAMES } from "../../constants";
import type { Appearance } from "../../interfaces";

/**
 * Semantic labels based on boolean
 * e.g. true = semantic ("bg"), false = numeric ("1", "2", "3", etc.)
 *
 */
export function labels(semantic: boolean): readonly string[] {
  return semantic ? SEMANTIC_NAMES : NUMERIC_LABELS;
}

export function themeSelector(mode: Appearance): string {
  return mode === APPEARANCES.dark ? ".dark, .dark-theme" : ":root, .light, .light-theme";
}

export function themeComment(mode: Appearance, style: "css" | "js" = "css"): string {
  /*
    e.g. for CSS:      /* Dark mode *\/
    e.g. for JS:       // Dark mode
  */
  const label = mode === APPEARANCES.dark ? "Dark" : "Light";
  return style === "js" ? `// ${label} mode` : `/* ${label} mode */`;
}
