import { BlorpNode, BlorpNodeConstructor } from './types';
import { RenderTreeContext } from './renderContext';

const activeRenderContexts = new Map<Element, RenderTreeContext>();

export function render(node: BlorpNode | BlorpNodeConstructor, element: Element) {
  const nodeConstructor = typeof node === 'function' ? node : () => node;
  const renderContext = activeRenderContexts.get(element);
  if (renderContext) {
    renderContext.rootNode = nodeConstructor;
    renderContext.render();
  } else {
    const renderTreeContext = new RenderTreeContext(element, nodeConstructor);
    activeRenderContexts.set(element, renderTreeContext);
    renderTreeContext.render();
  }
}
