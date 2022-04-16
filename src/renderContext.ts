import { DomalNodeConstructor } from './types';
import { patch, text, elementOpen, elementClose, elementVoid } from 'incremental-dom';


export class RenderContext {
  rootElement: Element;
  rootNode: DomalNodeConstructor;

  constructor(rootElement: Element, rootNode: DomalNodeConstructor) {
    this.rootElement = rootElement;
    this.rootNode = rootNode;
  }

  _renderNode = (nodeConstructor: DomalNodeConstructor) =>{
    const node = nodeConstructor({
      rerender: this.render
    });
    if (typeof node === 'string') {
      text(node);
    } else {
      const props = Object.entries(node.props).flat();
      if (node.children) {
        elementOpen(node.tag, node.key, [], ...props);
        for (let child of node.children) {
          this._renderNode(child);
        }
        elementClose(node.tag);
      } else {
        elementVoid(node.tag, node.key, null, props);
      }
    }
  }

  render = () => {
    patch(this.rootElement, () => this._renderNode(this.rootNode));
  }
}