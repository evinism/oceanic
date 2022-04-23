import { unpermissifyOptional, unpermissifyChildren } from "./helpers";
import { HtmlTag } from "./htmltypes";
import {
  BlorpElementNode,
  PermissiveChildren,
  Optional,
  StrictComponent,
  PermissiveOptional,
  BaseProps,
} from "./types";

type Args<PropTypes> =
  | []
  | [PermissiveChildren]
  | [PermissiveOptional<PropTypes>, PermissiveChildren];

export const tag =
  <
    TagDomain extends HtmlTag,
    PropTypes extends BaseProps = { [key: string]: any }
  >(
    tag: TagDomain
  ) =>
  (...args: Args<PropTypes>): BlorpElementNode => {
    let props: Optional<PropTypes>;
    let children: Optional<StrictComponent[]> = undefined;
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
