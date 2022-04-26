import { PermissiveComponent } from "./types";

export const getKey = (component: PermissiveComponent): string => {
  return component.key || component.name || `oceanic-auto-key`;
};
