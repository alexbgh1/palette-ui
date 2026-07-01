import { useEffect } from "react";

import CodeModal from "./CodeModal";
import ExportControls from "./ExportControls";
import Icon from "../ui/Icon";

import { useExportState } from "../../hooks/useExportState";

import type { GeneratedPalette, Appearance } from "../../interfaces";
import { EXPORT_FORMATS, POPOVER_HEIGHT, POPOVER_OFFSET, POPOVER_WIDTH, ICON_SIZES } from "../../constants";

interface CopyPalettePopoverProps {
  palette: GeneratedPalette;
  anchorRect: DOMRect | null;
  open: boolean;
  onClose: () => void;
  appearance: Appearance;
}

export default function CopyPalettePopover({
  palette,
  anchorRect,
  open,
  onClose,
  appearance,
}: CopyPalettePopoverProps) {
  const state = useExportState(palette, appearance, onClose);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") state.handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // TODO: review warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state.handleClose]);

  if (!open || !anchorRect) return null;

  const top = anchorRect.top - POPOVER_HEIGHT - POPOVER_OFFSET;
  const left = Math.max(POPOVER_OFFSET, anchorRect.right - POPOVER_WIDTH);

  return (
    <>
      <div
        className="fixed z-50 rounded-xl border shadow-xl p-3"
        style={{
          top,
          left,
          width: POPOVER_WIDTH,
          backgroundColor: "var(--gray-1)",
          borderColor: "var(--gray-6)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--gray-11)" }}>
            Copy palette
          </span>
          <button
            onClick={state.handleClose}
            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer border-none bg-transparent"
            style={{ color: "var(--gray-11)" }}
          >
            <span className="sr-only">Close</span>
            <Icon name="close" size={ICON_SIZES.xs} />
          </button>
        </div>

        <ExportControls
          format={state.format}
          colorSpace={state.colorSpace}
          semantic={state.semantic}
          rawValues={state.rawValues}
          opacityValues={state.opacityValues}
          supportsSemantic={state.supportsSemantic}
          supportsRaw={state.supportsRaw}
          supportsOpacity={state.supportsOpacity}
          onFormatChange={state.handleFormatChange}
          onColorSpaceChange={state.handleColorSpaceChange}
          onRawChange={state.handleRawChange}
          onOpacityChange={state.handleOpacityChange}
          onSemanticChange={state.setSemantic}
        />

        <pre
          className="text-[10px] font-mono leading-relaxed p-2 rounded mt-2 overflow-hidden whitespace-pre"
          style={{
            backgroundColor: "var(--gray-2)",
            border: "1px solid var(--gray-6)",
            color: "var(--gray-11)",
            maxHeight: 80,
          }}
          dangerouslySetInnerHTML={{ __html: state.previewHighlighted }}
        />

        {/* Preview Generated Code */}
        <div className="flex items-center gap-1.5 mt-2">
          <button
            onClick={state.copy}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-md cursor-pointer border-none"
            style={{
              backgroundColor: state.copied ? "var(--accent-3)" : "var(--accent-9)",
              color: state.copied ? "var(--accent-11)" : "var(--accent-contrast)",
            }}
          >
            <Icon name={state.copied ? "check-circle" : "copy-all"} size={ICON_SIZES.sm} />
            {state.copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => state.setModalOpen(true)}
            className="px-2.5 py-1.5 rounded-md cursor-pointer border flex items-center justify-center"
            style={{
              backgroundColor: "var(--gray-3)",
              borderColor: "var(--gray-6)",
              color: "var(--gray-11)",
            }}
            title="View detail"
          >
            <Icon name="info" size={ICON_SIZES.sm} />
          </button>
        </div>
      </div>

      {/* Code Modal: More details */}
      <CodeModal
        open={state.modalOpen}
        onClose={() => state.setModalOpen(false)}
        title={EXPORT_FORMATS.find((f) => f.id === state.format)?.label ?? "Code"}
        content={state.content}
        highlighted={{ __html: state.highlighted }}
        onCopy={state.copy}
        copied={state.copied}
      />
    </>
  );
}
