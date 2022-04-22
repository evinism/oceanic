import { unpermissifyOptional, unpermissifyChildren } from "./helpers";
import {
  BlorpElementNode,
  PermissiveChildren,
  Optional,
  Component,
  PermissiveOptional,
  BaseProps,
  BlorpFragmentNode,
} from "./types";

type Args<PropTypes> =
  | []
  | [PermissiveChildren]
  | [PermissiveOptional<PropTypes>, PermissiveChildren];

export const tag =
  <
    TagDomain extends string = string,
    PropTypes extends BaseProps = { [key: string]: any }
  >(
    tag: TagDomain
  ) =>
  (...args: Args<PropTypes>): BlorpElementNode => {
    let props: Optional<PropTypes>;
    let children: Optional<Component[]> = undefined;
    if (args.length === 0) {
      props = undefined;
      children = undefined;
    } else if (args.length === 1) {
      props = undefined;
      children = unpermissifyChildren(args[0]);
    } else {
      props = unpermissifyOptional(args[0]);
      children = unpermissifyChildren(args[1]);
    }
    return {
      _blorp: true,
      type: "element",
      tag,
      children,
      props: props || {},
    };
  };

export const frag = (
  permissiveChildren: PermissiveChildren
): BlorpFragmentNode => {
  const children = unpermissifyChildren(permissiveChildren);
  return {
    _blorp: true,
    type: "fragment",
    children: children || [],
  };
};
