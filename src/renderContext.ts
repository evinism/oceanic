import { BlorpNodeConstructor, Optional, UseStateHandler } from "./types";
import {
  patch,
  text,
  elementOpen,
  elementClose,
  elementVoid,
  currentElement,
} from "incremental-dom-evinism";
import { HookDomain } from "./hookDomain";

type RenderContext = {
  hookDomain: HookDomain;
  parent: Optional<RenderContext>;
  childrenContexts: RenderContext[];
};

export class RenderTreeContext {
  rootElement: Element;
  rootNode: BlorpNodeConstructor;
  _baseRenderContext: RenderContext;

  constructor(rootElement: Element, rootNode: BlorpNodeConstructor) {
    this.rootElement = rootElement;
    this.rootNode = rootNode;
    this._baseRenderContext = {
      hookDomain: new HookDomain(),
      parent: undefined,
      childrenContexts: [],
    };
  }

  _renderNodeChildren(
    children: BlorpNodeConstructor[],
    renderContext: RenderContext
  ) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!renderContext.childrenContexts[i]) {
        let newRenderContext: RenderContext = {
          hookDomain: new HookDomain(),
          parent: renderContext,
          childrenContexts: [],
        };
        renderContext.childrenContexts[i] = newRenderContext;
      }
      this._renderNode(child, renderContext.childrenContexts[i]);
    }
  }

  _renderNode = (
    nodeConstructor: BlorpNodeConstructor,
    renderContext: RenderContext
  ) => {
    const hookDomain = renderContext.hookDomain;

    hookDomain.enter(this.render);
    const node = nodeConstructor({ rerender: this.render });
    hookDomain.exit();

    if (!node) {
      // This is pretty gross.
      renderContext.hookDomain = new HookDomain();
      renderContext.childrenContexts = [];
      return;
    } else if (typeof node === "string") {
      text(node);
    } else if (node.type === "element") {
      const props = Object.entries(node.props).flat();
      if (node.children) {
        elementOpen(node.tag, "", [], ...props);
        this._renderNodeChildren(node.children, renderContext);
        elementClose(node.tag);
      } else {
        elementVoid(node.tag, "", null, props);
      }
    } else if (node.type === "fragment") {
      this._renderNodeChildren(node.children, renderContext);
    }
  };

  render = () => {
    patch(this.rootElement, () =>
      this._renderNode(this.rootNode, this._baseRenderContext)
    );
  };
}
