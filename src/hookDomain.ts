import { unpermissifyOptional } from "./helpers";
import { attachHooks, detatchHooks } from "./hooks";

import { UseEffectHandler, UseStateHandler, Optional } from "./types";

export class HookDomain {
  _recording: boolean;
  _isAttached: boolean;
  _useStateData: any[];
  _useEffectData: {
    prevDepArray: Optional<any[]>;
    prevDetach: Optional<() => void>;
  }[];
  _hookOrder: ("useState" | "useEffect")[];
  _position: number | undefined;

  constructor() {
    this._recording = true;
    this._isAttached = false;
    this._useStateData = [];
    this._useEffectData = [];
    this._hookOrder = [];
    this._position = undefined;
  }

  enter = (rerender: () => void) => {
    this._position = 0;
    if (this._isAttached) {
      throw new Error("Hooks are already attached!");
    }
    this._isAttached = true;

    const useStateHandler: UseStateHandler = (initialState) => {
      const hookIndex = this._position!;
      this._position!++;

      console.log("useStateHandler called: ", hookIndex);

      if (this._recording) {
        this._hookOrder[hookIndex] = "useState";
        this._useStateData[hookIndex] = initialState;
      } else if (this._hookOrder[hookIndex] !== "useState") {
        throw new Error("useState hook is not in the right position!");
      }

      const state = this._useStateData[hookIndex];
      // TODO: Make this stable
      const setState = (newState: any) => {
        this._useStateData[hookIndex] = newState;
        rerender();
      };
      return [state, setState];
    };

    const useEffectHandler: UseEffectHandler = (effect, deps) => {
      const hookIndex = this._position!;
      this._position!++;

      if (this._recording) {
        this._hookOrder[hookIndex] = "useEffect";
        this._useEffectData[hookIndex] = {
          prevDepArray: unpermissifyOptional(deps),
          prevDetach: undefined,
        };
      } else if (this._hookOrder[hookIndex] !== "useEffect") {
        throw new Error("useEffect hook is not in the right position!");
      }
      const { prevDepArray, prevDetach } = this._useEffectData[hookIndex];
      let shouldExecute = true;
      if (!deps) {
        shouldExecute = true;
      } else if (deps.length === 0 && !this._recording) {
        shouldExecute = false;
      } else if (prevDepArray?.length !== deps.length) {
        shouldExecute = true;
      } else {
        for (let i = 0; i < deps.length; i++) {
          if (deps[i] !== prevDepArray[i]) {
            shouldExecute = true;
            break;
          }
        }
      }
      this._useEffectData[hookIndex].prevDepArray = unpermissifyOptional(deps);
      if (shouldExecute) {
        prevDetach?.();
        setTimeout(() => {
          const detach = unpermissifyOptional(effect());
          this._useEffectData[hookIndex].prevDetach = detach;
        }, 0);
      }
    };
    attachHooks({ useStateHandler, useEffectHandler });
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
