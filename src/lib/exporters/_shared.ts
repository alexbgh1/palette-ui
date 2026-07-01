import { NUMERIC_LABELS, SEMANTIC_NAMES } from "../../constants";

/**
 * Semantic labels based on boolean
 * e.g. true = semantic ("bg"), false = numeric ("1", "2", "3", etc.)
 *
 */
export function labels(semantic: boolean): readonly string[] {
  return semantic ? SEMANTIC_NAMES : NUMERIC_LABELS;
}
