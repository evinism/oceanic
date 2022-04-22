import { Context } from "./context";
import { unpermissifyOptional } from "./helpers";
import { UseEffectHandler, UseStateHandler, Optional, Hooks } from "./types";

export class HookDomain {
  constructor() {
    this._recording = true;
    this._useStateData = [];
    this._useEffectData = [];
    this._useContextData = [];
    this._hookOrder = [];
    this._position = undefined;
  }

  withHooks = (
    rerender: () => void,
    getContextVariable: (context: Context) => any,
    cb: (arg: Hooks) => unknown
  ) => {
    this._position = 0;
    cb({
      useState: this._useStateHandler(rerender),
      useEffect: this._useEffectHandler,
      useContext: this._useContextHandler(getContextVariable),
      rerender: rerender,
    });
    if (this._position !== this._hookOrder.length) {
      throw new Error("Hooks are not in the right position!");
    }

    this._recording = false;
    this._position = undefined;
  };

  private _recording: boolean;
  private _useStateData: any[];
  private _useEffectData: {
    prevDepArray: Optional<any[]>;
    prevDetach: Optional<() => void>;
  }[];
  private _useContextData: any[];
  private _hookOrder: ("useState" | "useEffect" | "useContext")[];
  private _position: number | undefined;

  private _useStateHandler =
    (rerender: () => void): UseStateHandler =>
    (initialState) => {
      const hookIndex = this._position!;
      this._position!++;
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

  private _useEffectHandler: UseEffectHandler = (effect, deps) => {
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

  private _useContextHandler =
    (getContextVariable: (context: Context) => any) =>
    <T>(context: Context<T>) => {
      const hookIndex = this._position!;
      this._position!++;

      if (this._recording) {
        this._hookOrder[hookIndex] = "useContext";
        this._useContextData[hookIndex] = context;
      } else if (
        this._hookOrder[hookIndex] !== "useContext" ||
        context !== this._useContextData[hookIndex]
      ) {
        throw new Error("useContext hook is not in the right position!");
      }
      return getContextVariable(context);
    };
}
