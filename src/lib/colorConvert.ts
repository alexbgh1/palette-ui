import Color from "colorjs.io";
import { stripHash } from "./color";
import type { ColorSpace } from "../interfaces";
import { COLOR_SPACES_VALUES } from "../constants";

// Safe coord extraction with length validation and per-index fallback
export function safeCoords(c: Color, space: "srgb" | "hsl" | "oklch" | "p3"): [number, number, number] {
  const converted = c.to(space);
  const raw = converted.coords;
  if (raw.length < 3) {
    throw new Error(`Unexpected coords length ${raw.length} for space "${space}"`);
  }
  return [raw[0] ?? 0, raw[1] ?? 0, raw[2] ?? 0];
}

function getAlpha(c: Color): number | undefined {
  const a = c.to("srgb").alpha;
  return a < 1 ? a : undefined;
}

export function formatChannels(value: string, space: ColorSpace) {
  if (space === COLOR_SPACES_VALUES!.hex || space === "hex") return stripHash(value);
  try {
    const c = new Color(value);
    switch (space) {
      case "rgb": {
        const [R, G, B] = safeCoords(c, "srgb");
        return `${Math.round(R * 255)} ${Math.round(G * 255)} ${Math.round(B * 255)}`;
      }
      case "hsl": {
        const [H, S, L] = safeCoords(c, "hsl");
        return `${Math.round(H || 0)} ${Math.round(S || 0)}% ${Math.round(L || 0)}%`;
      }
      case "oklch": {
        const [L, C, H] = safeCoords(c, "oklch");
        return `${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${(H || 0).toFixed(1)}`;
      }
    }
  } catch (err) {
    console.error(`formatChannels failed for value "${value}" in space "${space}":`, err);
    return value;
  }
}

export function formatColor(value: string, space: ColorSpace, raw: boolean) {
  if (space === COLOR_SPACES_VALUES!.hex || space === "hex") return raw ? stripHash(value) : value;

  try {
    const c = new Color(value);
    const alpha = getAlpha(c);

    switch (space) {
      case "rgb": {
        const [R, G, B] = safeCoords(c, "srgb");
        const r = Math.round(R * 255);
        const g = Math.round(G * 255);
        const b = Math.round(B * 255);
        if (raw) {
          return alpha !== undefined ? `${r} ${g} ${b} / ${alpha.toFixed(3)}` : `${r} ${g} ${b}`;
        }
        return alpha !== undefined ? `rgb(${r} ${g} ${b} / ${alpha.toFixed(3)})` : `rgb(${r} ${g} ${b})`;
      }
      case "hsl": {
        const [H, S, L] = safeCoords(c, "hsl");
        const h = Math.round(H || 0);
        const s = Math.round(S || 0);
        const l = Math.round(L || 0);
        if (raw) {
          return alpha !== undefined ? `${h} ${s}% ${l}% / ${alpha.toFixed(3)}` : `${h} ${s}% ${l}%`;
        }
        return alpha !== undefined ? `hsl(${h} ${s}% ${l}% / ${alpha.toFixed(3)})` : `hsl(${h} ${s}% ${l}%)`;
      }
      case "oklch": {
        const [L, C, H] = safeCoords(c, "oklch");
        const l = (L * 100).toFixed(1) + "%";
        const ch = C.toFixed(3);
        const h = (H || 0).toFixed(1);
        if (raw) {
          return alpha !== undefined ? `${l} ${ch} ${h} / ${alpha.toFixed(3)}` : `${l} ${ch} ${h}`;
        }
        return alpha !== undefined ? `oklch(${l} ${ch} ${h} / ${alpha.toFixed(3)})` : `oklch(${l} ${ch} ${h})`;
      }
    }
  } catch (err) {
    console.error(`formatColor failed for value "${value}" in space "${space}":`, err);
    return value;
  }
}
