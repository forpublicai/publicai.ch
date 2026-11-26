// FigureRow (MDX-callable): two to four images side by side, each with
// figure semantics, a required alt and an optional caption. Every image
// links to its full-size file (click to enlarge, opens in a new tab).
// Stacks to one column on small screens. Images are site-absolute paths
// and are verified by the link checker like Figure.
export type FigureRowItem = {
  src: string;
  alt: string;
  caption?: string;
};

export function FigureRow({ figures }: { figures: readonly FigureRowItem[] }) {
  return (
    <div className="figure-row">
      {figures.map((figure) => (
        <figure key={figure.src} className="figure-row__item">
          <a href={figure.src} target="_blank" rel="noopener noreferrer" className="figure-row__link">
            <img src={figure.src} alt={figure.alt} loading="lazy" />
          </a>
          {figure.caption ? <figcaption>{figure.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}
