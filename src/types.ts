export type DomRepresentedProp = 'id' | 'class' | 'value' | 'checked' | 'selected' | 'disabled' | 'readonly' | 'hidden' | 'tabindex';


export interface BaseProps {
  key?: string;
};

export type BasicElementProps =  {
  [key in DomRepresentedProp]?: string | boolean | number;
} & BaseProps;

interface DomalConstructorArguments {
  rerender: () => void;
}

export type DomalNodeConstructor = (args: DomalConstructorArguments) => DomalNode;

export type DomalElementNode = {
  _domal: true,
  type: "element",
  tag: string;
  children: Optional<(DomalNodeConstructor)[]>;
  key: string,
  props: { [key: string]: any };
}

export type DomalNode = DomalElementNode | string;

export type Optional<T> = T | undefined;
export type PermissiveOptional<T> = T | undefined | null | false;
