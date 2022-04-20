import {BlorpNode, BlorpElementNode, Optional, BlorpNodeConstructor, BaseProps, , PermissiveOptional, BlorpFragmentNode} from './types';

type PermissiveChild = PermissiveOptional<BlorpNodeConstructor | BlorpNode>;
type PermissiveChildren = PermissiveOptional<PermissiveChild[] | PermissiveChild>;
type Args<PropTypes> = [] | [PermissiveChildren] | [PropTypes | undefined | null, PermissiveChildren | undefined | null];

function permissiveOptionalToOptional<T>(permissiveOptional: PermissiveOptional<T>): Optional<T> {
  if (permissiveOptional === null || permissiveOptional === undefined || permissiveOptional === false) {
    return undefined;
  }
  return permissiveOptional;
}

function unpermissifyChild(permissiveChild: PermissiveChild): BlorpNodeConstructor {
  if (typeof permissiveChild === 'function') {
    return permissiveChild;
  }
  const closedChild = permissiveChild;
  return () => permissiveOptionalToOptional(closedChild);
}

function unpermissifyChildren(permissiveChildren: PermissiveChildren): Optional<BlorpNodeConstructor[]> {
  const children: BlorpNodeConstructor[] = [];
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
  const key = (props && props.key) || '';
  return {
    _blorp: true,
    type: 'element',
    tag,
    children, 
    key,
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


type FragArgs = [PermissiveChildren] | [string, PermissiveChildren];

export const frag = (...args: FragArgs): BlorpFragmentNode => {
  let children: Optional<BlorpNodeConstructor[]> = undefined;
  let key: string = '';
if (args.length === 1) {
    children = unpermissifyChildren(args[0]);
  } else {
    key = args[0];
    children = unpermissifyChildren(args[1]);
  }
  return {
    _blorp: true,
    type: 'fragment',
    children: children || [],
    key,
  };
}