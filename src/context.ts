import { unpermissifyChild } from "./helpers";
import { BlorpContextNode, PermissiveChild } from "./types";

export class Context<T> {
  defaultValue: T;

  constructor(defaultValue: T) {
    this.defaultValue = defaultValue;
  }

  provide(value: T, child: PermissiveChild): BlorpContextNode {
    return {
      _blorp: true,
      type: "context",
      child: unpermissifyChild(child),
      value,
      contextObject: this,
    };
  }
}

export const createContext = <T>(defaultValue: T): Context<T> => {
  return new Context(defaultValue);
};
