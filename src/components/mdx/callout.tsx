// Callout (MDX-callable,): highlighted note block.
// Variants: info (neutral), warning (amber tone), highlight (brand tint),
// legal (section sign and restrained horizontal rules).
import type { ReactNode } from "react";

export type CalloutVariant = "info" | "warning" | "highlight" | "legal";

export function Callout({
  variant = "info",
  children,
}: {
  variant?: CalloutVariant;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout--${variant}`}>
      {variant === "legal" ? (
        <>
          <span className="callout__legal-symbol" aria-hidden="true">§</span>
          <div className="callout__legal-content">{children}</div>
        </>
      ) : children}
    </aside>
  );
}
