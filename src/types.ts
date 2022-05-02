// Nasty circular import things
import { Context } from "./context";

// --- Helper types ---
export type Optional<T> = T | undefined;
export type PermissiveOptional<T> = T | undefined | null | false | void;

export type PermissiveChild = PermissiveOptional<
  Component | OceanicNode | string
>;
export type PermissiveChildren = PermissiveOptional<
  PermissiveChild[] | PermissiveChild
>;


// Maybe we put this somewhere else
type Arguments<Fn extends CustomHook<any, any>> =
  Fn extends (context: Hooks, ...args: infer T) => any ? T : never;
export type HookHandler = <
  HookFn extends (context: Hooks, ...args: any[]) => any
>(
  hookFn: HookFn,
  ...args: Arguments<HookFn>
) => ReturnType<HookFn>;

export type CustomHook<T extends Array<unknown>, R> = (context: Hooks, ...args: T) => R;

// --- Oceanic Node and Constructor types ---
// Should probably be an internal type
export interface KernelHooks {
  rerender: () => void;
  useState: UseStateHandler;
  useEffect: UseEffectHandler;
  useContext: UseContextHandler;
}

export interface Hooks {
  rerender: () => void;
  hook: HookHandler;
  useState: UseStateHandler;
  useEffect: UseEffectHandler;
  useContext: UseContextHandler;
}

export type PermissiveNode = PermissiveOptional<OceanicNode | string>;

export type PermissiveComponent = ((
  hooks: Hooks
) => PermissiveOptional<PermissiveNode | PermissiveComponent>) & {
  key?: string;
};

// This name is only to be used externally
export type Component = PermissiveComponent;

export type StrictComponent = ((hooks: Hooks) => Optional<OceanicNode>) & {
  key?: string;
};

export type OceanicElementNode = {
  _oceanic: true;
  type: "element";
  tag: string;
  children: Optional<StrictComponent[]>;
  props: { [key: string]: any };
};

export type OceanicFragmentNode = {
  _oceanic: true;
  type: "fragment";
  children: StrictComponent[];
};

export type OceanicContextNode = {
  _oceanic: true;
  type: "context";
  child: StrictComponent;
  value: unknown;
  contextObject: Context<unknown>;
};

export type OceanicTextNode = {
  _oceanic: true;
  type: "text";
  text: string;
};

export type OceanicNode =
  | OceanicElementNode
  | OceanicFragmentNode
  | OceanicContextNode
  | OceanicTextNode;

// --- Hook types ---

export type UseStateHandler = <T>(
  initialState: T
) => [T, (newState: T) => void];
export type UseEffectHandler = (
  create: () => (() => void) | void,
  deps: any[] | void | null
) => void;
export type UseContextHandler = <T>(context: Context<T>) => T;
