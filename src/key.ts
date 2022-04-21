import { unpermissifyChild } from "./helpers";
import { Component, PermissiveChild } from "./types";

export const key = (keyname: string, child: PermissiveChild): Component => {
  const result: Component = (...args) => unpermissifyChild(child)(...args);
  result.key = keyname;
  return result;
};
