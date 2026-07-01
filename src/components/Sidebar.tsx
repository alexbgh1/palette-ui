import { ICON_SIZES } from "../constants";
import type { IconName } from "../interfaces";
import Icon from "./ui/Icon";

export const SIDEBAR_OPEN_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 48;

interface NavItem {
  id: string;
  icon: IconName;
  label: string;
}

const NAV_ITEMS: NavItem[] = [{ id: "generator", icon: "palette", label: "Custom Palette" }];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onCopyClick: () => void;
}

export default function Sidebar({ open, onToggle, onCopyClick }: SidebarProps) {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-3 z-50 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer border-none"
        style={{
          left: open ? SIDEBAR_OPEN_WIDTH - 36 : (SIDEBAR_COLLAPSED_WIDTH - 32) / 2,
          backgroundColor: "var(--gray-2)",
          color: "var(--gray-11)",
        }}
      >
        <span className="sr-only">Toggle sidebar</span>
        <span className="inline-flex items-center justify-center" style={{ width: 16, height: 16 }}>
          <Icon name={open ? "menu-open" : "menu"} size={ICON_SIZES.md} />
        </span>
      </button>

      <aside
        className="fixed top-0 left-0 z-40 h-full border-r flex flex-col overflow-hidden"
        style={{
          width: open ? SIDEBAR_OPEN_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          backgroundColor: "var(--gray-1)",
          borderColor: "var(--gray-6)",
        }}
      >
        {/* Logo area */}
        <div
          className="flex gap-4 items-center h-14 border-b shrink-0 overflow-hidden"
          style={{
            borderColor: "var(--gray-6)",
            paddingLeft: open ? 16 : 0,
            justifyContent: open ? "flex-start" : "center",
          }}
        >
          {open ? (
            <>
              <span
                className="text-sm font-semibold tracking-tight whitespace-nowrap"
                style={{ color: "var(--gray-12)" }}
              >
                Palette UI
              </span>
              <div>
                <a
                  href="https://github.com/alexbgh1/palette-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto mr-3 flex items-center justify-center rounded "
                  style={{ color: "var(--gray-11)" }}
                  title="GitHub"
                >
                  <Icon name="github" size={ICON_SIZES.md} />
                </a>
              </div>
            </>
          ) : (
            <span style={{ color: "var(--accent-9)" }}>
              <Icon name="menu" size={ICON_SIZES.md} />
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 pt-4 space-y-1 overflow-hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              data-active={true}
              className="sidebar-nav-item flex items-center gap-3 w-full rounded-lg cursor-pointer border-none whitespace-nowrap"
              style={{
                padding: open ? "8px 12px" : "8px",
                justifyContent: open ? "flex-start" : "center",
                backgroundColor: "var(--accent-4)",
                color: "var(--accent-11)",
              }}
              title={!open ? item.label : undefined}
            >
              <span className="shrink-0 inline-flex items-center justify-center" style={{ width: 16, height: 16 }}>
                <Icon name={item.icon} size={ICON_SIZES.md} />
              </span>
              {open && <span className="text-xs font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-2 border-t shrink-0" style={{ borderColor: "var(--gray-6)" }}>
          {/* Copy palette button */}
          <button
            data-copy-button
            onClick={onCopyClick}
            className={`flex items-center w-full rounded-lg cursor-pointer border-none ${open ? "gap-3 px-3 py-2" : "justify-center p-2"}`}
            style={{ backgroundColor: "var(--accent-9)", color: "var(--accent-contrast)" }}
            title="Copy palette"
          >
            <Icon name="download" size={ICON_SIZES.md} />
            {open && <span className="text-xs font-medium">Copy palette</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
