interface SliderFieldProps {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

export default function SliderField({ label, value, display, min, max, step, onChange }: SliderFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="text-[11px]" style={{ color: "var(--gray-11)" }}>
          {label}
        </span>
        <span className="text-[11px] font-mono" style={{ color: "var(--accent-11)" }}>
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{ background: "var(--gray-3)" }}
      />
    </div>
  );
}
