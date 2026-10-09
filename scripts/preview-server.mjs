// Static preview server for the prerendered client output (e2e + manual
// `yarn preview`): serves build/client with directory-index + trailing-slash
// resolution and falls back to __spa-fallback.html for unknown URLs (the
// React Router SPA-fallback file hydrates the client router — same behaviour
// as a static host). Zero dependencies; node:http only.
import { createServer } from "node:http";
import { statSync, readFileSync, existsSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import process from "node:process";

const ROOT = resolve(process.cwd(), "build/client");
const PORT = Number(process.env.PORT ?? 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function serveFile(res, file, status = 200) {
  const body = readFileSync(file);
  res.writeHead(status, {
    "content-type": MIME[extname(file)] ?? "application/octet-stream",
    "content-length": body.length,
  });
  res.end(body);
}

const server = createServer((req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);
    if (!pathname.endsWith("/") && !extname(pathname)) pathname += "/";
    const trimmed = pathname.replace(/\/$/, "");
    const asIndex = join(ROOT, normalize(`${trimmed}/index.html`.replace(/^\/+/, "")));
    if (existsSync(asIndex) && statSync(asIndex).isFile()) {
      serveFile(res, asIndex);
      return;
    }
    const asFile = join(ROOT, normalize(trimmed.replace(/^\//, "")));
    if (trimmed !== "" && existsSync(asFile) && statSync(asFile).isFile()) {
      serveFile(res, asFile);
      return;
    }
    // Unknown URL → SPA fallback (client router renders the localized 404).
    serveFile(res, join(ROOT, "__spa-fallback.html"), 404);
  } catch {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Internal Server Error");
  }
});

server.listen(PORT, () => {
  process.stdout.write(`[preview] serving ${ROOT} on http://localhost:${PORT}\n`);
});