import { BlorpNodeConstructor, UseStateHandler } from './types';
import { patch, text, elementOpen, elementClose, elementVoid, currentElement } from 'incremental-dom-evinism';
import { attachHooks, detatchHooks } from './hooks';

class HookDomain {
  _recording: boolean;
  _isAttached: boolean;
  _state: any[];
  _hookOrder: 'useState'[];
  _position: number | undefined;
  constructor(){
    this._recording = true;
    this._isAttached = false;
    this._state = [];
    this._hookOrder = [];
    this._position = undefined;
  }

  enter = (rerender: () => void) => {
    this._position = 0;
    if (this._isAttached) {
      throw new Error('Hooks are already attached!');
    }
    this._isAttached = true;

    const useStateHandler: UseStateHandler<any> = (initialState) => {
      const hookIndex = this._position!;
      this._position!++;

      console.log("useStateHandler called: ", hookIndex);

      if (this._recording) {
        this._hookOrder[hookIndex] = 'useState';
        this._state[hookIndex] = initialState;
      } else if (this._hookOrder[hookIndex] !== 'useState') {
          throw new Error('useState hook is not in the right position!');
      }

      const state = this._state[hookIndex];
      // TODO: Make this stable
      const setState = (newState: any) => {
        this._state[hookIndex] = newState;
        rerender();
      }
      return [state, setState];
    };

    attachHooks({ useStateHandler });
  };

  exit = () =>{
    if (!this._isAttached) {
      throw new Error('Hooks are not yet attached!');
    }

    if (this._position !== this._hookOrder.length) {
        throw new Error('Hooks are not in the right position!');
    }

    detatchHooks();
    this._recording = false;
    this._isAttached = false;
    this._position = undefined;
  };
};


export class RenderContext {
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
    } else {
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
    }
  }

  render = () => {
    const baseHookDomain = new HookDomain();
    patch(this.rootElement, () => this._renderNode(this.rootNode, baseHookDomain));
  }
}