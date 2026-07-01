interface BlockquoteProps {
  highContrast?: boolean;
}

export default function BlockquoteShowcase() {
  return (
    <div className="flex flex-col gap-4">
      <Blockquote />
      <Blockquote highContrast />
    </div>
  );
}

function Blockquote({ highContrast = false }: BlockquoteProps) {
  return (
    <blockquote
      className="pl-4 border-l-2 text-sm leading-relaxed"
      style={{
        borderColor: highContrast ? "var(--gray-8)" : "var(--accent-9)",
        color: highContrast ? "var(--gray-11)" : "var(--gray-12)",
      }}
    >
      Originating from a{" "}
      <QuoteLink highContrast={highContrast} href="https://en.wikipedia.org/wiki/De_finibus_bonorum_et_malorum">
        Ciceronian text
      </QuoteLink>{" "}
      from 45 BC, the famous{" "}
      <QuoteLink highContrast={highContrast} href="https://en.wikipedia.org/wiki/Lorem_ipsum">
        Lorem Ipsum
      </QuoteLink>{" "}
      serves as the industry's standard.
    </blockquote>
  );
}

function QuoteLink({
  href,
  children,
  highContrast,
}: {
  href: string;
  children: React.ReactNode;
  highContrast: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-1 underline-offset-2"
      style={{
        color: highContrast ? "var(--gray-12)" : "var(--accent-11)",
        textDecorationColor: highContrast ? "var(--gray-8)" : "var(--accent-7)",
      }}
    >
      {children}
    </a>
  );
}
