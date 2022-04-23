import { unpermissifyChildren } from "./helpers";
import { BlorpFragmentNode, PermissiveChildren } from "./types";

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
