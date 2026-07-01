import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "./Icon";

interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SelectProps<T extends string = string> {
  value: T;
  onChange: (v: T) => void;
  options: SelectOption<T>[];
  size?: "sm" | "md";
  className?: string;
}

export default function Select<T extends string = string>({
  value,
  onChange,
  options,
  size = "md",
  className,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const padding = size === "sm" ? "4px 10px" : "6px 10px";
  const fontSize = size === "sm" ? "11px" : "12px";

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-md cursor-pointer border"
        style={{
          padding,
          fontSize,
          borderColor: open ? "var(--accent-8)" : "var(--gray-6)",
          backgroundColor: "var(--gray-2)",
          color: "var(--gray-12)",
          boxShadow: open ? "0 0 0 2px var(--accent-4)" : "none",
        }}
      >
        <span className="flex items-center gap-1.5 truncate">
          {current?.icon}
          {current?.label ?? "-"}
        </span>
        <span className="ml-2 inline-flex items-center" style={{ transform: `rotate(${open ? 180 : 0}deg)` }}>
          <Icon name="chevron-down" size={size === "sm" ? 10 : 11} />
        </span>
      </button>
      {open && (
        <div
          className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border shadow-lg overflow-hidden"
          style={{ backgroundColor: "var(--gray-1)", borderColor: "var(--gray-6)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              data-active={opt.value === value}
              className="format-tab w-full text-left px-2.5 py-1.5 text-xs cursor-pointer border-none flex items-center gap-1.5"
              style={{
                backgroundColor: opt.value === value ? "var(--accent-4)" : "transparent",
                color: opt.value === value ? "var(--accent-11)" : "var(--gray-12)",
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
