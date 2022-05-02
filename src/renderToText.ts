import { StrictComponent, OceanicNode, Hooks } from "./types";
import { frag } from "./elements/frag";
import { Context } from "./context";

const noop = () => {};

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

function renderNode(
  nodeConstructor: StrictComponent | OceanicNode,
  contextMap: Map<Context, any>
) {
  const hooks: Hooks = {
    rerender: noop,
    useState: <T>(i: T) => [i, noop],
    useEffect: noop,
    useContext: (context) => contextMap.get(context) || context.defaultValue,
  };

  const fn =
    typeof nodeConstructor === "function"
      ? nodeConstructor
      : () => nodeConstructor;
  let node = fn(hooks);

  if (typeof node === "function") {
    node = frag(node);
  }

  let html = "";
  if (!node) {
  } else if (node.type === "text") {
    html += node.text;
  } else if (typeof node === "function") {
    html += renderNode(() => frag(node), contextMap);
  } else if (node.type === "fragment") {
    for (let child of node.children) {
      const childNode = child(hooks);
      if (childNode) {
        html += renderNode(childNode, contextMap);
      }
    }
  } else if (node.type === "context") {
    const nextMap = new Map(contextMap);
    nextMap.set(node.contextObject, node.value);
    html += renderNode(node.child, nextMap);
  } else {
    html = `<${node.tag}`;
    for (let key in node.props) {
      if (domRepresentedProps.indexOf(key) !== -1) {
        const value = node.props[key as string];
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
          html += renderNode(childNode, contextMap);
        }
      }
      html += `</${node.tag}>`;
    } else {
      html += "/>";
    }
  }
  return html;
}

export function renderToText(node: (() => OceanicNode) | OceanicNode): string {
  if (typeof node === "function") {
    return renderNode(node(), new Map());
  } else {
    return renderNode(node, new Map());
  }
}
