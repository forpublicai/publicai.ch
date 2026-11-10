// PosterGrid (MDX-callable,): equal-size preview cards for printable
// posters, each with a direct PDF download. Preview images and PDFs are
// site-absolute paths (link-checker territory,). `downloadLabel` is
// passed per locale block (accessible name of the compact "PDF ↓" button),
// so the component needs no locale lookup.
export type PosterItem = {
  language: string;
  image: string;
  pdf: string;
  alt: string;
};

export function PosterGrid({ posters, downloadLabel }: { posters: readonly PosterItem[]; downloadLabel: string }) {
  return (
    <ul className="poster-grid">
      {posters.map((poster) => (
        <li key={poster.pdf} className="poster-card">
          <a href={poster.pdf} target="_blank" rel="noopener noreferrer" className="poster-card__preview">
            <img src={poster.image} alt={poster.alt} loading="lazy" />
          </a>
          <p className="poster-card__language">{poster.language}</p>
          <a
            href={poster.pdf}
            download
            className="cta cta--outline poster-card__download"
            aria-label={`${downloadLabel}: ${poster.language}`}
          >
            <span className="cta__text">
              <span className="cta__title">PDF</span>
            </span>
            <span className="cta__arrow" aria-hidden="true">
              ↓
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
