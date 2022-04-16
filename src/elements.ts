import {DomalNode, DomalElementNode, Optional, ElementChild, BaseProps, BasicElementProps, PermissiveOptional} from './types';

type PermissiveChild = PermissiveOptional<ElementChild | DomalNode>;
type PermissiveChildren = PermissiveOptional<PermissiveChild[] | PermissiveChild>;
type Args<PropTypes> = [] | [PermissiveChildren] | [PropTypes | undefined | null, PermissiveChildren | undefined | null];

function makeNullUndefined<T>(value: T | undefined | null): Optional<T> {
  return value === null ? undefined : value;
}

function unpermissifyChild(permissiveChild: PermissiveChild): Optional<ElementChild> {
  if (typeof permissiveChild === 'function') {
    return permissiveChild;
  } else if(permissiveChild) {
    const closedChild = permissiveChild;
    return () => closedChild;
  }
  return undefined;
}

function unpermissifyChildren(permissiveChildren: PermissiveChildren): Optional<ElementChild[]> {
  const children: ElementChild[] = [];
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


const basicElement = <PropTypes extends BaseProps = BasicElementProps>(tag: string) => (...args: Args<PropTypes>): DomalElementNode => {
  let props: Optional<PropTypes>;
  let children: Optional<ElementChild[]> = undefined;
  if (args.length === 0) {
    props = undefined;
    children = undefined;
  } else if (args.length === 1) {
    props = undefined;
    children = unpermissifyChildren(args[0]);
  } else {
    props = makeNullUndefined(args[0]);
    children = unpermissifyChildren(args[1]);
  }
  const key = (props && props.key) || '';
  return {
    _domal: true,
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



