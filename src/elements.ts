import { permissiveOptionalToOptional, unpermissifyChildren } from './helpers';
import {
  BlorpElementNode,
  PermissiveChildren,
  Optional,
  BlorpNodeConstructor,
  BaseProps,
  BlorpFragmentNode
} from './types';

type Args<PropTypes> = [] | [PermissiveChildren] | [PropTypes | undefined | null, PermissiveChildren | undefined | null];

const basicElement = <PropTypes extends BaseProps = {[key: string]: any}>(tag: string) => (...args: Args<PropTypes>): BlorpElementNode => {
  let props: Optional<PropTypes>;
  let children: Optional<BlorpNodeConstructor[]> = undefined;
  if (args.length === 0) {
    props = undefined;
    children = undefined;
  } else if (args.length === 1) {
    props = undefined;
    children = unpermissifyChildren(args[0]);
  } else {
    props = permissiveOptionalToOptional(args[0]);
    children = unpermissifyChildren(args[1]);
  }
  return {
    _blorp: true,
    type: 'element',
    tag,
    children, 
    props: props || {},
  };
};

export const div = basicElement('div');
export const span = basicElement('span');
export const h1 = basicElement('h1');
export const h2 = basicElement('h2');
export const h3 = basicElement('h3');
export const h4 = basicElement('h4');
export const h5 = basicElement('h5');
export const h6 = basicElement('h6');
export const p = basicElement('p');
export const a = basicElement('a');
export const ul = basicElement('ul');
export const ol = basicElement('ol');
export const li = basicElement('li');
export const img = basicElement('img');
export const br = basicElement('br');
export const hr = basicElement('hr');
export const button = basicElement('button');
export const input = basicElement('input');


export const frag = (permissiveChildren: PermissiveChildren): BlorpFragmentNode => {
  const children = unpermissifyChildren(permissiveChildren);
  return {
    _blorp: true,
    type: 'fragment',
    children: children || [],
  };
}