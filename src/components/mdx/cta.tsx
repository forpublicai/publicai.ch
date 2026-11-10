// CTA (MDX-callable,): primary action row. Either `to` (internal
// slug — locale-prefixed automatically,) or `href` (absolute URL or
// mailto:). External links open safely (noopener).
"use client";

import { useLocation } from "react-router";
import { localePath } from "~/lib/locale";

export type CtaVariant = "primary" | "outline";

export function CTA({
  title,
  to,
  href,
  description,
  variant = "primary",
}: {
  title: string;
  to?: string;
  href?: string;
  description?: string;
  variant?: CtaVariant;
}) {
  const location = useLocation();
  // Internal `to` slugs get the current page's locale prefix ;
  // href targets pass through untouched (http(s)/mailto/#).
  const target = href !== undefined ? href : to !== undefined ? localePath(location.pathname, to) : undefined;
  const external = href?.startsWith("http") ?? false;

  return (
    <a
      href={target}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`cta cta--${variant}`}
    >
      <span className="cta__text">
        <span className="cta__title">{title}</span>
        {description ? <span className="cta__description">{description}</span> : null}
      </span>
      <span className="cta__arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}