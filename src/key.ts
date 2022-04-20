import { unpermissifyChild } from './helpers';
import {BlorpNodeConstructor, PermissiveChild} from './types';

export const key = (keyname: string, child: PermissiveChild): BlorpNodeConstructor => {
  const result: BlorpNodeConstructor = (...args) => unpermissifyChild(child)(...args);
  result.key = keyname;
  return result
}