import type { CSSProperties } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  size?: "sm" | "md";
  className?: string;
  style?: CSSProperties;
}

export default function Checkbox({ checked, onChange, label, size = "md", className, style }: CheckboxProps) {
  const dim = size === "sm" ? 14 : 16;
  return (
    <label className={`flex items-center gap-2 cursor-pointer select-none ${className ?? ""}`} style={style}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className="flex items-center justify-center rounded shrink-0"
        style={{
          width: dim,
          height: dim,
          backgroundColor: checked ? "var(--accent-9)" : "transparent",
          border: `1.5px solid ${checked ? "var(--accent-9)" : "var(--gray-7)"}`,
        }}
      >
        {checked && (
          <svg width={dim - 4} height={dim - 4} viewBox="0 0 15 15" fill="none" aria-hidden>
            <path
              d="M11.5 3.5l-7 7-1.5-1.5"
              stroke="var(--accent-contrast)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {label && (
        <span className="text-xs" style={{ color: "var(--gray-12)" }}>
          {label}
        </span>
      )}
    </label>
  );
}
