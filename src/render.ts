import { PermissiveChild } from "./types";
import { RenderTree } from "./renderTree";
import { unpermissifyChild } from "./unpermissify";

const activeRenderTreeNodes = new Map<Element, RenderTree>();

export function render(node: PermissiveChild, element: Element) {
  const strictChild = unpermissifyChild(node);
  const renderTreeNode = activeRenderTreeNodes.get(element);
  if (renderTreeNode) {
    renderTreeNode.rootNode = strictChild;
    renderTreeNode.render();
  } else {
    const renderTree = new RenderTree(element, strictChild);
    activeRenderTreeNodes.set(element, renderTree);
    renderTree.render();
  }
}
