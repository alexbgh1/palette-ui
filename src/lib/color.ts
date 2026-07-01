/**
 * Adds a leading hash to a color string if it doesn't already have one.
 * withHash("ff0000") => "#ff0000"
 */
export function withHash(v: string): string {
  return v.startsWith("#") ? v : `#${v}`;
}

/**
 *  Removes the leading hash from a color string if it exists.
 *  withHash("#ff0000") => "ff0000"
 */
export function stripHash(v: string): string {
  return v.startsWith("#") ? v.slice(1) : v;
}
