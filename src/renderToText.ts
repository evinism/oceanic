export * from "./elements";
import { BlorpNode, DomRepresentedProp } from "./types";
export { BlorpNode } from "./types";

export function renderToText(node: (() => BlorpNode) | BlorpNode): string {
  const domRepresentedProps = [
    "id",
    "class",
    "value",
    "checked",
    "selected",
    "disabled",
    "readonly",
    "hidden",
    "tabindex",
  ];

  function renderAttrValue(value: boolean | number | string) {
    return typeof value === "string" ? `"${value}"` : value;
  }

  function renderNode(node: BlorpNode) {
    let html = "";
    if (typeof node === "string") {
      html += node;
    } else if (node.type === "fragment") {
      for (let child of node.children) {
        const childNode = child({ rerender: () => {} });
        if (childNode) {
          html += renderNode(childNode);
        }
      }
    } else {
      html = `<${node.tag}`;
      for (let key in node.props) {
        if (domRepresentedProps.indexOf(key) !== -1) {
          const value = node.props[key as DomRepresentedProp];
          if (value !== undefined) {
            html += ` ${key}=${renderAttrValue(value)}`;
          }
        }
      }
      if (node.children) {
        html += ">";
        for (let child of node.children) {
          const childNode = child({ rerender: () => {} });
          if (childNode) {
            html += renderNode(childNode);
          }
        }
        html += `</${node.tag}>`;
      } else {
        html += "/>";
      }
    }
    return html;
  }
  if (typeof node === "function") {
    return renderNode(node());
  } else {
    return renderNode(node);
  }
}
