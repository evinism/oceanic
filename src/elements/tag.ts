import { unpermissifyOptional, unpermissifyChildren } from "../unpermissify";
import { HtmlTag, TagParams } from "../htmltypes";
import {
  OceanicElementNode,
  PermissiveChildren,
  Optional,
  StrictComponent,
  PermissiveOptional,
} from "../types";

type Args<PropTypes> =
  | []
  | [PermissiveChildren]
  | [PropTypes]
  | [PermissiveOptional<PropTypes>, PermissiveChildren];

// This is a dangerous function.
export const isPermissiveChildrenOrFunctionOrArray = (
  children: unknown
): children is PermissiveChildren | Function | Array<unknown> => {
  if (!children) {
    return false;
  } else if (Array.isArray(children)) {
    return true;
  } else if ((children as any)._oceanic) {
    return true;
  } else if (typeof children === "function") {
    return true;
  } else if (typeof children === "string") {
    return true;
  }
  return false;
};

export const tag =
  <TagName extends HtmlTag>(tag: TagName) =>
  (...args: Args<TagParams<TagName>>): OceanicElementNode => {
    let props: Optional<TagParams<TagName>>;
    let children: Optional<StrictComponent[]> = undefined;
    if (args.length === 0) {
      props = undefined;
      children = undefined;
    } else if (args.length === 1) {
      const arg = args[0];
      if (isPermissiveChildrenOrFunctionOrArray(arg)) {
        props = undefined;
        children = unpermissifyChildren(arg);
      } else {
        props = arg;
        children = undefined;
      }
    } else {
      props = unpermissifyOptional(args[0]);
      children = unpermissifyChildren(args[1]);
    }
    return {
      _oceanic: true,
      type: "element",
      tag,
      children,
      props: props || {},
    };
  };;;;
