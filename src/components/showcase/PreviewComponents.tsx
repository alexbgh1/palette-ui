import { useMemo, useState } from "react";
import { APPEARANCES, ICON_SIZES } from "../../constants";
import type { GeneratedPalette, Appearance } from "../../interfaces";

import Toggle from "../ui/Toggle";
import Checkbox from "../ui/Checkbox";
import Select from "../ui/Select";

import BlockquoteShowcase from "./BlockquoteShowcase";
import Icon from "../ui/Icon";

interface PreviewComponentsProps {
  palette: GeneratedPalette;
  appearance: Appearance;
  accentScale?: string[];
  grayScale?: string[];
}

export default function PreviewComponents({ palette, appearance, accentScale, grayScale }: PreviewComponentsProps) {
  // Form states
  const [devApi, setDevApi] = useState(true);
  const [beta, setBeta] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailDigests, setEmailDigests] = useState(false);
  const [activeTab, setActiveTab] = useState("Members");
  const [role, setRole] = useState("Viewer");

  const cssVars = useMemo(() => {
    const a = accentScale ?? palette.accentScale;
    const aa = palette.accentScaleAlpha;
    const g = grayScale ?? palette.grayScale;
    const sel = appearance === APPEARANCES.dark ? ".dark-preview" : ".light-preview";
    const lines: string[] = [];
    a.forEach((v, i) => lines.push(`  --accent-${i + 1}: ${v};`));
    aa.forEach((v, i) => lines.push(`  --accent-a${i + 1}: ${v};`));
    g.forEach((v, i) => lines.push(`  --gray-${i + 1}: ${v};`));
    lines.push(`  --accent-contrast: ${palette.accentContrast};`);
    return `${sel} {\n${lines.join("\n")}\n}`;
  }, [palette, appearance, accentScale, grayScale]);

  return (
    <section>
      <style>{`
        .search-field:hover { border-color: var(--gray-7) !important; }
        .search-field:focus-within { border-color: var(--accent-8) !important; box-shadow: 0 0 0 2px var(--accent-4); }
        .hover-accent-btn { background-color: var(--accent-9); color: var(--accent-contrast); }
        .hover-accent-btn:hover { background-color: var(--accent-10); }
        .user-row:hover { background-color: var(--gray-2); border-color: var(--gray-5); }
        .icon-btn-hover:hover { background-color: var(--gray-3); color: var(--gray-12) !important; }
        ${cssVars}
      `}</style>

      <div className={appearance === APPEARANCES.dark ? "dark-preview" : "light-preview"}>
        <div
          className="rounded-xl border p-6"
          style={{ backgroundColor: palette.background, borderColor: "var(--gray-6)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* --- COLUMN 1: Controls, Navigation & Text --- */}
            <div className="space-y-6 flex flex-col">
              {/* Tabs */}
              <div className="flex gap-0 border-b text-xs w-full" style={{ borderColor: "var(--gray-6)" }}>
                {["Overview", "Members", "Settings"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="flex-1 px-2 py-2 border-b-2 font-medium cursor-pointer bg-transparent text-center"
                    style={{
                      borderColor: t === activeTab ? "var(--accent-9)" : "transparent",
                      color: t === activeTab ? "var(--accent-11)" : "var(--gray-11)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Toggles & Checkboxes Card */}
              <div
                className="rounded-xl p-4 space-y-4"
                style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-5)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium" style={{ color: "var(--gray-12)" }}>
                    Developer API
                  </span>
                  <Toggle checked={devApi} onChange={() => setDevApi((v) => !v)} ariaLabel="Developer API" />
                </div>
                <div className="h-px" style={{ backgroundColor: "var(--gray-4)" }} />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium" style={{ color: "var(--gray-11)" }}>
                    Beta features
                  </span>
                  <Toggle checked={beta} onChange={() => setBeta((v) => !v)} ariaLabel="Beta features" />
                </div>
                <div className="h-px" style={{ backgroundColor: "var(--gray-4)" }} />
                <div className="space-y-2">
                  <span className="text-[11px] font-medium mb-1 block" style={{ color: "var(--gray-11)" }}>
                    Notifications
                  </span>
                  <Checkbox checked={pushNotifs} onChange={() => setPushNotifs((v) => !v)} label="Push notifications" />
                  <Checkbox checked={emailDigests} onChange={() => setEmailDigests((v) => !v)} label="Email digests" />
                </div>
              </div>

              {/* Keyword Text */}
              <BlockquoteShowcase />
            </div>

            {/* --- COLUMN 2: Central Showcase (Directory) --- */}
            <div>
              <div
                className="rounded-xl border shadow-sm flex flex-col mb-6"
                style={{ backgroundColor: "var(--gray-1)", borderColor: "var(--gray-5)" }}
              >
                <div className="p-4 border-b space-y-4" style={{ borderColor: "var(--gray-5)" }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--gray-12)" }}>
                      Team Directory
                    </h3>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer border-none hover-accent-btn">
                      Invite
                    </button>
                  </div>

                  {/* Search & Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label
                      className="search-field flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs cursor-text border min-w-0"
                      style={{
                        backgroundColor: "var(--gray-2)",
                        borderColor: "var(--gray-6)",
                        color: "var(--gray-11)",
                      }}
                    >
                      <Icon name="search" size={ICON_SIZES.sm} />
                      <input
                        type="search"
                        placeholder="Search users..."
                        className="flex-1 bg-transparent border-none outline-none text-xs min-w-0"
                        style={{ color: "var(--gray-12)" }}
                      />
                    </label>

                    <div className="flex gap-2 shrink-0">
                      {/* Role Select */}
                      <Select<string>
                        value={role}
                        onChange={setRole}
                        options={[
                          { value: "Admin", label: "Admin" },
                          { value: "Editor", label: "Editor" },
                          { value: "Viewer", label: "Viewer" },
                        ]}
                        size="md"
                      />

                      {/* Icon Action Button */}
                      <button
                        className="p-1.5 rounded-md cursor-pointer border flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "var(--gray-2)",
                          borderColor: "var(--gray-6)",
                          color: "var(--gray-11)",
                        }}
                        title="Options"
                      >
                        <Icon name="more-horizontal" size={ICON_SIZES.sm} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div className="p-2 space-y-1">
                  <div>
                    {[
                      { n: "Emily Adams", e: "emily@example.com", r: "Admin" },
                      { n: "John Smith", e: "john@example.com", r: "Editor" },
                      { n: "Sarah Connor", e: "sarah@example.com", r: "Viewer" },
                    ].map((item) => (
                      <div
                        key={item.e}
                        className="user-row flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg border border-transparent cursor-default"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ backgroundColor: "var(--accent-4)", color: "var(--accent-11)" }}
                          >
                            {item.n.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-medium truncate" style={{ color: "var(--gray-12)" }}>
                              {item.n}
                            </div>
                            <div className="text-[10px] truncate" style={{ color: "var(--gray-11)" }}>
                              {item.e}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1 sm:mt-0 sm:ml-auto">
                          <span
                            className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                            style={{ backgroundColor: "var(--gray-3)", color: "var(--gray-11)" }}
                          >
                            {item.r}
                          </span>
                          {/* Row actions */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              className="icon-btn-hover p-1.5 rounded cursor-pointer border-none bg-transparent"
                              style={{ color: "var(--gray-9)" }}
                            >
                              <span className="sr-only">Edit user</span>
                              <Icon name="edit" size={ICON_SIZES.xs} />
                            </button>
                            <button
                              className="icon-btn-hover p-1.5 rounded cursor-pointer border-none bg-transparent"
                              style={{ color: "var(--gray-9)" }}
                            >
                              <span className="sr-only">Remove user</span>
                              <Icon name="trash" size={ICON_SIZES.xs} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Note */}
              <div
                className="border-l-4 flex flex-col gap-2 text-[11px] mt-2 leading-relaxed p-3 rounded-tl-xl font-medium"
                style={{
                  backgroundColor: "var(--accent-2)",
                  borderColor: "var(--accent-6)",
                }}
              >
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-semibold" style={{ color: "var(--accent-11)" }}>
                    Note
                  </h4>
                </div>

                {/* Note-Accent */}
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent-10)" }}></div>
                  <p style={{ color: "var(--accent-11)" }}>
                    Use{" "}
                    <span className="font-mono font-light" style={{ color: "var(--accent-12)" }}>
                      --accent-*
                    </span>{" "}
                    tokens for primary actions, states, and highlights.
                  </p>
                </div>

                {/* Note-Gray */}
                <div className="flex items-center gap-4">
                  <div
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--gray-10)", color: "var(--gray-11)" }}
                  ></div>
                  <p style={{ color: "var(--gray-11)" }}>
                    Use{" "}
                    <span className="font-mono font-light" style={{ color: "var(--gray-12)" }}>
                      --gray-*
                    </span>{" "}
                    for structure, borders, and secondary text.
                  </p>
                </div>
              </div>
            </div>

            {/* --- COLUMN 3: Forms, Badges & Misc --- */}
            <div className="space-y-6 flex flex-col">
              {/* Sign up form */}
              <div
                className="rounded-xl p-4 space-y-4 shadow-sm"
                style={{ backgroundColor: "var(--gray-1)", border: "1px solid var(--gray-5)" }}
              >
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--gray-12)" }}>
                    Create project
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--gray-11)" }}>
                    Deploy a new repository.
                  </p>
                </div>

                <div className="space-y-3">
                  {["Project name", "Framework"].map((lbl) => (
                    <div key={lbl}>
                      <label className="text-[11px] font-medium mb-1 block" style={{ color: "var(--gray-11)" }}>
                        {lbl}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${lbl.toLowerCase()}`}
                        className="w-full px-2.5 py-1.5 rounded-md text-xs outline-none"
                        style={{
                          backgroundColor: "var(--gray-1)",
                          border: "1px solid var(--gray-6)",
                          color: "var(--gray-12)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "var(--accent-8)";
                          e.target.style.boxShadow = "0 0 0 2px var(--accent-4)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "var(--gray-6)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  ))}
                  <button className="hover-accent-btn w-full py-2 mt-2 rounded-md text-xs font-medium cursor-pointer border-none">
                    Deploy
                  </button>
                </div>
              </div>

              {/* Tags/Badges */}
              <div className="flex gap-2 flex-wrap">
                {["Fully-featured", "Accessible", "Banana"].map((t, i) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                    style={{
                      backgroundColor: i === 0 ? "var(--accent-4)" : "var(--gray-3)",
                      color: i === 0 ? "var(--accent-11)" : "var(--gray-11)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="h-px" style={{ backgroundColor: "var(--gray-6)" }} />

              <p className="text-[11px]" style={{ color: "var(--gray-11)" }}>
                Inspired by Radix Colors —{" "}
                <a
                  href="https://radix-ui.com/colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium no-underline"
                  style={{ color: "var(--accent-11)" }}
                >
                  Learn more →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
