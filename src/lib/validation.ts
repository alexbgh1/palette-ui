const HEX_RE = /^[0-9a-f]{3}$|^[0-9a-f]{6}$/i;

export function validHex(v: string | undefined, fallback: string): string {
  if (!v) return fallback;
  if (HEX_RE.test(v)) {
    if (v.length === 3) return v.split("").map((c) => c + c).join("");
    return v.toLowerCase();
  }
  return fallback;
}

export function validNum(v: string | undefined, fallback: number, min: number, max: number): number {
  if (v === undefined || v === "") return fallback;
  const n = +v;
  return isFinite(n) && n >= min && n <= max ? n : fallback;
}