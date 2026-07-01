import Select from "../ui/Select";
import Toggle from "../ui/Toggle";

import type { ColorSpace, ExportFormat } from "../../interfaces";

import { EXPORT_FORMATS, EXPORT_COLOR_SPACES } from "../../constants";

interface ExportControlsProps {
  format: ExportFormat;
  colorSpace: ColorSpace;
  semantic: boolean;
  rawValues: boolean;
  opacityValues: boolean;
  supportsSemantic: boolean;
  supportsRaw: boolean;
  supportsOpacity: boolean;
  onFormatChange: (f: ExportFormat) => void;
  onColorSpaceChange: (cs: ColorSpace) => void;
  onRawChange: (v: boolean) => void;
  onOpacityChange: (v: boolean) => void;
  onSemanticChange: (v: boolean) => void;
}

export default function ExportControls({
  format,
  colorSpace,
  semantic,
  rawValues,
  opacityValues,
  supportsSemantic,
  supportsRaw,
  supportsOpacity,
  onFormatChange,
  onColorSpaceChange,
  onRawChange,
  onOpacityChange,
  onSemanticChange,
}: ExportControlsProps) {
  return (
    <>
      <div className="flex gap-2">
        <div className="flex-1">
          <Select<ExportFormat>
            value={format}
            onChange={onFormatChange}
            options={EXPORT_FORMATS.map((f) => ({ value: f.id, label: f.label }))}
            size="md"
          />
        </div>
        <div className="flex-1">
          <Select<ColorSpace>
            value={colorSpace}
            onChange={onColorSpaceChange}
            options={EXPORT_COLOR_SPACES.map((s) => ({ value: s.id, label: s.label }))}
            size="md"
          />
        </div>
      </div>

      <div className="flex flex-row justify-between">
        {supportsRaw && (
          <label className="flex items-center gap-2 mt-2 mb-1 cursor-pointer select-none">
            <Toggle checked={rawValues} onChange={onRawChange} disabled={opacityValues} size="sm" />
            <span className="text-[11px]" style={{ color: opacityValues ? "var(--gray-9)" : "var(--gray-12)" }}>
              Raw values
            </span>
          </label>
        )}
        {supportsOpacity && (
          <label className="flex items-center gap-2 mt-2 mb-1 cursor-pointer select-none">
            <Toggle checked={opacityValues} onChange={onOpacityChange} disabled={rawValues} size="sm" />
            <span className="text-[11px]" style={{ color: rawValues ? "var(--gray-9)" : "var(--gray-12)" }}>
              Opacity syntax
            </span>
          </label>
        )}
      </div>

      {supportsSemantic && (
        <label className="flex items-center gap-2 mt-2 mb-1 cursor-pointer select-none">
          <div
            className="relative shrink-0 rounded-full"
            style={{
              width: 28,
              height: 16,
              backgroundColor: semantic ? "var(--accent-9)" : "var(--gray-5)",
            }}
            onClick={() => onSemanticChange(!semantic)}
          >
            <div
              className="absolute top-0.5 rounded-full"
              style={{
                width: 12,
                height: 12,
                backgroundColor: "var(--accent-contrast)",
                left: semantic ? 14 : 2,
              }}
            />
          </div>
          <span className="text-[11px]" style={{ color: "var(--gray-12)" }}>
            Semantic names
          </span>
        </label>
      )}
    </>
  );
}
