// Keep native table semantics while containing wide tables in a keyboard-
// accessible scroll region. The region label follows the rendered locale.
import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const rehypeMarkdownTables: Plugin<[{ label: string }], Root> = ({ label }) => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || index === undefined || !parent) return;
      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["mdx-table-scroll"],
          tabIndex: 0,
          role: "region",
          ariaLabel: label,
        },
        children: [node],
      };
      parent.children[index] = wrapper;
      // Skip this new wrapper so the table is not wrapped a second time.
      return index + 1;
    });
  };
};
