import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Color from "colorjs.io";
import { generateRadixColors } from "../engine/generate";

import { APPEARANCES, COLOR_SPACES_VALUES, DEFAULT_MODES_CONFIG, SLIDER_RANGES } from "../constants";
import type { Appearance, GeneratedPalette, Modes, ModeValues, PaletteState, SliderKey } from "../interfaces";

import { readParams, readLS, writeParams, writeLS, paramsOrLS, readUIPrefs, writeUIPrefs } from "../lib/storage";
import { validHex, validNum } from "../lib/validation";
import { withHash, stripHash } from "../lib/color";
import { applyOverrides } from "../lib/overrides";
import { safeCoords } from "../lib/colorConvert";

function oklchToHex(L: number, C: number, H: number): string {
  return stripHash(new Color("oklch", [L, C, H]).to("srgb").toString({ format: COLOR_SPACES_VALUES.hex }));
}

// 1. Resolution helpers extracted to clean up the main function
function resolveHexParam(key: "accent" | "gray" | "background", appearance: Appearance, fallback: string): string {
  const other: Appearance = appearance === APPEARANCES.light ? APPEARANCES.dark : APPEARANCES.light;
  const paramKey = key === "background" ? "bg" : key;

  return validHex(paramsOrLS(`${paramKey}-${appearance}`, "") || paramsOrLS(`${paramKey}-${other}`, ""), fallback);
}

function resolveNumParam(key: SliderKey, appearance: Appearance, fallback: number, min: number, max: number): number {
  const other: Appearance = appearance === APPEARANCES.light ? APPEARANCES.dark : APPEARANCES.light;

  return validNum(paramsOrLS(`${key}-${appearance}`, "") || paramsOrLS(`${key}-${other}`, ""), fallback, min, max);
}

// 2. Clean main function without legacy code
function initModeValues(appearance: Appearance): ModeValues {
  const fb = DEFAULT_MODES_CONFIG[appearance];

  // Extract hex colors
  const accent = resolveHexParam("accent", appearance, fb.accent);
  const gray = resolveHexParam("gray", appearance, fb.gray);
  const background = resolveHexParam("background", appearance, fb.background);

  // Derive OKLCH when accent comes from URL but sliders are missing
  const accentFromUrl = !!paramsOrLS(`accent-${appearance}`, "");
  const slidersFromUrl =
    !!paramsOrLS(`h-${appearance}`, "") ||
    !!paramsOrLS(`l-${appearance}`, "") ||
    !!paramsOrLS(`c-${appearance}`, "") ||
    !!paramsOrLS(`cs-${appearance}`, "");

  let derived: Partial<ModeValues> = {};

  if (accentFromUrl && !slidersFromUrl) {
    try {
      const c = new Color(`#${accent}`);
      const [L, C, H] = safeCoords(c, "oklch");
      derived = { sliderH: Math.round(H), sliderL: L, sliderC: C, chromaShift: 0 };
    } catch {
      console.warn("Failed to derive sliders from accent hex:", accent);
    }
  }

  // Extract numeric values (prefer derived if available, then default fallback)
  const sliderH = resolveNumParam(
    "sliderH",
    appearance,
    derived.sliderH ?? fb.sliderH,
    SLIDER_RANGES.hue.min,
    SLIDER_RANGES.hue.max,
  );
  const sliderL = resolveNumParam(
    "sliderL",
    appearance,
    derived.sliderL ?? fb.sliderL,
    SLIDER_RANGES.lightness.min,
    SLIDER_RANGES.lightness.max,
  );
  const sliderC = resolveNumParam(
    "sliderC",
    appearance,
    derived.sliderC ?? fb.sliderC,
    SLIDER_RANGES.chroma.min,
    SLIDER_RANGES.chroma.max,
  );
  const chromaShift = resolveNumParam(
    "chromaShift",
    appearance,
    derived.chromaShift ?? fb.chromaShift,
    SLIDER_RANGES.chromaShift.min,
    SLIDER_RANGES.chromaShift.max,
  );

  return { accent, gray, background, sliderH, sliderL, sliderC, chromaShift };
}

export function usePaletteState() {
  const [appearance, setAppearanceState] = useState<Appearance>(() => {
    const fromParam = readParams();
    const fromLS = readLS();
    const src = fromParam.mode ?? fromLS?.mode;
    return src === APPEARANCES.dark ? APPEARANCES.dark : APPEARANCES.light;
  });

  const [modes, setModes] = useState<Modes>(() => ({
    light: initModeValues(APPEARANCES.light),
    dark: initModeValues(APPEARANCES.dark),
  }));

  const [selected, setSelected] = useState<PaletteState["selected"]>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const prefs = readUIPrefs();
    return prefs.sidebarOpen !== "false";
  });

  const m = modes[appearance];
  const { accent, gray, background, sliderH, sliderL, sliderC, chromaShift } = m;

  const updateMode = useCallback(
    (patch: Partial<ModeValues>) => {
      setModes((prev) => ({ ...prev, [appearance]: { ...prev[appearance], ...patch } }));
    },
    [appearance],
  );

  const setAccent = useCallback((v: string) => updateMode({ accent: v }), [updateMode]);
  const setGray = useCallback((v: string) => updateMode({ gray: v }), [updateMode]);
  const setBackground = useCallback((v: string) => updateMode({ background: v }), [updateMode]);

  const setSliderAndAccent = useCallback(
    (key: SliderKey, v: number) => {
      const next = { ...m, [key]: v };
      updateMode({ [key]: v });
      const hex = oklchToHex(next.sliderL, next.sliderC + next.chromaShift, next.sliderH);
      updateMode({ accent: hex });
    },
    [m, updateMode],
  );

  const setSliderH = useCallback((v: number) => setSliderAndAccent("sliderH", v), [setSliderAndAccent]);
  const setSliderL = useCallback((v: number) => setSliderAndAccent("sliderL", v), [setSliderAndAccent]);
  const setSliderC = useCallback((v: number) => setSliderAndAccent("sliderC", v), [setSliderAndAccent]);
  const setChromaShift = useCallback((v: number) => setSliderAndAccent("chromaShift", v), [setSliderAndAccent]);

  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    const data: Record<string, string> = { mode: appearance };
    for (const a of [APPEARANCES.light, APPEARANCES.dark]) {
      const mv = modes[a];
      data[`accent-${a}`] = mv.accent;
      data[`gray-${a}`] = mv.gray;
      data[`bg-${a}`] = mv.background;
      data[`h-${a}`] = String(Math.round(mv.sliderH));
      data[`l-${a}`] = mv.sliderL.toFixed(4);
      data[`c-${a}`] = mv.sliderC.toFixed(4);
      data[`cs-${a}`] = mv.chromaShift.toFixed(4);
    }
    const timeout = setTimeout(() => {
      writeParams(data);
      writeLS(data);
    }, 150);
    return () => clearTimeout(timeout);
  }, [appearance, modes]);

  // Separate effect: sidebarOpen → localStorage ONLY, never URL
  const sidebarHydrated = useRef(false);
  useEffect(() => {
    if (!sidebarHydrated.current) {
      sidebarHydrated.current = true;
      return;
    }
    writeUIPrefs({ sidebarOpen: String(sidebarOpen) });
  }, [sidebarOpen]);

  const palette = useMemo<GeneratedPalette | null>(() => {
    try {
      return generateRadixColors({
        appearance,
        accent: withHash(accent),
        gray: withHash(gray),
        background: withHash(background),
      });
    } catch (err) {
      console.error("generateRadixColors failed:", err);
      return null;
    }
  }, [appearance, accent, gray, background]);

  const overriddenPalette = useMemo(() => {
    if (!palette || Object.keys(overrides).length === 0) return palette;
    try {
      return applyOverrides(palette, overrides, background);
    } catch (err) {
      console.error("applyOverrides failed:", err);
      return palette;
    }
  }, [palette, overrides, background]);

  const accentScale = overriddenPalette?.accentScale ?? null;
  const grayScale = overriddenPalette?.grayScale ?? null;

  const selectedValue = useMemo(() => {
    if (!selected || !palette || !overriddenPalette) return null;
    const op = overriddenPalette;
    const i = selected.step - 1;
    const hex = (selected.scale === "accent" ? accentScale : grayScale)?.[i] ?? palette.accentScale[i];
    const alpha = selected.scale === "accent" ? op.accentScaleAlpha[i] : op.grayScaleAlpha[i];
    const p3 = selected.scale === "accent" ? op.accentScaleWideGamut[i] : op.grayScaleWideGamut[i];
    const isOverride = overrides[`${selected.scale}-${selected.step}`] !== undefined;
    return { hex, alpha, p3, isOverride };
  }, [selected, palette, overriddenPalette, overrides, accentScale, grayScale]);

  const handleColorPick = useCallback(
    (hex: string) => {
      const normalized = withHash(hex);
      setAccent(stripHash(normalized));
      try {
        const c = new Color(normalized).to("oklch");
        const [L, C, H] = safeCoords(c, "oklch");
        updateMode({ sliderL: L, sliderC: C, sliderH: Math.round(H), chromaShift: 0 });
      } catch {
        // Partial/invalid hex while user is typing - ignore
      }
    },
    [setAccent, updateMode],
  );

  const handleAppearanceChange = useCallback((mode: Appearance) => {
    setAppearanceState(mode);
  }, []);

  const handleSwatchClick = useCallback((scale: "accent" | "gray", step: number) => {
    setSelected({ scale, step });
  }, []);

  const handleOverrideChange = useCallback(
    (hex: string) => {
      if (!selected) return;
      const key = `${selected.scale}-${selected.step}`;
      setOverrides((prev) => ({ ...prev, [key]: hex }));
    },
    [selected],
  );

  const handleReset = useCallback(() => {
    if (!selected) return;
    const key = `${selected.scale}-${selected.step}`;
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, [selected]);

  const randomize = useCallback(() => {
    const h = Math.round(Math.random() * 360);
    const l = 0.1 + Math.random() * 0.85;
    const c = Math.random() * 0.35;
    updateMode({ sliderH: h, sliderL: l, sliderC: c, chromaShift: 0, accent: oklchToHex(l, c, h) });
  }, [updateMode]);

  return {
    accent,
    setAccent,
    gray,
    setGray,
    background,
    setBackground,
    appearance,
    sliderH,
    setSliderH,
    sliderL,
    setSliderL,
    sliderC,
    setSliderC,
    chromaShift,
    setChromaShift,
    selected,
    setSelected,
    overrides,
    sidebarOpen,
    setSidebarOpen,
    palette,
    overriddenPalette,
    accentScale,
    grayScale,
    selectedValue,
    handleColorPick,
    handleAppearanceChange,
    handleSwatchClick,
    handleOverrideChange,
    handleReset,
    randomize,
  };
}
