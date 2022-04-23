import { unpermissifyChild } from "../unpermissify";
import { StrictComponent, PermissiveChild } from "../types";

export const key = (
  keyname: string,
  child: PermissiveChild
): StrictComponent => {
  const result: StrictComponent = unpermissifyChild(child);
  result.key = keyname;
  return result;
};
