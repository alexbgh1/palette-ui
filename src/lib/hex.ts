const HEX6_RE = /^[0-9a-fA-F]{6}$/;
const HEX3_RE = /^[0-9a-fA-F]{3}$/;

export function sanitizeHex(raw: string): string {
  return raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
}

export function isValidHex(v: string): boolean {
  return HEX6_RE.test(v) || HEX3_RE.test(v);
}

export function isValidHex6(v: string): boolean {
  return HEX6_RE.test(v);
}