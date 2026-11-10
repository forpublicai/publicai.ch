// Accordion: behaviour + styling ported
// from the global site's FAQSection (publicai.co/src/components/FAQ —
// authoritative per): multi-open items, chevron rotation, hairline
// card + inner divider, unmount-on-close (no height animation). A11y
// upgrade over the global version: aria-expanded/aria-controls + labelled
// regions (the global site lacks them; requires WCAG 2.1 AA).
// Items come from MDX props: <Accordion items={[{question, answer}, …]} />.
"use client";

import { useState } from "react";
import type { AccordionItemProps } from "~/components/mdx/types";

export function Accordion({ items }: { items: readonly AccordionItemProps[] }) {
  // Multi-open model (global-site behaviour): any subset open.
  const [openItems, setOpenItems] = useState<readonly number[]>([]);

  function toggleItem(index: number): void {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const open = openItems.includes(index);
        const controlId = `accordion-panel-${index}`;
        return (
          <div key={index} className="accordion__item">
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={open}
              aria-controls={controlId}
              onClick={() => toggleItem(index)}
            >
              <span className="accordion__question">{item.question}</span>
              <svg
                className={open ? "accordion__chevron accordion__chevron--open" : "accordion__chevron"}
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open ? (
              <div id={controlId} className="accordion__panel">
                <div className="accordion__panel-inner">
                  <p className="accordion__answer">{item.answer}</p>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}