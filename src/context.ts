import { unpermissifyChild } from "./unpermissify";
import { OceanicContextNode, PermissiveChild } from "./types";

export class Context<T = any> {
  defaultValue: T;

  constructor(defaultValue: T) {
    this.defaultValue = defaultValue;
  }

  provide(value: T, child: PermissiveChild): OceanicContextNode {
    return {
      _oceanic: true,
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
