import { useState, useMemo, useCallback } from "react";
import {
  DEFAULT_EXPORT_COLOR_SPACE,
  DEFAULT_EXPORT_FORMAT,
  EXPORT_FORMATS,
  COLOR_SPACES_VALUES,
  EXPORT_FORMATS_VALUES,
} from "../constants";
import type { GeneratedPalette, Appearance, ExportFormat, ColorSpace } from "../interfaces";

import { highlight, detectLang, applyStyles } from "../lib/highlight";
import { buildCss, buildScss, buildTailwindV3, buildTailwindV4, buildJson, buildTs } from "../lib/exporters";

export function useExportState(palette: GeneratedPalette, appearance: Appearance, onClose: () => void) {
  const [format, setFormat] = useState<ExportFormat>(DEFAULT_EXPORT_FORMAT);
  const [semantic, setSemantic] = useState(false);
  const [colorSpace, setColorSpace] = useState<ColorSpace>(DEFAULT_EXPORT_COLOR_SPACE);
  const [rawValues, setRawValues] = useState(false);
  const [opacityValues, setOpacityValues] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const supportsSemantic = EXPORT_FORMATS.find((f) => f.id === format)?.supportsSemantic ?? false;
  const supportsRaw =
    colorSpace !== COLOR_SPACES_VALUES.hex &&
    (format === EXPORT_FORMATS_VALUES.ts || format === EXPORT_FORMATS_VALUES.json);
  const supportsOpacity = colorSpace !== COLOR_SPACES_VALUES.hex && format === EXPORT_FORMATS_VALUES["tailwind-v3"];

  const handleRawChange = (v: boolean) => {
    setRawValues(v);
    if (v) setOpacityValues(false);
  };

  const handleOpacityChange = (v: boolean) => {
    setOpacityValues(v);
    if (v) setRawValues(false);
  };

  const effectiveRaw = supportsRaw ? rawValues : false;
  const effectiveOpacity = supportsOpacity ? opacityValues : false;

  const handleFormatChange = (f: ExportFormat) => {
    setFormat(f);
    setRawValues(false);
    setOpacityValues(false);
  };

  const handleColorSpaceChange = (cs: ColorSpace) => {
    setColorSpace(cs);
    setRawValues(false);
    setOpacityValues(false);
  };

  const content = useMemo(() => {
    switch (format) {
      case "css":
        return buildCss(palette, semantic, colorSpace, appearance);
      case "scss":
        return buildScss(palette, semantic, colorSpace, appearance);
      case "tailwind-v3":
        return buildTailwindV3(palette, semantic, colorSpace, effectiveOpacity, appearance);
      case "tailwind-v4":
        return buildTailwindV4(palette, semantic, colorSpace, appearance);
      case "json":
        return buildJson(palette, colorSpace, effectiveRaw, appearance);
      case "ts":
        return buildTs(palette, semantic, colorSpace, effectiveRaw, appearance);
    }
  }, [format, semantic, colorSpace, effectiveRaw, effectiveOpacity, palette, appearance]);

  const highlighted = useMemo(() => applyStyles(highlight(content, detectLang(format))), [content, format]);

  const previewContent = useMemo(() => {
    const lines = content.split("\n").slice(0, 4);
    let snippet = lines.join("\n");
    if (content.split("\n").length > 4) snippet += "...";
    return snippet;
  }, [content]);

  const previewHighlighted = useMemo(
    () => applyStyles(highlight(previewContent, detectLang(format))),
    [previewContent, format],
  );

  const handleClose = useCallback(() => {
    setCopied(false);
    setModalOpen(false);
    setRawValues(false);
    setOpacityValues(false);
    setColorSpace(DEFAULT_EXPORT_COLOR_SPACE);
    onClose();
  }, [onClose]);

  const copy = useCallback(() => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Clipboard write failed:", err);
      });
  }, [content]);

  return {
    format,
    semantic,
    colorSpace,
    rawValues,
    opacityValues,
    copied,
    modalOpen,
    supportsSemantic,
    supportsRaw,
    supportsOpacity,
    content,
    highlighted,
    previewHighlighted,
    handleFormatChange,
    handleColorSpaceChange,
    handleRawChange,
    handleOpacityChange,
    setSemantic,
    handleClose,
    copy,
    setModalOpen,
  };
}
