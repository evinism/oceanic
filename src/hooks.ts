import { Optional, UseStateHandler, UseEffectHandler } from "./types";

interface HooksRegistry {
  useStateHandler: UseStateHandler<any>;
  useEffectHandler: UseEffectHandler;
}

let hooks: Optional<HooksRegistry> = undefined;

// The core hook functions

export const useState = <T>(initialState: T): [T, (newState: T) => void] => {
  if (!hooks) {
    throw new Error("hooks are not attached!");
  }
  return hooks.useStateHandler(initialState);
};

export const useEffect: UseEffectHandler = (effect, deps) => {
  if (!hooks) {
    throw new Error("hooks are not attached!");
  }
  return hooks.useEffectHandler(effect, deps);
};

// End of core hook functions

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
