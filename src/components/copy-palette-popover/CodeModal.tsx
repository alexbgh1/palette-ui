import { useEffect } from "react";
import { ICON_SIZES } from "../../constants";

import Icon from "../ui/Icon";

interface CodeModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  highlighted: { __html: string };
  onCopy: () => void;
  copied: boolean;
}

/**
 * CopyPalette Code Modal.
 * Displays the code in a modal with syntax highlighting and copy functionality.
 * E.g. Full CSS, SCSS, TailwindCSS, JSON, JS/TS code for the palette.
 *
 */
export default function CodeModal({ open, onClose, title, highlighted, onCopy, copied }: CodeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border flex flex-col"
        style={{
          backgroundColor: "var(--gray-1)",
          borderColor: "var(--gray-6)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--gray-6)" }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gray-12)" }}>
            {title}
          </span>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded text-xs cursor-pointer border-none bg-transparent"
            style={{ color: "var(--gray-11)" }}
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <pre
            className="text-[11px] font-mono leading-relaxed p-4 rounded-md overflow-x-auto"
            style={{
              backgroundColor: "var(--gray-2)",
              border: "1px solid var(--gray-6)",
              color: "var(--gray-12)",
            }}
            dangerouslySetInnerHTML={{ __html: highlighted.__html }}
          />
        </div>
        <div
          className="flex items-center justify-end gap-2 px-5 py-3 border-t"
          style={{ borderColor: "var(--gray-6)" }}
        >
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border-none"
            style={{ backgroundColor: "var(--gray-3)", color: "var(--gray-12)" }}
          >
            Close
          </button>
          <button
            onClick={onCopy}
            className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border-none flex items-center gap-1.5"
            style={{ backgroundColor: "var(--accent-9)", color: "var(--accent-contrast)" }}
          >
            <Icon name={copied ? "check-circle" : "copy-all"} size={ICON_SIZES.sm} />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
