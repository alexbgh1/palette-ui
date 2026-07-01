import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Color from "colorjs.io";
import type { GeneratedPalette } from "../../interfaces";
import { sanitizeHex, isValidHex6 } from "../../lib/hex";
import { stripHash } from "../../lib/color";
import { WCAG_AA_RATIO, WCAG_LARGE_TEXT_RATIO, COLOR_PICKER_SIZE, ICON_SIZES, WHITE } from "../../constants";
import Icon from "../ui/Icon";

interface ActiveInspectorContentProps {
  palette: GeneratedPalette;
  selected: { scale: "accent" | "gray"; step: number };
  selectedValue: { hex: string; alpha: string; p3: string; isOverride: boolean };
  onOverrideChange: (hex: string) => void;
  onOverrideReset: () => void;
  onToast: () => void;
}

function Row({
  label,
  value,
  color,
  border,
  preview,
}: {
  label: string;
  value: string;
  color: string;
  border?: boolean;
  preview?: ReactNode;
}) {
  return (
    <div
      className={`flex justify-between items-center py-1.5 text-[11px]${border !== false ? " border-b" : ""}`}
      style={{ borderColor: "var(--gray-6)" }}
    >
      <div className="flex items-center gap-2">
        {preview}
        <span style={{ color: "var(--gray-11)" }}>{label}</span>
      </div>
      <span className="font-mono font-semibold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

export default function ActiveInspectorContent({
  palette,
  selected,
  selectedValue,
  onOverrideChange,
  onOverrideReset,
  onToast,
}: ActiveInspectorContentProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const { contrastWhite, contrastBlack } = useMemo(() => {
    try {
      const stepColor = new Color(selectedValue.hex);
      return {
        contrastWhite: stepColor.contrastWCAG21(new Color("white")).toFixed(2),
        contrastBlack: stepColor.contrastWCAG21(new Color("black")).toFixed(2),
      };
    } catch {
      return { contrastWhite: "-", contrastBlack: "-" };
    }
  }, [selectedValue.hex]);

  const copyCssVar = useCallback(() => {
    const prefix = selected.scale === "accent" ? "accent" : "gray";
    const text = `--${prefix}-${selected.step}: ${selectedValue.hex};`;
    navigator.clipboard
      .writeText(text)
      .then(() => onToast())
      .catch((err) => console.error("Clipboard write failed:", err));
  }, [selected, selectedValue, onToast]);

  const commit = (raw: string) => {
    const v = sanitizeHex(raw);
    setDraft(v);
    if (isValidHex6(v)) {
      onOverrideChange(`#${v}`);
    }
  };

  const prefix = selected.scale === "accent" ? "accent" : "gray";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10  flex items-center justify-center shadow-inner font-mono font-bold text-lg shrink-0"
          style={{ backgroundColor: selectedValue.hex, color: palette.accentContrast }}
        >
          {selected.step}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold" style={{ color: "var(--gray-12)" }}>
            Step {selected.step}
          </p>
          <p className="text-[10px] font-mono truncate" style={{ color: "var(--gray-11)" }}>
            --{prefix}-{selected.step}
          </p>
        </div>
      </div>

      <div className="space-y-1 mb-0.5">
        <Row
          label="vs White"
          value={`${contrastWhite}:1`}
          color={
            +contrastWhite >= WCAG_AA_RATIO
              ? "var(--accent-11)"
              : +contrastWhite >= WCAG_LARGE_TEXT_RATIO
                ? "var(--gray-11)"
                : "var(--gray-9)"
          }
          preview={
            <div
              className="w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center shrink-0"
              style={{ backgroundColor: selectedValue.hex, color: WHITE, border: "1px solid var(--gray-5)" }}
            >
              Aa
            </div>
          }
        />
        <Row
          label="vs Black"
          value={`${contrastBlack}:1`}
          color={
            +contrastBlack >= WCAG_AA_RATIO
              ? "var(--accent-11)"
              : +contrastBlack >= WCAG_LARGE_TEXT_RATIO
                ? "var(--gray-11)"
                : "var(--gray-9)"
          }
          border={false}
          preview={
            <div
              className="w-6 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center shrink-0"
              style={{ backgroundColor: selectedValue.hex, color: "#111", border: "1px solid var(--gray-5)" }}
            >
              Aa
            </div>
          }
        />
      </div>

      <div className="pt-3 border-t" style={{ borderColor: "var(--gray-6)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--gray-11)" }}>
            Override hex
          </span>
          <button
            onClick={onOverrideReset}
            disabled={!selectedValue.isOverride}
            tabIndex={selectedValue.isOverride ? 0 : -1}
            className={`text-[10px] font-medium border-none bg-transparent px-1.5 py-0.5 rounded ${
              selectedValue.isOverride ? "cursor-pointer" : "invisible"
            }`}
            style={{ color: "var(--accent-11)", backgroundColor: "var(--accent-3)" }}
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center border rounded overflow-hidden flex-1"
            style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-2)" }}
          >
            <span
              className="px-2 py-1.5 text-xs font-mono border-r shrink-0"
              style={{ borderColor: "var(--gray-6)", color: "var(--gray-11)", backgroundColor: "var(--gray-3)" }}
            >
              #
            </span>
            <input
              type="text"
              value={draft ?? selectedValue.hex.replace(/^#/, "")}
              onChange={(e) => commit(e.target.value)}
              onFocus={() => setDraft(selectedValue.hex.replace(/^#/, ""))}
              onBlur={() => setDraft(null)}
              className="flex-1 px-2 py-1.5 text-xs font-mono bg-transparent border-none outline-none"
              style={{ color: "var(--gray-12)" }}
            />
          </div>
          <input
            type="color"
            value={isValidHex6(selectedValue.hex.replace(/^#/, "")) ? selectedValue.hex : "#000000"}
            onChange={(e) => {
              setDraft(null);
              commit(stripHash(e.target.value));
            }}
            className={`${COLOR_PICKER_SIZE} border rounded cursor-pointer shrink-0 p-0`}
            style={{ borderColor: "var(--gray-6)" }}
            title="Pick color"
          />
        </div>
      </div>

      <button
        onClick={copyCssVar}
        className="w-full flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg cursor-pointer border-none"
        style={{ backgroundColor: "var(--gray-2)", color: "var(--gray-11)" }}
      >
        <span className="inline-flex items-center justify-center" style={{ width: 14, height: 14 }}>
          <Icon name="copy-all" size={ICON_SIZES.sm} />
        </span>
        Copy CSS Variable
      </button>
    </div>
  );
}
