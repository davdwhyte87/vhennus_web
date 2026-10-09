import React, { useMemo } from "react";

interface LinkifiedTextProps {
  text: string | null | undefined;
  className?: string;
  linkClassName?: string;
}

const URL_PATTERN = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)/gi;
const TRAILING_PUNCT = /[.,;:!?)\]}"'`]+$/;

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
      const href = /^www\./i.test(urlPart) ? `https://${urlPart}` : urlPart;
      out.push(
        <a
          key={`link-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={(e) => e.stopPropagation()}
          className={
            linkClassName ||
            "text-[#CC5A2A] underline decoration-[#CC5A2A]/40 underline-offset-2 break-all hover:text-[#0A1931]"
          }
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
