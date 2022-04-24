// Nasty circular import things
import { Context } from "./context";

// --- Helper types ---
export type Optional<T> = T | undefined;
export type PermissiveOptional<T> = T | undefined | null | false | void;

export type PermissiveChild = PermissiveOptional<
  Component | BlorpNode | string
>;
export type PermissiveChildren = PermissiveOptional<
  PermissiveChild[] | PermissiveChild
>;

// --- Blorp Node and Constructor types ---
export interface Hooks {
  rerender: () => void;
  useState: UseStateHandler;
  useEffect: UseEffectHandler;
  useContext: UseContextHandler;
}

export type PermissiveNode = PermissiveOptional<BlorpNode | string>;

export type PermissiveComponent = ((
  hooks: Hooks
) => PermissiveOptional<PermissiveNode | PermissiveComponent>) & {
  key?: string;
};

// This name is only to be used externally
export type Component = PermissiveComponent;

export type StrictComponent = ((hooks: Hooks) => Optional<BlorpNode>) & {
  key?: string;
};

export type BlorpElementNode = {
  _blorp: true;
  type: "element";
  tag: string;
  children: Optional<StrictComponent[]>;
  props: { [key: string]: any };
};

export type BlorpFragmentNode = {
  _blorp: true;
  type: "fragment";
  children: StrictComponent[];
};

export type BlorpContextNode = {
  _blorp: true;
  type: "context";
  child: StrictComponent;
  value: unknown;
  contextObject: Context<unknown>;
};

export type BlorpTextNode = {
  _blorp: true;
  type: "text";
  text: string;
};

export type BlorpNode =
  | BlorpElementNode
  | BlorpFragmentNode
  | BlorpContextNode
  | BlorpTextNode;

// --- Hook types ---

export type UseStateHandler = <T>(
  initialState: T
) => [T, (newState: T) => void];
export type UseEffectHandler = (
  create: () => (() => void) | void,
  deps: any[] | void | null
) => void;
export type UseContextHandler = <T>(context: Context<T>) => T;
