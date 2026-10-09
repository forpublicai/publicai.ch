// Lead (MDX-callable): the page intro paragraph — larger, grey, sits under
// the h1. Use ONCE at the top of a section for the opening sentence; the
// regular prose rhythm resumes after it.
import type { ReactNode } from "react";

export function Lead({ children }: { children: ReactNode }) {
  return <p className="lead">{children}</p>;
}