import { useMemo, useEffect, useState, useRef, useCallback } from "react";

import { usePaletteState } from "../hooks/usePaletteState";
import { useDynamicFavicon } from "../hooks/useDynamicFavicon";

import {
  APPEARANCES,
  ICON_SIZES,
  STEP_GROUPS,
  NUMERIC_LABELS,
  DEFAULT_MAIN_VIEW,
  DEFAULT_FAB_PANEL_TAB,
  FAB_PANEL_TABS_VALUES,
  MAIN_VIEWS_VALUES,
} from "../constants";
import type { FABPanelTab, MainView } from "../interfaces";

import { withHash } from "../lib/color";
import { buildCssVars } from "../lib/cssVars";

import Sidebar, { SIDEBAR_COLLAPSED_WIDTH } from "./Sidebar";
import CopyPalettePopover from "./copy-palette-popover";
import PreviewComponents from "./showcase/PreviewComponents";
import AccessibilityView from "./showcase/AccessibilityView";
import SwatchScale from "./SwatchScale";
import AccentConfiguration from "./accent-settings/AccentConfiguration";
import ActiveInspectorContent from "./accent-settings/ActiveInspectorContent";
import Icon from "./ui/Icon";

export default function ColorPage() {
  const s = usePaletteState();
  useDynamicFavicon(s.accent);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [activeTab, setActiveTab] = useState<FABPanelTab>(DEFAULT_FAB_PANEL_TAB);
  const [mainView, setMainView] = useState<MainView>(DEFAULT_MAIN_VIEW);

  const [fabOpen, setFabOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [stepsModal, setStepsModal] = useState(false);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const cssVars = useMemo(() => (s.overriddenPalette ? buildCssVars(s.overriddenPalette) : ""), [s.overriddenPalette]);

  const marginLeft = SIDEBAR_COLLAPSED_WIDTH + 12;

  useEffect(() => {
    document.body.style.backgroundColor = withHash(s.background);
  }, [s.background]);

  const openPopover = useCallback(() => {
    if (popoverOpen) {
      setPopoverOpen(false);
      return;
    }
    const btn = sidebarRef.current?.querySelector<HTMLButtonElement>("[data-copy-button]");
    if (btn) {
      setAnchorRect(btn.getBoundingClientRect());
      setPopoverOpen(true);
    }
  }, [popoverOpen]);

  const prevSelected = useRef(s.selected);
  useEffect(() => {
    if (s.selected && s.selected !== prevSelected.current) {
      setFabOpen(true);
      setActiveTab(FAB_PANEL_TABS_VALUES.inspector);
    }
    prevSelected.current = s.selected;
  }, [s.selected]);

  const handleToast = useCallback(() => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }, []);

  const handleFabClose = useCallback(() => {
    setFabOpen(false);
  }, []);

  const hasSelected = !!s.selected && !!s.selectedValue && !!s.overriddenPalette;

  return (
    <>
      <style>{cssVars}</style>

      <div ref={sidebarRef}>
        <Sidebar open={s.sidebarOpen} onToggle={() => s.setSidebarOpen(!s.sidebarOpen)} onCopyClick={openPopover} />
      </div>

      {s.overriddenPalette && (
        <CopyPalettePopover
          palette={s.overriddenPalette!}
          anchorRect={anchorRect}
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          appearance={s.appearance}
        />
      )}

      <main className="min-h-screen" style={{ marginLeft, backgroundColor: withHash(s.background) }}>
        {s.palette && s.overriddenPalette && s.accentScale && s.grayScale ? (
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6 flex items-center gap-4 justify-end">
              <div className="flex items-center gap-2 font-mono">
                <p className="text-[11px]" style={{ color: "var(--gray-11)" }}>
                  Based on
                </p>
                <a
                  href="https://www.radix-ui.com/colors/docs/overview/installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] no-underline font-medium hover:underline underline-offset-2"
                  style={{ color: "var(--accent-11)" }}
                >
                  Radix UI color system
                </a>
                <button
                  onClick={() =>
                    s.handleAppearanceChange(s.appearance === APPEARANCES.dark ? APPEARANCES.light : APPEARANCES.dark)
                  }
                  className="w-6 h-6 flex items-center justify-center rounded cursor-pointer border-none bg-transparent"
                  style={{ color: "var(--gray-11)" }}
                  title={s.appearance === APPEARANCES.dark ? "Switch to light theme" : "Switch to dark theme"}
                >
                  <span className="sr-only">
                    {s.appearance === APPEARANCES.dark ? "Switch to light theme" : "Switch to dark theme"}
                  </span>
                  <Icon name={s.appearance === APPEARANCES.dark ? "sun" : "moon"} size={ICON_SIZES.sm} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--gray-11)" }}>
                    Color Palette
                  </h2>
                  <button
                    onClick={() => setStepsModal(true)}
                    className="w-4 h-4 flex items-center justify-center rounded-full cursor-pointer border-none bg-transparent"
                    style={{ color: "var(--gray-10)" }}
                    aria-label="Step reference"
                  >
                    <Icon name="info" size={ICON_SIZES.xs} />
                  </button>
                </div>

                <div>
                  {/* Group labels - hidden on mobile */}
                  <div className="hidden lg:block mb-4">
                    <div className="grid grid-cols-12">
                      {[
                        { label: "Backgrounds", cols: 2 },
                        { label: "Interactive components", cols: 3 },
                        { label: "Borders and separators", cols: 3 },
                        { label: "Solid Colors", cols: 2 },
                        { label: "Accessible text", cols: 2 },
                      ].map((g) => (
                        <div
                          key={g.label}
                          className="text-[10px] text-center uppercase tracking-wider truncate"
                          style={{ gridColumn: `span ${g.cols}`, color: "var(--gray-10)" }}
                        >
                          {g.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Step numbers - always visible */}
                  <div className="grid grid-cols-12 mb-1">
                    {NUMERIC_LABELS.map((_, i) => {
                      const step = i + 1;
                      const isGroupStart = [1, 3, 6, 9, 11].includes(step);
                      return (
                        <div
                          key={step}
                          className={`text-[9px] font-mono text-center ${step !== 1 && isGroupStart ? "border-l-2" : ""}`}
                          style={{ color: "var(--gray-11)", borderColor: "var(--gray-6)" }}
                        >
                          {step}
                        </div>
                      );
                    })}
                  </div>

                  {/* Swatch scales 1 - 12 ; Accent and Gray */}
                  <SwatchScale
                    colors={s.accentScale ?? []}
                    scaleName="accent"
                    onSelect={s.handleSwatchClick}
                    overrides={s.overrides}
                    palette={s.overriddenPalette!}
                  />
                  <SwatchScale
                    colors={s.grayScale ?? []}
                    scaleName="gray"
                    onSelect={s.handleSwatchClick}
                    overrides={s.overrides}
                    palette={s.overriddenPalette!}
                  />
                </div>
              </section>

              {/* Main view tab Selector */}
              <MainViewTabs mainView={mainView} setMainView={setMainView} />

              {/* Main view tab */}
              {mainView === MAIN_VIEWS_VALUES.components ? (
                <PreviewComponents
                  palette={s.overriddenPalette!}
                  appearance={s.appearance}
                  accentScale={s.accentScale ?? undefined}
                  grayScale={s.grayScale ?? undefined}
                />
              ) : (
                <AccessibilityView
                  accentScale={s.accentScale ?? []}
                  grayScale={s.grayScale ?? []}
                  accentContrast={s.overriddenPalette?.accentContrast ?? ""}
                />
              )}
            </div>
          </div>
        ) : null}
      </main>

      {/* Fab Button update  */}
      {s.overriddenPalette && (
        <>
          <button
            onClick={() => setFabOpen((v) => !v)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full cursor-pointer border-none shadow-lg"
            style={{ backgroundColor: "var(--accent-9)", color: "var(--accent-contrast)" }}
            title="Palette settings"
          >
            <Icon name="palette" size={ICON_SIZES.md} />
            <span className="text-xs font-medium">{hasSelected ? `Step ${s.selected!.step}` : "Accent settings"}</span>
          </button>

          {/* Fab Panel */}
          {fabOpen && (
            <>
              <div
                className="fixed z-50 bottom-20 right-6 rounded-xl border shadow-xl w-80"
                style={{
                  backgroundColor: "var(--gray-1)",
                  borderColor: "var(--gray-6)",
                  maxHeight: "55vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="flex items-center border-b shrink-0" style={{ borderColor: "var(--gray-6)" }}>
                  <button
                    onClick={() => setActiveTab(FAB_PANEL_TABS_VALUES.settings)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium cursor-pointer border-none bg-transparent border-b-2"
                    style={{
                      color: activeTab === FAB_PANEL_TABS_VALUES.settings ? "var(--accent-11)" : "var(--gray-11)",
                      borderBottomColor:
                        activeTab === FAB_PANEL_TABS_VALUES.settings ? "var(--accent-9)" : "transparent",
                    }}
                  >
                    <Icon name="palette" size={ICON_SIZES.xs} />
                    Settings
                  </button>
                  <button
                    onClick={() => hasSelected && setActiveTab(FAB_PANEL_TABS_VALUES.inspector)}
                    disabled={!hasSelected}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border-none bg-transparent border-b-2"
                    style={{
                      color: !hasSelected
                        ? "var(--gray-8)"
                        : activeTab === FAB_PANEL_TABS_VALUES.inspector
                          ? "var(--accent-11)"
                          : "var(--gray-11)",
                      borderBottomColor:
                        activeTab === FAB_PANEL_TABS_VALUES.inspector ? "var(--accent-9)" : "transparent",
                      cursor: hasSelected ? "pointer" : "not-allowed",
                    }}
                  >
                    <Icon name="info" size={ICON_SIZES.xs} />
                    Inspector
                    {hasSelected && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent-9)" }} />
                    )}
                  </button>

                  <button
                    onClick={handleFabClose}
                    className="px-2.5 py-2.5 cursor-pointer border-none bg-transparent"
                    style={{ color: "var(--gray-11)" }}
                  >
                    <span className="sr-only">Close panel</span>
                    <Icon name="close" size={ICON_SIZES.sm} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-4">
                  {activeTab === FAB_PANEL_TABS_VALUES.settings && (
                    <AccentConfiguration
                      accent={s.accent}
                      gray={s.gray}
                      background={s.background}
                      appearance={s.appearance}
                      sliderH={s.sliderH}
                      sliderL={s.sliderL}
                      sliderC={s.sliderC}
                      chromaShift={s.chromaShift}
                      onAccentPick={s.handleColorPick}
                      onGrayChange={s.setGray}
                      onBgChange={s.setBackground}
                      onAppearanceChange={s.handleAppearanceChange}
                      onHueChange={s.setSliderH}
                      onLightnessChange={s.setSliderL}
                      onChromaChange={s.setSliderC}
                      onChromaShiftChange={s.setChromaShift}
                      onRandomize={s.randomize}
                    />
                  )}

                  {activeTab === FAB_PANEL_TABS_VALUES.inspector && hasSelected && (
                    <ActiveInspectorContent
                      key={`${s.selected!.scale}-${s.selected!.step}`}
                      palette={s.overriddenPalette!}
                      selected={s.selected!}
                      selectedValue={s.selectedValue!}
                      onOverrideChange={s.handleOverrideChange}
                      onOverrideReset={s.handleReset}
                      onToast={handleToast}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 flex items-center gap-2 px-5 py-2.5 rounded-full shadow-2xl pointer-events-none"
        style={{
          backgroundColor: "var(--gray-12)",
          color: "var(--gray-1)",
          opacity: toast ? 1 : 0,
          transform: `translate(-50%, ${toast ? 0 : 8}px)`,
          transition: "opacity 150ms ease, transform 150ms ease",
        }}
      >
        <span style={{ color: "var(--accent-9)" }}>
          <Icon name="check-circle" size={ICON_SIZES.sm} />
        </span>
        <span className="text-xs font-medium">Copied to clipboard</span>
      </div>

      {/* Steps reference modal */}
      {stepsModal && <StepReferenceModal onClose={() => setStepsModal(false)} />}
    </>
  );
}

interface MainViewTabsProps {
  mainView: MainView;
  setMainView: (view: MainView) => void;
}

// Tabs for switching between main views (components / accessibility)
const MainViewTabs = ({ mainView, setMainView }: MainViewTabsProps) => {
  return (
    <div className="flex">
      <div className="flex p-0.5 rounded-lg" style={{ backgroundColor: "var(--gray-3)" }}>
        <button
          onClick={() => setMainView(MAIN_VIEWS_VALUES.components)}
          className="px-5 py-1.5 rounded-md text-xs font-medium cursor-pointer border-none"
          style={{
            backgroundColor: mainView === MAIN_VIEWS_VALUES.components ? "var(--gray-1)" : "transparent",
            color: mainView === MAIN_VIEWS_VALUES.components ? "var(--gray-12)" : "var(--gray-11)",
            boxShadow: mainView === MAIN_VIEWS_VALUES.components ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          Components
        </button>
        <button
          onClick={() => setMainView(MAIN_VIEWS_VALUES.accessibility)}
          className="px-5 py-1.5 rounded-md text-xs font-medium cursor-pointer border-none"
          style={{
            backgroundColor: mainView === MAIN_VIEWS_VALUES.accessibility ? "var(--gray-1)" : "transparent",
            color: mainView === MAIN_VIEWS_VALUES.accessibility ? "var(--gray-12)" : "var(--gray-11)",
            boxShadow: mainView === MAIN_VIEWS_VALUES.accessibility ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}
        >
          Accessibility
        </button>
      </div>
    </div>
  );
};

// Modal for displaying step reference information
const StepReferenceModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border shadow-xl p-5"
        style={{ backgroundColor: "var(--gray-1)", borderColor: "var(--gray-6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gray-12)" }}>
            Step reference
          </span>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center rounded cursor-pointer border-none bg-transparent"
            style={{ color: "var(--gray-11)" }}
          >
            <span className="sr-only">Close</span>
            <Icon name="close" size={ICON_SIZES.xs} />
          </button>
        </div>
        <div className="space-y-3">
          {STEP_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "var(--gray-10)" }}>
                {group.label}
              </p>
              <div
                className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 pl-2 border-l-2"
                style={{ borderColor: "var(--gray-6)" }}
              >
                {group.steps.map(([step, label]) => (
                  <div key={step} className="contents">
                    <span className="font-mono text-right text-[11px]" style={{ color: "var(--gray-11)" }}>
                      {step}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--gray-12)" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
