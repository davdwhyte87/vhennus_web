// Frontend-only link helpers. No backend, no CORS-sensitive fetches.
// Generic sites can't be scraped from the browser, so we render:
// - YouTube -> thumbnail (i.ytimg.com, CORS-free <img>) + click-to-play iframe
// - Direct images -> <img>
// - Anything else -> favicon + domain card (all <img>, no fetch)

const URL_PATTERN = /(https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+)/gi;
const TRAILING_PUNCT = /[.,;:!?)\]}"'`]+$/;

export function normalizeUrl(raw: string): string {
  let u = raw.trim();
  if (/^www\./i.test(u)) return `https://${u}`;
  return u;
}

function cleanMatch(match: string): string {
  // Strip trailing punctuation that is rarely part of the URL
  // (handles "check this out https://x.com." and "(https://x.com)")
  let s = match.replace(TRAILING_PUNCT, "");
  // Balance: if we stripped a closing bracket but the URL contains
  // an opening one, keep it simple and leave the stripped version.
  return s;
}

/** Extract up to `max` unique, normalized URLs from free text. */
export function extractUrls(text: string | null | undefined, max = 3): string[] {
  if (!text) return [];
  const seenHref = new Set<string>();
  const seenYouTubeIds = new Set<string>();
  const out: string[] = [];
  // Reset lastIndex since the regex is global
  URL_PATTERN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = URL_PATTERN.exec(text)) !== null && out.length < max) {
    const cleaned = cleanMatch(m[0]);
    if (!cleaned) continue;
    const normalized = normalizeUrl(cleaned);
    try {
      const parsed = new URL(normalized);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue;
      if (!parsed.hostname.includes(".")) continue;
      // Dedupe YouTube by videoId so the same video pasted as
      // youtube.com/watch, youtu.be, /shorts/, /embed/, etc. only
      // produces ONE preview card (previously showed 2 thumbnails).
      const ytId = getYouTubeVideoId(parsed.href);
      if (ytId) {
        if (seenYouTubeIds.has(ytId)) continue;
        seenYouTubeIds.add(ytId);
      }
      if (!seenHref.has(parsed.href)) {
        seenHref.add(parsed.href);
        out.push(parsed.href);
      }
    } catch {
      // ignore unparseable matches
    }
  }
  return out;
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
}

export function shortDisplayUrl(url: string, maxLen = 48): string {
  try {
    const parsed = new URL(url);
    const stripped =
      parsed.hostname.replace(/^www\./i, "") +
      (parsed.pathname !== "/" ? parsed.pathname : "") +
      parsed.search;
    const clean = stripped.replace(/\/$/, "");
    return clean.length > maxLen ? `${clean.slice(0, maxLen - 1)}…` : clean;
  } catch {
    return url.length > maxLen ? `${url.slice(0, maxLen - 1)}…` : url;
  }
}

/** Favicon via Google's s2 service — loads as <img>, no CORS/fetch needed. */
export function faviconUrl(url: string, size = 64): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
    getDomain(url)
  )}&sz=${size}`;
}

// ---------- YouTube ----------

export function getYouTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\.|^m\./, "");
  const valid = (id: string | null | undefined): string | null => {
    if (!id) return null;
    const clean = id.split(/[?&#/]/)[0];
    return /^[A-Za-z0-9_-]{6,32}$/.test(clean) ? clean : null;
  };

  if (host === "youtu.be") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return valid(id);
  }
  if (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtube-nocookie.com") {
    const path = parsed.pathname;
    if (path === "/watch" || path.startsWith("/watch/")) {
      return valid(parsed.searchParams.get("v"));
    }
    for (const prefix of ["/shorts/", "/embed/", "/live/", "/v/"]) {
      if (path.startsWith(prefix)) {
        return valid(path.slice(prefix.length).split("/")[0]);
      }
    }
  }
  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return getYouTubeVideoId(url) !== null;
}

export function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// ---------- Direct images ----------

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp)(\?.*)?$/i;

export function isImageUrl(url: string): boolean {
  try {
    return IMAGE_EXT.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

export type PreviewKind = "youtube" | "image" | "link";

export function previewKind(url: string): PreviewKind {
  if (isYouTubeUrl(url)) return "youtube";
  if (isImageUrl(url)) return "image";
  return "link";
}
