import { Optional, UseStateHandler } from "./types";

interface HooksRegistry {
  useStateHandler: UseStateHandler<any>;
}

let hooks: Optional<HooksRegistry> = undefined;

export const useState = <T>(initialState: T): [T, (newState: T) => void] => {
  if (!hooks) {
    throw new Error("hooks are not attached!");
  }
  return hooks.useStateHandler(initialState);
};

export const attachHooks = (newHooks: HooksRegistry) => {
  if (hooks) {
    throw new Error("hooks are already attached!");
  }
  hooks = newHooks;
};

export const detatchHooks = () => {
  if (!hooks) {
    throw new Error("hooks are not attached!");
  }
  hooks = undefined;
};
