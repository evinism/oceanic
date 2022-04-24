import { unpermissifyOptional, unpermissifyChildren } from "../unpermissify";
import { HtmlTag, TagParams } from "../htmltypes";
import {
  BlorpElementNode,
  PermissiveChildren,
  Optional,
  StrictComponent,
  PermissiveOptional,
} from "../types";

type Args<PropTypes> =
  | []
  | [PermissiveChildren]
  | [PermissiveOptional<PropTypes>, PermissiveChildren];

export const tag =
  <TagName extends HtmlTag>(tag: TagName) =>
    (...args: Args<TagParams<TagName>>): BlorpElementNode => {
      let props: Optional<TagParams<TagName>>;
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
    };;;;
