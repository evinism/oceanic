import { getKey } from "./helpers";
import {
  PermissiveChild,
  PermissiveChildren,
  Optional,
  PermissiveOptional,
  OceanicNode,
  StrictComponent,
  PermissiveNode,
  OceanicFragmentNode,
} from "./types";

export function unpermissifyOptional<T>(
  permissiveOptional: PermissiveOptional<T>
): Optional<T> {
  if (
    permissiveOptional === null ||
    permissiveOptional === undefined ||
    permissiveOptional === false
  ) {
    return undefined;
  }
  return permissiveOptional;
}

export const unpermissifyNode = (
  permissiveNode: PermissiveNode
): Optional<OceanicNode> => {
  let strictNode: Optional<OceanicNode>;
  if (typeof permissiveNode === "string") {
    strictNode = {
      _oceanic: true,
      type: "text",
      text: permissiveNode,
    };
  } else {
    strictNode = unpermissifyOptional(permissiveNode);
  }
  return strictNode;
};

export function unpermissifyChild(
  permissiveChild: PermissiveChild
): StrictComponent {
  // TODO: We need to maintain key semantics here.
  if (typeof permissiveChild === "function") {
    const bound = permissiveChild;
    let retval: StrictComponent = (hooks) => {
      const res = bound(hooks);
      if (typeof res === "function") {
        // If we get a function back, we wrap it in a fragment
        const fragRes: OceanicFragmentNode = {
          _oceanic: true,
          type: "fragment",
          children: unpermissifyChildren(res)!,
        };
        return fragRes;
      }
      return unpermissifyNode(res);
    };
    retval.key = getKey(permissiveChild);
    return retval;
  }
  const strictNode = unpermissifyNode(permissiveChild);
  return () => strictNode;
}

export function unpermissifyChildren(
  permissiveChildren: PermissiveChildren
): Optional<StrictComponent[]> {
  const children: StrictComponent[] = [];
  if (!permissiveChildren) {
    return undefined;
  }
  const maybePush = (permissiveChild: PermissiveChild) => {
    const unpermissified = unpermissifyChild(permissiveChild);
    if (unpermissified) {
      children.push(unpermissified);
    }
  };

  if (Array.isArray(permissiveChildren)) {
    for (let child of permissiveChildren) {
      maybePush(child);
    }
  } else {
    maybePush(permissiveChildren);
  }
  return children;
}
