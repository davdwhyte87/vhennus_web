import React, { useMemo } from "react";

interface LinkifiedTextProps {
  text: string | null | undefined;
  className?: string;
  linkClassName?: string;
}

const URL_PATTERN = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+|(?<![\w@/:.-])((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?(?:\/[^\s<>"')\]]*)?))/gi;
const TRAILING_PUNCT = /[.,;:!?)\]}"'`]+$/;

// Inline style (not Tailwind classes) so the default link look renders even if
// the CSS bundle is stale — color/decoration must always apply.
const DEFAULT_LINK_STYLE: React.CSSProperties = {
  color: '#2563EB',
  textDecorationLine: 'underline',
  textDecorationColor: 'rgba(37, 99, 235, 0.45)',
  textUnderlineOffset: '2px',
  overflowWrap: 'anywhere',
};

/** Render plain text with URLs turned into safe external links. */
const LinkifiedText: React.FC<LinkifiedTextProps> = ({
  text,
  className = "",
  linkClassName = "",
}) => {
  const parts = useMemo(() => {
    if (!text) return [];
    const out: React.ReactNode[] = [];
    URL_PATTERN.lastIndex = 0;
    let last = 0;
    let m: RegExpExecArray | null;
    let key = 0;
    while ((m = URL_PATTERN.exec(text)) !== null) {
      const start = m.index;
      if (start > last) out.push(text.slice(last, start));
      const raw = m[0];
      const trailingMatch = raw.match(TRAILING_PUNCT);
      const trailing = trailingMatch ? trailingMatch[0] : "";
      const urlPart = trailing ? raw.slice(0, -trailing.length) : raw;
      const href = /^https?:\/\//i.test(urlPart) ? urlPart : `https://${urlPart}`;
      out.push(
        <a
          key={`link-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={(e) => e.stopPropagation()}
          className={linkClassName || undefined}
          style={linkClassName ? undefined : DEFAULT_LINK_STYLE}
        >
          {urlPart}
        </a>
      );
      if (trailing) out.push(trailing);
      last = start + raw.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }, [text, linkClassName]);

  return <span className={className}>{parts}</span>;
};

export default LinkifiedText;
