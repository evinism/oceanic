import { StrictComponent, Optional } from "./types";
import {
  patch,
  text,
  elementOpen,
  elementClose,
} from "incremental-dom-evinism";
import { HookDomain } from "./hookDomain";
import { Context } from "./context";
import { getKey } from "./helpers";

type RenderTreeNode = {
  hookDomain: HookDomain;
  contextNodeObj?: {
    value: any;
    contextObject: Context;
  };
  parent: Optional<RenderTreeNode>;
  childrenContexts: { [key: string]: RenderTreeNode[] };
};

export class RenderTree {
  rootElement: Element;
  rootNode: StrictComponent;
  _baseRenderTreeNode: RenderTreeNode;

  constructor(rootElement: Element, rootNode: StrictComponent) {
    this.rootElement = rootElement;
    this.rootNode = rootNode;
    this._baseRenderTreeNode = {
      hookDomain: new HookDomain(),
      parent: undefined,
      childrenContexts: {},
    };
  }

  _getContextVariable =
    (renderTreeNode: RenderTreeNode) => (context: Context) => {
      let current: Optional<RenderTreeNode> = renderTreeNode;
      while (current) {
        if (
          current.contextNodeObj &&
          current.contextNodeObj.contextObject === context
        ) {
          return current.contextNodeObj.value;
        }
        current = current.parent;
      }
      return context.defaultValue;
    };

  _renderNodeChildren = (
    children: StrictComponent[],
    renderTreeNode: RenderTreeNode
  ) => {
    const keyIndexCount: { [key: string]: number } = {};

    for (let child of children) {
      const key = getKey(child);
      const keyIndex = keyIndexCount[key] || 0;
      keyIndexCount[key] = keyIndex + 1;
      renderTreeNode.childrenContexts[key] =
        renderTreeNode.childrenContexts[key] || [];
      const contextsForKey = renderTreeNode.childrenContexts[key];
      if (!contextsForKey[keyIndex]) {
        let newRenderTreeNode: RenderTreeNode = {
          hookDomain: new HookDomain(),
          parent: renderTreeNode,
          childrenContexts: {},
        };
        contextsForKey[keyIndex] = newRenderTreeNode;
      }
      this._renderNode(child, contextsForKey[keyIndex]);
    }
    // and prune extraneous contexts
    for (let key in keyIndexCount) {
      const keyIndex = keyIndexCount[key];
      if (keyIndex < renderTreeNode.childrenContexts[key].length) {
        renderTreeNode.childrenContexts[key].splice(keyIndex);
      }
    }
  };

  _renderNode = (
    nodeConstructor: StrictComponent,
    renderTreeNode: RenderTreeNode
  ) => {
    let node: ReturnType<StrictComponent>;

    renderTreeNode.hookDomain.withHooks(
      this.render,
      this._getContextVariable(renderTreeNode),
      (hooks) => {
        node = nodeConstructor(hooks);
      }
    );

    if (!node) {
      renderTreeNode.childrenContexts = {};
    } else if (node.type === "text") {
      renderTreeNode.childrenContexts = {};
      text(node.text);
    } else if (node.type === "element") {
      const props = Object.entries(node.props).flat();
      elementOpen(node.tag, "", [], ...props);
      node.children && this._renderNodeChildren(node.children, renderTreeNode);
      elementClose(node.tag);
    } else if (node.type === "fragment") {
      this._renderNodeChildren(node.children, renderTreeNode);
    } else if (node.type === "context") {
      renderTreeNode.contextNodeObj = {
        value: node.value,
        contextObject: node.contextObject,
      };
      this._renderNodeChildren([node.child], renderTreeNode);
    }
  };

  render = () => {
    patch(this.rootElement, () =>
      this._renderNode(this.rootNode, this._baseRenderTreeNode)
    );
  };
}
