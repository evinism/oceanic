export type DomRepresentedProp = 'id' | 'class' | 'value' | 'checked' | 'selected' | 'disabled' | 'readonly' | 'hidden' | 'tabindex';


export interface BaseProps {
  key?: string;
};

export type BasicElementProps =  {
  [key in DomRepresentedProp]?: string | boolean | number;
} & BaseProps;

interface BlorpConstructorArguments {
  rerender: () => void;
}

export type BlorpNodeConstructor = (args: BlorpConstructorArguments) => Optional<BlorpNode>;

export type BlorpElementNode = {
  _blorp: true,
  type: "element",
  tag: string;
  children: Optional<(BlorpNodeConstructor)[]>;
  key: string,
  props: { [key: string]: any };
}

export type BlorpFragmentNode = {
  _blorp: true,
  type: "fragment",
  children: BlorpNodeConstructor[];
  key: string;
}

export type BlorpNode = BlorpElementNode | BlorpFragmentNode | string;

export type Optional<T> = T | undefined;
export type PermissiveOptional<T> = T | undefined | null | false;
export type UseStateHandler<T> = (initialState: T) => [T, (newState: T) => void];
