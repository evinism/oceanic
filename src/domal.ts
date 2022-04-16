export * from './elements';
import { DomalNode, DomRepresentedProp } from './types';
export { DomalNode } from './types';
import { patch, text, elementOpen, elementClose, elementVoid } from 'incremental-dom';

export function renderToText(node: (() => DomalNode) | DomalNode): string {
  function renderAttrValue(value: boolean | number | string ){
    return typeof value === 'string' ? `"${value}"` : value;
  }

  function renderNode(node: DomalNode){
    let html = '';
    if (typeof node === 'string') {
      html += node;
    } else {
      html = `<${node.tag}`;
      for (let key in node.domRepresentedProps ) {
        const value = node.domRepresentedProps[key as DomRepresentedProp];
        if (value !== undefined) {
          html += ` ${key}=${renderAttrValue(value)}`;
        }
      }
      if (node.children) {
        html += '>';
        for (let child of node.children) {
          html += renderNode(child);
        }
        html += `</${node.tag}>`;
      } else {
        html += '/>';
      }
    }
    return html;
  }
  if (typeof node === 'function') {
    return renderNode(node());
  } else {
    return renderNode(node);
  }
}

export function render(node: DomalNode | (() => DomalNode), element: HTMLElement) {
  function renderNode(node: DomalNode){
    if (typeof node === 'string') {
      text(node);
    } else {
      const props = Object.entries(Object.assign(
        {}, node.domRepresentedProps, node.jsAssignedProps
      )).flat();
      if (node.children) {
        elementOpen(node.tag, (props as any)['key'] || '', [], ...props);
        for (let child of node.children) {
          renderNode(child);
        }
        elementClose(node.tag);
      } else {
        elementVoid(node.tag, '', null, props);
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
