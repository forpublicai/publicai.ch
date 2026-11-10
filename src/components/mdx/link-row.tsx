// LinkRow (MDX-callable,): horizontal row of CTA rows. Items use
// CTA props (title + to|href + optional description), rendered compactly.
"use client";

import { CTA } from "~/components/mdx/cta";

export type LinkRowItem = {
  title: string;
  to?: string;
  href?: string;
  description?: string;
};

export function LinkRow({ links }: { links: readonly LinkRowItem[] }) {
  return (
    <div className="link-row">
      {links.map((link, i) => (
        <CTA key={i} title={link.title} to={link.to} href={link.href} description={link.description} variant="outline" />
      ))}
    </div>
  );
}