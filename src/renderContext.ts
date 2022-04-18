import { BlorpNodeConstructor, Optional, UseStateHandler } from './types';
import { patch, text, elementOpen, elementClose, elementVoid, currentElement } from 'incremental-dom-evinism';
import { HookDomain } from './hookDomain';

type RenderContext = {
  hookDomain: HookDomain;
  parent: Optional<RenderContext>;
  childrenContexts: {[key: string]: RenderContext[]};
};

export class RenderTreeContext {
  rootElement: Element;
  rootNode: BlorpNodeConstructor;

  constructor(rootElement: Element, rootNode: BlorpNodeConstructor) {
    this.rootElement = rootElement;
    this.rootNode = rootNode;
  }

  _renderNode = (nodeConstructor: BlorpNodeConstructor, renderContext: RenderContext) => {
    const hookDomain = renderContext.hookDomain;

    hookDomain.enter(this.render);
    const node = nodeConstructor({ rerender: this.render });
    hookDomain.exit();

    if (typeof node === 'string') {
      text(node);
    } else if(node.type === 'element') {
      const nodeKey = node.key;
      const props = Object.entries(node.props).flat();
      if (node.children) {
        elementOpen(node.tag, node.key, [], ...props);
        // Try to make contexts work!
        const element = currentElement() as any;
        if (!element._blorp_render_contexts) {
          element._blorp_render_contexts = [];
        }

        for (let i = 0;  i < node.children.length; i++) {
          const child = node.children[i];
          if (!element._blorp_render_contexts[i]) {
            let newRenderContext: RenderContext = {
              hookDomain: new HookDomain(),
              parent: renderContext,
              childrenContexts: {},
            };
            element._blorp_render_contexts[i] = newRenderContext;
          }
          this._renderNode(child, element._blorp_render_contexts[i]);
        }
        elementClose(node.tag);
      } else {
        elementVoid(node.tag, node.key, null, props);
      }
    } else if(node.type === 'fragment') {
      const nodeKey = node.key;
      for (let child of node.children) {
        // TODO: try to make hook domains work here. It's not clear what the best solution is.
        this._renderNode(child, renderContext);
      }
    }
  }

  render = () => {
    const baseRenderContext: RenderContext = {
      hookDomain: new HookDomain(),
      parent: undefined,
      childrenContexts: {},
    };
    patch(this.rootElement, () => this._renderNode(this.rootNode, baseRenderContext));
  }
}