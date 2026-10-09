// MDX component registry: the ONE mapping of JSX tags callable from
// MDX to implementations. Named re-exports only (MDX JSX resolves component
// identifiers through the compiler module scope).
// Extension rule: new components are added here; existing prop
// names MUST NOT break.
import { Accordion } from "~/components/mdx/accordion";
import type { AccordionItemProps } from "~/components/mdx/types";
import { Box } from "~/components/mdx/box";
import { Callout } from "~/components/mdx/callout";
import { CTA } from "~/components/mdx/cta";
import { Divider } from "~/components/mdx/divider";
import { Embed } from "~/components/mdx/embed";
import { Figure } from "~/components/mdx/figure";
import { Lead } from "~/components/mdx/lead";
import { LinkRow } from "~/components/mdx/link-row";
import { PosterGrid } from "~/components/mdx/poster-grid";
import { StatGrid } from "~/components/mdx/stat-grid";
import { TeamGrid } from "~/components/mdx/team-grid";

export type { AccordionItemProps };

export {
  Accordion,
  Box,
  Callout,
  CTA,
  Divider,
  Embed,
  Figure,
  Lead,
  LinkRow,
  PosterGrid,
  StatGrid,
  TeamGrid,
};