import { BlorpNode, BlorpNodeConstructor } from './types';
import { RenderContext } from './renderContext';

const activeRenderContexts = new Map<Element, RenderContext>();

export function render(node: BlorpNode | BlorpNodeConstructor, element: Element) {
  const nodeConstructor = typeof node === 'function' ? node : () => node;
  const renderContext = activeRenderContexts.get(element);
  if (renderContext) {
    renderContext.rootNode = nodeConstructor;
    renderContext.render();
  } else {
    const newRenderContext = new RenderContext(element, nodeConstructor);
    activeRenderContexts.set(element, newRenderContext);
    newRenderContext.render();
  }
}
