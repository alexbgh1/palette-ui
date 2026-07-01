import { useState } from "react";
import { DEFAULT_MODES_CONFIG, SLIDER_RANGES } from "../../constants";
import type { Appearance } from "../../interfaces";

import ColorField from "../ui/ColorField";
import SliderField from "../ui/SliderField";
import Icon from "../ui/Icon";
import { APPEARANCES } from "../../constants";

interface AccentConfigurationProps {
  accent: string;
  gray: string;
  background: string;
  appearance: Appearance;
  sliderH: number;
  sliderL: number;
  sliderC: number;
  chromaShift: number;
  onAccentPick: (h: string) => void;
  onGrayChange: (v: string) => void;
  onBgChange: (v: string) => void;
  onAppearanceChange: (m: Appearance) => void;
  onHueChange: (v: number) => void;
  onLightnessChange: (v: number) => void;
  onChromaChange: (v: number) => void;
  onChromaShiftChange: (v: number) => void;
  onRandomize: () => void;
}

export default function AccentConfiguration({
  accent,
  gray,
  background,
  appearance,
  sliderH,
  sliderL,
  sliderC,
  chromaShift,
  onAccentPick,
  onGrayChange,
  onBgChange,
  onAppearanceChange,
  onHueChange,
  onLightnessChange,
  onChromaChange,
  onChromaShiftChange,
  onRandomize,
}: AccentConfigurationProps) {
  const defaults = DEFAULT_MODES_CONFIG[appearance];
  const changed =
    +(Math.abs(sliderH - defaults.sliderH) > 0.5) +
    +(Math.abs(sliderL - defaults.sliderL) > 0.005) +
    +(Math.abs(sliderC - defaults.sliderC) > 0.005) +
    +(Math.abs(chromaShift - defaults.chromaShift) > 0.005);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <section
      className="rounded-xl border p-5 space-y-5"
      style={{ backgroundColor: "var(--gray-1)", borderColor: "var(--gray-6)" }}
    >
      {/* Appearance toggle */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium block" style={{ color: "var(--gray-11)" }}>
          Appearance
        </span>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: "var(--gray-3)" }}>
          <button
            onClick={() => onAppearanceChange(APPEARANCES.light)}
            className="flex-1 px-3 py-1.5 text-xs rounded-md font-medium cursor-pointer border-none"
            style={{
              backgroundColor: appearance === APPEARANCES.light ? "var(--gray-1)" : "transparent",
              color: appearance === APPEARANCES.light ? "var(--gray-12)" : "var(--gray-11)",
            }}
          >
            Light
          </button>
          <button
            onClick={() => onAppearanceChange(APPEARANCES.dark)}
            className="flex-1 px-3 py-1.5 text-xs rounded-md font-medium cursor-pointer border-none"
            style={{
              backgroundColor: appearance === APPEARANCES.dark ? "var(--gray-1)" : "transparent",
              color: appearance === APPEARANCES.dark ? "var(--gray-12)" : "var(--gray-11)",
            }}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Accent picker */}
      <ColorField label="Accent" value={accent} onChange={onAccentPick} />

      {/* More options - slider dropdown */}
      <div>
        <button
          onClick={() => setMoreOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer border-none"
          style={{ backgroundColor: "var(--gray-2)", color: "var(--gray-12)" }}
        >
          <span className="flex items-center gap-2">
            <Icon name="chevron-down" size={11} />
            More options
          </span>
          {changed > 0 && (
            <span
              className="px-1.5 py-0.5 rounded-full text-[10px] font-mono"
              style={{ backgroundColor: "var(--accent-3)", color: "var(--accent-11)" }}
            >
              {changed} changed
            </span>
          )}
        </button>
        {moreOpen && (
          <div className="space-y-5 mt-5">
            <SliderField
              label="Hue"
              value={sliderH}
              display={`${Math.round(sliderH)}°`}
              min={SLIDER_RANGES.hue.min}
              max={SLIDER_RANGES.hue.max}
              step={SLIDER_RANGES.hue.step}
              onChange={onHueChange}
            />
            <SliderField
              label="Lightness"
              value={sliderL}
              display={sliderL.toFixed(3)}
              min={SLIDER_RANGES.lightness.min}
              max={SLIDER_RANGES.lightness.max}
              step={SLIDER_RANGES.lightness.step}
              onChange={onLightnessChange}
            />
            <SliderField
              label="Chroma"
              value={sliderC}
              display={sliderC.toFixed(3)}
              min={SLIDER_RANGES.chroma.min}
              max={SLIDER_RANGES.chroma.max}
              step={SLIDER_RANGES.chroma.step}
              onChange={onChromaChange}
            />
            <SliderField
              label="Chroma Shift"
              value={chromaShift}
              display={chromaShift > 0 ? `+${chromaShift.toFixed(3)}` : chromaShift.toFixed(3)}
              min={SLIDER_RANGES.chromaShift.min}
              max={SLIDER_RANGES.chromaShift.max}
              step={SLIDER_RANGES.chromaShift.step}
              onChange={onChromaShiftChange}
            />
          </div>
        )}
      </div>

      {/* Gray */}
      <ColorField label="Gray" value={gray} onChange={onGrayChange} />

      {/* Background */}
      <ColorField label="Background" value={background} onChange={onBgChange} />

      {/* Randomize */}
      <button
        onClick={onRandomize}
        className="w-full py-2 rounded-lg text-xs font-medium cursor-pointer border"
        style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-2)", color: "var(--gray-12)" }}
      >
        Randomize Seed
      </button>
    </section>
  );
}
