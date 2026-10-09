import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink, Play, Youtube } from "lucide-react";
import {
  extractUrls,
  faviconUrl,
  getDomain,
  getYouTubeVideoId,
  isImageUrl,
  isYouTubeUrl,
  previewKind,
  shortDisplayUrl,
  youtubeEmbedUrl,
  youtubeThumbnail,
} from "../utils/linkUtils";

interface LinkPreviewProps {
  text: string | null | undefined;
  /** post shows up to 3, chat/comment up to 2 to avoid spam */
  variant?: "post" | "chat" | "comment";
  maxLinks?: number;
}

interface OembedData {
  title?: string;
  author_name?: string;
}

/** Opportunistic YouTube title lookup. youtube/oembed is CORS-open;
 *  failure simply falls back to a generic label — never an error state. */
function useYouTubeMeta(videoId: string | null, watchUrl: string) {
  const [meta, setMeta] = useState<OembedData | null>(null);
  useEffect(() => {
    if (!videoId) return;
    const ctrl = new AbortController();
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      watchUrl
    )}&format=json`;
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || ctrl.signal.aborted) return;
        setMeta({
          title: typeof d.title === "string" ? d.title : undefined,
          author_name: typeof d.author_name === "string" ? d.author_name : undefined,
        });
      })
      .catch(() => {
        // CORS blocked or offline — fallback labels below cover this.
      });
    return () => ctrl.abort();
  }, [videoId, watchUrl]);
  return meta;
}

const YouTubeCard: React.FC<{ url: string }> = ({ url }) => {
  const videoId = getYouTubeVideoId(url);
  const [expanded, setExpanded] = useState(false);
  const meta = useYouTubeMeta(videoId, url);
  if (!videoId) return null;
  const thumb = youtubeThumbnail(videoId);

  if (expanded) {
    return (
      <div
        className="overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video w-full">
          <iframe
            src={youtubeEmbedUrl(videoId)}
            title={meta?.title || "YouTube video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2">
          <Youtube className="h-4 w-4 shrink-0 text-red-600" />
          <span className="truncate text-xs font-medium text-gray-800">
            {meta?.title || "YouTube video"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(true);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          setExpanded(true);
        }
      }}
      title="Play video"
    >
      <div className="relative bg-black">
        <img
          src={thumb}
          alt={meta?.title || "YouTube video thumbnail"}
          loading="lazy"
          className="aspect-video w-full object-cover opacity-95 transition-opacity group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 text-white" fill="currentColor" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
          YouTube
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
          {meta?.title || "YouTube video — tap to play"}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <Youtube className="h-3.5 w-3.5 shrink-0 text-red-600" />
          <span className="truncate">
            {meta?.author_name ? `${meta.author_name} • youtube.com` : "youtube.com"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ImageLinkCard: React.FC<{ url: string }> = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer nofollow"
    onClick={(e) => e.stopPropagation()}
    className="block overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-shadow hover:shadow-md"
  >
    <img
      src={url}
      alt="Linked image"
      loading="lazy"
      className="max-h-72 w-full object-cover"
      onError={(e) => {
        // If the image is dead, hide just the img — the generic card below still shows.
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
    <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500">
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{shortDisplayUrl(url)}</span>
    </div>
  </a>
);

const GenericLinkCard: React.FC<{ url: string }> = ({ url }) => {
  const domain = getDomain(url);
  const [faviconOk, setFaviconOk] = useState(true);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-3 rounded-xl border border-[#C9A86A]/50 bg-[#F5F5F0] px-3 py-2.5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
        {faviconOk ? (
          <img
            src={faviconUrl(url)}
            alt=""
            loading="lazy"
            className="h-6 w-6 object-contain"
            onError={() => setFaviconOk(false)}
          />
        ) : (
          <ExternalLink className="h-5 w-5 text-[#0A1931]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#0A1931]">{domain}</p>
        <p className="truncate text-xs text-gray-500">{shortDisplayUrl(url)}</p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
    </a>
  );
};

const LinkPreviewCard: React.FC<{ url: string }> = ({ url }) => {
  const kind = previewKind(url);
  if (isYouTubeUrl(url)) return <YouTubeCard url={url} />;
  if (kind === "image" || isImageUrl(url)) return <ImageLinkCard url={url} />;
  return <GenericLinkCard url={url} />;
};

const LinkPreview: React.FC<LinkPreviewProps> = ({
  text,
  variant = "post",
  maxLinks,
}) => {
  const limit = maxLinks ?? (variant === "post" ? 3 : 2);
  const urls = useMemo(() => {
    const raw = extractUrls(text, limit);
    // Defensive second pass: collapse same-video YouTube URLs that differ
    // only by host (youtu.be vs youtube.com) or tracking params (?si=, &t=).
    // extractUrls already does this, but this guards against future callers.
    const seenYt = new Set<string>();
    const seenHref = new Set<string>();
    const out: string[] = [];
    for (const u of raw) {
      const ytId = getYouTubeVideoId(u);
      if (ytId) {
        if (seenYt.has(ytId)) continue;
        seenYt.add(ytId);
      }
      if (seenHref.has(u)) continue;
      seenHref.add(u);
      out.push(u);
    }
    return out;
  }, [text, limit]);
  if (urls.length === 0) return null;
  return (
    <div
      className="mt-2 space-y-2"
      onClick={(e) => e.stopPropagation()}
    >
      {urls.map((u) => (
        <LinkPreviewCard key={u} url={u} />
      ))}
    </div>
  );
};

export default LinkPreview;
