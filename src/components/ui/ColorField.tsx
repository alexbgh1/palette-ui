import { useState } from "react";
import { sanitizeHex, isValidHex, isValidHex6 } from "../../lib/hex";
import { stripHash } from "../../lib/color";
import { COLOR_PICKER_SIZE } from "../../constants";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export default function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const displayed = draft ?? value;

  const handleChange = (raw: string) => {
    const v = sanitizeHex(raw);
    setDraft(v);
    if (isValidHex(v)) {
      onChange(v);
    }
  };

  const handleBlur = () => {
    setDraft(null);
  };

  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-medium block" style={{ color: "var(--gray-11)" }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isValidHex6(value) ? `#${value}` : "#000000"}
          onChange={(e) => onChange(stripHash(e.target.value))}
          className={`${COLOR_PICKER_SIZE} border rounded cursor-pointer shrink-0`}
          style={{ borderColor: "var(--gray-6)" }}
        />
        <div
          className="flex-1 flex items-center border rounded overflow-hidden"
          style={{ borderColor: "var(--gray-6)", backgroundColor: "var(--gray-2)" }}
        >
          <span
            className="px-2 py-1.5 text-sm font-mono border-r shrink-0"
            style={{ borderColor: "var(--gray-6)", color: "var(--gray-11)", backgroundColor: "var(--gray-3)" }}
          >
            #
          </span>
          <input
            type="text"
            value={displayed}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setDraft(value)}
            onBlur={handleBlur}
            className="flex-1 px-2 py-1.5 text-sm font-mono bg-transparent border-none outline-none"
            style={{ color: "var(--gray-12)" }}
          />
        </div>
      </div>
    </div>
  );
}
