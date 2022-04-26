import { unpermissifyChildren } from "../unpermissify";
import { OceanicFragmentNode, PermissiveChildren } from "../types";

export const frag = (
  permissiveChildren: PermissiveChildren
): OceanicFragmentNode => {
  const children = unpermissifyChildren(permissiveChildren);
  return {
    _oceanic: true,
    type: "fragment",
    children: children || [],
  };
};
