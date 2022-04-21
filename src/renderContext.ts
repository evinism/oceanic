import { BlorpNodeConstructor, Optional } from "./types";
import {
  patch,
  text,
  elementOpen,
  elementClose,
  elementVoid,
} from "incremental-dom-evinism";
import { HookDomain } from "./hookDomain";
import { useState, useEffect } from "./hooks";
import { frag } from "./elements";

type RenderContext = {
  hookDomain: HookDomain;
  parent: Optional<RenderContext>;
  childrenContexts: { [key: string]: RenderContext[] };
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
      childrenContexts: {},
    };
  }

  _renderNodeChildren(
    children: BlorpNodeConstructor[],
    renderContext: RenderContext
  ) {
    const keyIndexCount: { [key: string]: number } = {};

    for (let child of children) {
      const key = child.key || child.name || `blorp-auto-key`;
      const keyIndex = keyIndexCount[key] || 0;
      keyIndexCount[key] = keyIndex + 1;
      renderContext.childrenContexts[key] =
        renderContext.childrenContexts[key] || [];
      const contextsForKey = renderContext.childrenContexts[key];
      if (!contextsForKey[keyIndex]) {
        let newRenderContext: RenderContext = {
          hookDomain: new HookDomain(),
          parent: renderContext,
          childrenContexts: {},
        };
        contextsForKey[keyIndex] = newRenderContext;
      }
      this._renderNode(child, contextsForKey[keyIndex]);
    }
    // and prune extraneous contexts
    for (let key in keyIndexCount) {
      const keyIndex = keyIndexCount[key];
      if (keyIndex < renderContext.childrenContexts[key].length) {
        renderContext.childrenContexts[key].splice(keyIndex);
      }
    }
  }

  _renderNode = (
    nodeConstructor: BlorpNodeConstructor,
    renderContext: RenderContext
  ) => {
    const hookDomain = renderContext.hookDomain;

    hookDomain.enter(this.render);
    let node = nodeConstructor({
      rerender: this.render,
      useState,
      useEffect,
    });
    hookDomain.exit();

    if (!node) {
      // This is pretty gross.
      renderContext.hookDomain = new HookDomain();
      renderContext.childrenContexts = {};
      return;
    }

    // If we've constructed another constructor, we render it as if it's a fragment
    if (typeof node === "function") {
      node = frag(node);
    }

    if (typeof node === "string") {
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
