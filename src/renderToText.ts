import { Component, BlorpNode, DomRepresentedProp, Hooks } from "./types";
import { frag } from "./elements";

const noop = () => {};

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

  const hooks: Hooks = {
    rerender: noop,
    useState: <T>(i: T) => [i, noop],
    useEffect: noop,
    useContext: () => undefined as any, // Context should REALLY be propatagated through rendering.
  };

  function renderNode(nodeConstructor: Component | BlorpNode) {
    const fn =
      typeof nodeConstructor === "function"
        ? nodeConstructor
        : () => nodeConstructor;
    const node = fn(hooks);

    let html = "";
    if (!node) {
    } else if (typeof node === "string") {
      html += node;
    } else if (typeof node === "function") {
      html += renderNode(() => frag(node));
    } else if (node.type === "fragment") {
      for (let child of node.children) {
        const childNode = child(hooks);
        if (childNode) {
          html += renderNode(childNode);
        }
      }
    } else if (node.type === "context") {
      // TODO: Propagate context value.
      html += renderNode(node.child);
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
          const childNode = child(hooks);
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
