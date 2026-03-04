"use client";

import { useEffect, useRef, useState } from "react";

type Deck = {
  id: string;
  title: string;
  path: string;
};

declare global {
  interface Window {
    Reveal?: any;
    RevealMarkdown?: any;
  }
}

function splitSlides(markdown: string): string[] {
  return markdown
    .split(/\n---\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.md$/i, "")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeDecks(raw: any[]): Deck[] {
  return raw
    .filter(
      (deck) => typeof deck?.path === "string" && deck.path.endsWith(".md"),
    )
    .map((deck) => {
      const path: string = deck.path.startsWith("./")
        ? deck.path
        : `./${deck.path}`;
      const filename = path.split("/").pop() ?? "";
      return {
        id: deck.id || filename.replace(/\.md$/i, ""),
        title: deck.title || titleFromFilename(filename),
        path,
      };
    });
}

function uniqueDecks(decks: Deck[]): Deck[] {
  const seen = new Set<string>();
  return decks.filter((deck) => {
    const key = `${deck.id}::${deck.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function loadManifestDecks(): Promise<Deck[]> {
  const response = await fetch("/presentations/manifest.json", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Could not load presentations manifest.");
  }
  const data = await response.json();
  const decks = normalizeDecks(data.decks || []);
  if (!decks.length) {
    throw new Error("No decks found in manifest.");
  }
  return decks;
}

async function filterExistingDecks(decks: Deck[]): Promise<Deck[]> {
  const checks = await Promise.all(
    decks.map(async (deck) => {
      try {
        const response = await fetch(`/presentations/${deck.path.slice(2)}`, {
          cache: "no-store",
        });
        return response.ok ? deck : null;
      } catch {
        return null;
      }
    }),
  );
  return checks.filter((d): d is Deck => Boolean(d));
}

async function loadDeckContent(deck: Deck): Promise<string> {
  const response = await fetch(`/presentations/${deck.path.slice(2)}`);
  if (!response.ok) {
    throw new Error("Could not load deck markdown file.");
  }
  return response.text();
}

export default function PresentationsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const slidesRootRef = useRef<HTMLDivElement | null>(null);
  const revealInstanceRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function initDecks() {
      try {
        const manifestDecks = await loadManifestDecks();
        const existing = await filterExistingDecks(manifestDecks);
        if (!existing.length) {
          throw new Error("No markdown files found in /presentations.");
        }
        if (cancelled) return;
        const unique = uniqueDecks(existing).sort((a, b) =>
          a.title.localeCompare(b.title),
        );
        setDecks(unique);
        const first = unique[0];
        setSelectedId(first.id);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to load presentations.");
        }
      }
    }

    initDecks();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedId || !decks.length) return;

    let cancelled = false;

    async function loadAndRender() {
      const chosen = decks.find((d) => d.id === selectedId) ?? decks[0];
      if (!chosen) return;

      try {
        const md = await loadDeckContent(chosen);
        if (cancelled) return;
        setMarkdown(md);

        const chunks = splitSlides(md);
        const root = slidesRootRef.current;
        if (!root) return;
        root.innerHTML = "";
        chunks.forEach((chunk) => {
          const section = document.createElement("section");
          section.setAttribute("data-markdown", "");
          const textarea = document.createElement("textarea");
          textarea.setAttribute("data-template", "");
          textarea.textContent = chunk;
          section.appendChild(textarea);
          root.appendChild(section);
        });

        if (!window.Reveal || !window.RevealMarkdown) {
          return;
        }

        if (revealInstanceRef.current) {
          revealInstanceRef.current.destroy();
          revealInstanceRef.current = null;
        }

        const Reveal = window.Reveal;
        const RevealMarkdown = window.RevealMarkdown;
        const instance = new Reveal({
          embedded: true,
          hash: false,
          controls: true,
          progress: true,
          center: true,
          disableLayout: false,
          margin: 0.08,
          minScale: 0.4,
          maxScale: 1.2,
          plugins: [RevealMarkdown],
        });
        await instance.initialize();
        revealInstanceRef.current = instance;
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to load presentation.");
        }
      }
    }

    loadAndRender();

    return () => {
      cancelled = true;
    };
  }, [selectedId, decks]);

  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js" />
      <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/plugin/markdown/markdown.js" />

      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/public-ai-logo.png"
                alt="Public AI logo"
                className="h-6 w-auto"
              />
              <h1 className="text-sm font-semibold text-slate-900">
                Presentations
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="deckSelect" className="text-slate-600">
                Deck
              </label>
              <select
                id="deckSelect"
                className="rounded-md border border-slate-300 bg-white px-2
                           py-1 text-xs text-slate-900"
                value={selectedId ?? ""}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                {decks.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    {deck.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-3 px-4 py-3 md:flex-row">
          <section className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Slides
            </div>
            <div className="relative flex-1 bg-black">
              <img
                src="/assets/public-ai-logo.png"
                alt="Public AI"
                className="pointer-events-none absolute right-3 top-3 h-6 w-auto opacity-90"
              />
              <div className="reveal h-full">
                <div
                  className="slides h-full"
                  ref={slidesRootRef}
                />
              </div>
            </div>
          </section>

          <section className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Markdown source
            </div>
            <pre className="flex-1 overflow-auto bg-slate-50 p-4 text-xs text-slate-800">
              {markdown}
            </pre>
          </section>
        </main>

        {error && (
          <div className="mx-auto mb-4 max-w-5xl px-4 text-xs text-red-600">
            {error}
          </div>
        )}
      </div>
    </>
  );
}

