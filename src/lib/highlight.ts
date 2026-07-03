import Prism from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";

type HighlightLang = "css" | "scss" | "js" | "ts" | "json" | "tailwind-v3" | "tailwind-v4";

export function highlight(code: string, lang: HighlightLang): string {
  const prismLang =
    lang === "ts" ? "typescript" :
    lang === "js" || lang === "tailwind-v3" ? "javascript" :
    lang === "json" ? "json" :
    lang === "scss" ? "scss" :
    "css";
  const langs = Prism.languages as Record<string, unknown>;
  const grammar = (langs[prismLang] ?? langs.css) as Parameters<typeof Prism.highlight>[1];
  return Prism.highlight(code, grammar, prismLang);
}

const TOKEN_STYLES: Record<string, string> = {
  comment: "color:var(--gray-10)",
  keyword: "color:var(--accent-11)",
  string: "color:var(--accent-9)",
  number: "color:var(--gray-12)",
  boolean: "color:var(--accent-11)",
  function: "color:var(--accent-11)",
  selector: "color:var(--accent-12)",
  "attr-name": "color:var(--gray-12)",
  "attr-value": "color:var(--accent-9)",
  punctuation: "color:var(--gray-11)",
  operator: "color:var(--gray-11)",
  property: "color:var(--gray-12)",
  variable: "color:var(--gray-12)",
  tag: "color:var(--accent-11)",
  "string-property": "color:var(--gray-12)",
  constant: "color:var(--accent-9)",
};

export function applyStyles(html: string): string {
  return html.replace(
    /class="token ([^"]+)"/g,
    (_match, classes: string) => {
      const styles = classes
        .split(" ")
        .filter(Boolean)
        .flatMap((c) => {
          const style = TOKEN_STYLES[c];
          return style ? [style] : [];
        });

      if (styles.length === 0) return `class="token"`;
      return `class="token" style="${styles.join(";")}"`;
    },
  );
}

export function detectLang(format: string): HighlightLang {
  if (format === "scss") return "scss";
  if (format === "tailwind-v3") return "tailwind-v3";
  if (format === "tailwind-v4") return "tailwind-v4";
  if (format === "json") return "json";
  if (format === "ts") return "ts";
  return "css";
}