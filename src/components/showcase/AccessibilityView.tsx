import { useMemo } from "react";
import Color from "colorjs.io";
import { WCAG_LARGE_TEXT_RATIO, WCAG_AA_RATIO, WCAG_AAA_RATIO } from "../../constants";

interface AccessibilityViewProps {
  accentScale: string[];
  grayScale: string[];
  accentContrast: string;
}

function getRatio(bg: string, text: string): number {
  try {
    return +new Color(bg).contrastWCAG21(new Color(text)).toFixed(2);
  } catch {
    return 0;
  }
}

function ContrastBadge({ ratio }: { ratio: number }) {
  const passAAA = ratio >= WCAG_AAA_RATIO;
  const passAA = ratio >= WCAG_AA_RATIO && ratio < WCAG_AAA_RATIO;
  const passLarge = ratio >= WCAG_LARGE_TEXT_RATIO && ratio < WCAG_AA_RATIO;

  const isPass = passAAA || passAA;

  return (
    <span
      className="w-12 inline-block text-right text-[9px] font-mono px-1 py-0.5 rounded tracking-wide shrink-0"
      style={{
        backgroundColor: isPass ? "var(--accent-3)" : "var(--gray-3)",
        color: isPass ? "var(--accent-11)" : passLarge ? "var(--gray-11)" : "var(--gray-9)",
      }}
    >
      {passAAA ? "AAA ✓✓" : passAA ? "AA ✓" : passLarge ? "AA lg" : "Fail"}
    </span>
  );
}

function ContrastRow({
  bgName,
  textName,
  bgHex,
  textHex,
}: {
  bgName: string;
  textName: string;
  bgHex: string;
  textHex: string;
}) {
  const ratio = getRatio(bgHex, textHex);

  return (
    <div
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
      style={{ backgroundColor: "var(--gray-2)", border: "1px solid var(--gray-5)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-8 h-8 rounded-md shrink-0 flex items-center justify-center text-[10px] font-mono font-bold"
          style={{ backgroundColor: bgHex, color: textHex, border: "1px solid var(--gray-4)" }}
        >
          Aa
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono" style={{ color: "var(--gray-12)" }}>
            {textName}
          </span>
          <span className="text-[9px] font-mono" style={{ color: "var(--gray-10)" }}>
            on {bgName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-mono" style={{ color: "var(--gray-12)" }}>
          {ratio}:1
        </span>
        <ContrastBadge ratio={ratio} />
      </div>
    </div>
  );
}

export default function AccessibilityView({ accentScale, grayScale, accentContrast }: AccessibilityViewProps) {
  const canonicalPairs = useMemo(() => {
    return [
      { bg: 1, text: 11, type: "accent" },
      { bg: 2, text: 11, type: "accent" },
      { bg: 3, text: 11, type: "accent" },
      { bg: 9, text: "contrast", type: "accent" },
      { bg: 1, text: 11, type: "gray" },
      { bg: 2, text: 11, type: "gray" },
      { bg: 3, text: 12, type: "gray" },
    ];
  }, []);

  const crossScalePairs = useMemo(() => {
    return [
      { bgName: "gray-1", textName: "accent-11", bgHex: grayScale[0], textHex: accentScale[10] },
      { bgName: "gray-2", textName: "accent-11", bgHex: grayScale[1], textHex: accentScale[10] },
      { bgName: "gray-3", textName: "accent-11", bgHex: grayScale[2], textHex: accentScale[10] },
      { bgName: "accent-3", textName: "gray-12", bgHex: accentScale[2], textHex: grayScale[11] },
      { bgName: "accent-4", textName: "gray-12", bgHex: accentScale[3], textHex: grayScale[11] },
      { bgName: "accent-9", textName: "gray-1", bgHex: accentScale[8], textHex: grayScale[0] },
    ];
  }, [accentScale, grayScale]);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--gray-11)" }}>
              Canonical Pairs
            </h3>
            <p className="text-[11px] mt-1 mb-4" style={{ color: "var(--gray-10)" }}>
              Standard text and background combinations within the same scale.
            </p>
          </div>

          <div className="space-y-2">
            {canonicalPairs.map(({ bg, text, type }, i) => {
              const scale = type === "accent" ? accentScale : grayScale;
              const bgHex = scale[bg - 1];
              const textHex = text === "contrast" ? accentContrast : scale[(text as number) - 1];
              const textName = text === "contrast" ? "contrast" : `${type}-${text}`;

              return (
                <ContrastRow
                  key={`${type}-${i}`}
                  bgName={`${type}-${bg}`}
                  textName={textName}
                  bgHex={bgHex}
                  textHex={textHex}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--gray-11)" }}>
              Cross-scale
            </h3>
            <p className="text-[11px] mt-1 mb-4" style={{ color: "var(--gray-10)" }}>
              Accent elements placed over structural gray backgrounds.
            </p>
          </div>

          <div className="space-y-2">
            {crossScalePairs.map((pair, i) => (
              <ContrastRow key={`cross-${i}`} {...pair} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[11px] mt-3" style={{ color: "var(--gray-10)" }}>
        Web Content Accessibility Guidelines (WCAG) is a set of guidelines for ensuring web content is accessible to
        people with disabilities.
      </p>
    </section>
  );
}
