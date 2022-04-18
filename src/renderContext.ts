import { BlorpNodeConstructor, UseStateHandler } from './types';
import { patch, text, elementOpen, elementClose, elementVoid, currentElement } from 'incremental-dom-evinism';
import { HookDomain } from './hookDomain';

export class RenderTreeContext {
  rootElement: Element;
  rootNode: BlorpNodeConstructor;

  constructor(rootElement: Element, rootNode: BlorpNodeConstructor) {
    this.rootElement = rootElement;
    this.rootNode = rootNode;
  }

  _renderNode = (nodeConstructor: BlorpNodeConstructor, hookDomain: HookDomain) => {
    hookDomain.enter(this.render);
    const node = nodeConstructor({ rerender: this.render });
    hookDomain.exit();

    if (typeof node === 'string') {
      text(node);
    } else if(node.type === 'element') {
      const props = Object.entries(node.props).flat();
      if (node.children) {
        elementOpen(node.tag, node.key, [], ...props);
        // Try to make contexts work!
        const element = currentElement() as any;
        if (!element._blorp_hook_domains) {
          element._blorp_hook_domains = [];
        }

        for (let i = 0;  i < node.children.length; i++) {
          const child = node.children[i];
          if (!element._blorp_hook_domains[i]) {
            element._blorp_hook_domains[i] = new HookDomain();
          }
          this._renderNode(child, element._blorp_hook_domains[i]);
        }
        elementClose(node.tag);
      } else {
        elementVoid(node.tag, node.key, null, props);
      }
    } else if(node.type === 'fragment') {
      for (let child of node.children) {
        // TODO: try to make hook domains work here. It's not clear what the best solution is.
        this._renderNode(child, hookDomain);
      }
    }
  }

  render = () => {
    const baseHookDomain = new HookDomain();
    patch(this.rootElement, () => this._renderNode(this.rootNode, baseHookDomain));
  }
}