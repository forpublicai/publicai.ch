// MDX component inventory exports: every component callable from
// MDX by JSX tag, registered in one mapping consumed by the page renderer.
// New components: developers add here; existing prop names MUST NOT break
// ( extension rule).

// Accordion item data shape (global-site FAQItem model).
export type AccordionItemProps = { question: string; answer: string };