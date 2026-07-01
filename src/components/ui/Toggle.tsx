import type { CSSProperties } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export default function Toggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className,
  style,
  ariaLabel,
}: ToggleProps) {
  const w = size === "sm" ? 24 : 28;
  const h = size === "sm" ? 14 : 16;
  const knob = size === "sm" ? 10 : 12;
  const offset = 2;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={className}
      style={{
        position: "relative",
        flexShrink: 0,
        width: w,
        height: h,
        borderRadius: h / 2,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: disabled
          ? "var(--gray-4)"
          : checked
            ? "var(--accent-9)"
            : "var(--gray-5)",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color 150ms ease, opacity 150ms ease",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: offset,
          width: knob,
          height: knob,
          borderRadius: "50%",
          backgroundColor: "var(--accent-contrast)",
          left: checked ? w - knob - offset : offset,
          transition: "left 150ms ease",
        }}
      />
    </button>
  );
}