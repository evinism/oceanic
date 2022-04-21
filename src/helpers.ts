import {
  PermissiveChild,
  PermissiveChildren,
  Optional,
  Component,
  PermissiveOptional,
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

export function unpermissifyChild(permissiveChild: PermissiveChild): Component {
  if (typeof permissiveChild === "function") {
    return permissiveChild;
  }
  const closedChild = permissiveChild;
  return () => unpermissifyOptional(closedChild);
}

export function unpermissifyChildren(
  permissiveChildren: PermissiveChildren
): Optional<Component[]> {
  const children: Component[] = [];
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
