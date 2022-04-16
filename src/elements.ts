import {DomalNode, DomalElementNode, Optional, DomRepresentedProp} from './types';


const domRepresentedPropNames: DomRepresentedProp[] = ['id', 'class', 'value', 'checked', 'selected', 'disabled', 'readonly', 'hidden', 'tabindex'];
type BasicElementProps = { [key in DomRepresentedProp]?: string | boolean | number };

type Child = DomalNode | (() => DomalNode);
type Args<PropTypes> = [] | [Child[] | undefined | null] | [PropTypes | undefined | null, Child[] | undefined | null];

function makeNullUndefined<T>(value: T | undefined | null): Optional<T> {
  return value === null ? undefined : value;
}

const basicElement = <PropTypes=BasicElementProps>(tagName: string) => (...args: Args<PropTypes>): DomalElementNode => {
  let props: Optional<PropTypes>;
  let children: Optional<Child[]>;
  if (args.length === 0) {
    props = undefined;
    children = undefined;
  } else if (args.length === 1) {
    props = undefined;
    children = makeNullUndefined(args[0]);
  } else {
    props = makeNullUndefined(args[0]);
    children = makeNullUndefined(args[1]);
  }

  const poppedProps = props || {};
  let domRepresentedProps: DomalElementNode['domRepresentedProps'] = {};
  let jsAssignedProps: DomalElementNode['jsAssignedProps'] = {};
  for (let propName in poppedProps){
    if (domRepresentedPropNames.indexOf(propName as DomRepresentedProp) !== -1) {
      domRepresentedProps[propName as DomRepresentedProp] = (poppedProps as any)[propName];
    } else {
      jsAssignedProps[propName] = (poppedProps as any)[propName];
    }
  }

  for (let propName of domRepresentedPropNames) {
    if (props && (props as any)[propName]) {
      domRepresentedProps[propName] = (props as any)[propName];
    }
  }

  const fullyRenderedChildren = children ? children.map(child => {
    if (typeof child === 'function') {
      return child();
    } else {
      return child;
    }
  }) : undefined;

  return {
    _domal: true,
    type: 'element',
    tag: tagName,
    children: fullyRenderedChildren,
    domRepresentedProps: domRepresentedProps,
    jsAssignedProps: {},
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



