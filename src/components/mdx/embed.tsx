// Embed (MDX-callable, / constraint): the single embed component.
// Sandboxed, lazy, no-referrer iframe; host MUST be in config.embeds
//.allowlist — enforced at build time by the renderer (un-allowlisted hosts
// fail loudly,). height optional (default 9:16-friendly 400px).
"use client";

import { getConfig } from "~/lib/get-config";

// Parse the host of an embed URL; unparseable input yields a sentinel that
// can never appear in the allowlist, so garbage URLs fail the loud path.
function parseEmbedHost(url: string): string {
  try {
    return new URL(url, "https://publicai.ch").host;
  } catch {
    return "(unparseable URL)";
  }
}

export function Embed({ url, title, height = 400 }: { url: string; title: string; height?: number }) {
  const allowedHosts = getConfig().embeds.allowlist;
  const host = parseEmbedHost(url);
  if (!host || !allowedHosts.includes(host)) {
    // Loud failure at render (build + dev): allowlist violations are build
    // errors per/, not silent omissions.
    throw new Error(`Embed host "${host}" is not in config.json embeds.allowlist: ${url}`);
  }
  return (
    <div className="embed">
      <iframe
        src={url}
        title={title}
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}