// Box (MDX-callable): the custom-styling escape hatch (user decision
// 2026-09-30). A generic card container for content that plain markdown
// cannot express, WITHOUT letting MDX authors write raw HTML/Tailwind.
// Variants map to the design system's semantic classes; `title` renders an
// optional block heading inside the box. Layout-level needs (columns,
// side-by-side) stay the registry's job — new variants/extensions go
// through the component-registry extension rule.
import type { ReactNode } from "react";

export type BoxVariant = "card" | "info" | "warning" | "highlight" | "quote";

export function Box({
  variant = "card",
  title,
  children,
}: {
  variant?: BoxVariant;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`box box--${variant}`}>
      {title ? <p className="block-heading box__title">{title}</p> : null}
      {children}
    </div>
  );
}