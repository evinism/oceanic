import { BlorpNode, Component } from "./types";
import { RenderTree } from "./renderTree";

const activeRenderTreeNodes = new Map<Element, RenderTree>();

export function render(node: BlorpNode | Component, element: Element) {
  const nodeConstructor = typeof node === "function" ? node : () => node;
  const renderTreeNode = activeRenderTreeNodes.get(element);
  if (renderTreeNode) {
    renderTreeNode.rootNode = nodeConstructor;
    renderTreeNode.render();
  } else {
    const renderTree = new RenderTree(element, nodeConstructor);
    activeRenderTreeNodes.set(element, renderTree);
    renderTree.render();
  }
}
