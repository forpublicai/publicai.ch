// FigureRow (MDX-callable): two to four images side by side, each with
// figure semantics, a required alt and an optional caption. Clicking an
// image opens it full size in an overlay on the same page (native modal
// <dialog>: ESC, the close button or a click on the backdrop close it, and
// focus returns to the image). Each image is still a real link to its
// file, so modified clicks (new tab) and no-JS visitors get the file.
// Stacks to one column on small screens. Images are site-absolute paths
// and are verified by the link checker like Figure.
"use client";

import { useRef, useState, type MouseEvent } from "react";
import { useLocation } from "react-router";
import { chromeStrings } from "~/lib/chrome-strings";
import { localeFromPath } from "~/lib/locale";

export type FigureRowItem = {
  src: string;
  alt: string;
  caption?: string;
};

export function FigureRow({ figures }: { figures: readonly FigureRowItem[] }) {
  const locale = localeFromPath(useLocation().pathname);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<FigureRowItem | null>(null);

  function openOverlay(event: MouseEvent<HTMLAnchorElement>, figure: FigureRowItem): void {
    // Let the browser handle new-tab / new-window / download clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    setActive(figure);
    dialog.showModal();
  }

  function closeOverlay(): void {
    dialogRef.current?.close();
  }

  // A click that lands on the <dialog> element itself (not on the image or
  // caption inside it) is a click on the backdrop.
  function onDialogClick(event: MouseEvent<HTMLDialogElement>): void {
    if (event.target === event.currentTarget) closeOverlay();
  }

  return (
    <>
      <div className="figure-row">
        {figures.map((figure) => (
          <figure key={figure.src} className="figure-row__item">
            <a
              href={figure.src}
              target="_blank"
              rel="noopener noreferrer"
              className="figure-row__link"
              onClick={(event) => openOverlay(event, figure)}
            >
              <img src={figure.src} alt={figure.alt} loading="lazy" />
            </a>
            {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className="figure-lightbox"
        aria-label={active?.caption ?? active?.alt}
        onClick={onDialogClick}
        onClose={() => setActive(null)}
      >
        <button type="button" className="figure-lightbox__close" onClick={closeOverlay}>
          <span aria-hidden="true">×</span>
          <span className="visually-hidden">{chromeStrings.figure.close[locale]}</span>
        </button>
        {active ? (
          <figure className="figure-lightbox__figure">
            <img src={active.src} alt={active.alt} />
            {active.caption ? <figcaption>{active.caption}</figcaption> : null}
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
