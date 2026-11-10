// Figure (MDX-callable,): <figure>/<figcaption> with required alt;
// images referenced by site-absolute path and verified by
// the link checker.
export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="figure">
      <img src={src} alt={alt} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}