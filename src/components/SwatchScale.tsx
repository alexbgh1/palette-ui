import type { GeneratedPalette } from "../interfaces";

interface SwatchScaleProps {
  colors: string[];
  scaleName: "accent" | "gray";
  onSelect: (scale: "accent" | "gray", step: number) => void;
  overrides: Record<string, string>;
  palette: GeneratedPalette;
}

export default function SwatchScale({ colors, scaleName, onSelect, overrides, palette }: SwatchScaleProps) {
  const alphaColors = scaleName === "accent" ? palette.accentScaleAlpha : palette.grayScaleAlpha;

  return (
    <div className="mb-1">
      {/* Swatches */}
      <div className="grid grid-cols-12 gap-0.5">
        {colors.map((hex, i) => {
          const step = i + 1;
          const overridden = overrides[`${scaleName}-${step}`] !== undefined;

          return (
            <button
              key={`${scaleName}-${step}`}
              onClick={() => onSelect(scaleName, step)}
              title={`${scaleName}-${step}: ${hex}`}
              className="relative cursor-pointer border-none outline-none rounded-t-xs"
              style={{
                backgroundColor: hex,
                height: 64,
              }}
            >
              {overridden && (
                <span
                  className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--gray-1)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Alpha strip */}
      <div className="grid grid-cols-12 mt-1  gap-0.5">
        {alphaColors.map((hex, i) => {
          const step = i + 1;
          return (
            <div key={`a-${step}`} title={`${scaleName}-a${step}`} className="h-5" style={{ backgroundColor: hex }} />
          );
        })}
      </div>
    </div>
  );
}
