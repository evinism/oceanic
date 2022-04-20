import { attachHooks, detatchHooks } from "./hooks";
import { UseStateHandler } from "./types";

export class HookDomain {
  _recording: boolean;
  _isAttached: boolean;
  _state: any[];
  _hookOrder: "useState"[];
  _position: number | undefined;

  constructor() {
    this._recording = true;
    this._isAttached = false;
    this._state = [];
    this._hookOrder = [];
    this._position = undefined;
  }

  enter = (rerender: () => void) => {
    this._position = 0;
    if (this._isAttached) {
      throw new Error("Hooks are already attached!");
    }
    this._isAttached = true;

    const useStateHandler: UseStateHandler<any> = (initialState) => {
      const hookIndex = this._position!;
      this._position!++;

      console.log("useStateHandler called: ", hookIndex);

      if (this._recording) {
        this._hookOrder[hookIndex] = "useState";
        this._state[hookIndex] = initialState;
      } else if (this._hookOrder[hookIndex] !== "useState") {
        throw new Error("useState hook is not in the right position!");
      }

      const state = this._state[hookIndex];
      // TODO: Make this stable
      const setState = (newState: any) => {
        this._state[hookIndex] = newState;
        rerender();
      };
      return [state, setState];
    };

    attachHooks({ useStateHandler });
  };

  exit = () => {
    if (!this._isAttached) {
      throw new Error("Hooks are not yet attached!");
    }

    if (this._position !== this._hookOrder.length) {
      throw new Error("Hooks are not in the right position!");
    }

    detatchHooks();
    this._recording = false;
    this._isAttached = false;
    this._position = undefined;
  };
}
