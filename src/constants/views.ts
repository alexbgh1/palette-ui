import type { FABPanelTab, MainView } from "../interfaces";

export const FAB_PANEL_TABS = ["settings", "inspector"] as const;
export const DEFAULT_FAB_PANEL_TAB = "settings" as const;
export const FAB_PANEL_TABS_VALUES: Record<FABPanelTab, FABPanelTab> = {
  settings: "settings",
  inspector: "inspector",
};

export const MAIN_VIEWS = ["components", "accessibility"] as const;
export const DEFAULT_MAIN_VIEW = "components" as const;
export const MAIN_VIEWS_VALUES: Record<MainView, MainView> = {
  components: "components",
  accessibility: "accessibility",
};
