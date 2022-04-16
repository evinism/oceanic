import { DomalNode } from './types';
import { patch, text, elementOpen, elementClose, elementVoid } from 'incremental-dom';

export function render(node: DomalNode | (() => DomalNode), element: HTMLElement) {
  function renderNode(node: DomalNode){
    if (typeof node === 'string') {
      text(node);
    } else {
      const props = Object.entries(node.props).flat();
      if (node.children) {
        elementOpen(node.tag, node.key, [], ...props);
        for (let child of node.children) {
          renderNode(child());
        }
        elementClose(node.tag);
      } else {
        elementVoid(node.tag, node.key, null, props);
      }
    }
  }

  patch(element, () => {
    if (typeof node === 'function') {
      renderNode(node());
    } else {
      renderNode(node);
    }
  });
}
