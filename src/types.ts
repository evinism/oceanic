export type DomRepresentedProp = 'id' | 'class' | 'value' | 'checked' | 'selected' | 'disabled' | 'readonly' | 'hidden' | 'tabindex';


export type DomalElementNode = {
  _domal: true,
  type: "element",
  tag: string;
  children: Optional<DomalNode[]>;
  domRepresentedProps: { [key in DomRepresentedProp]?: string | boolean | number };
  jsAssignedProps: { [key: string]: any };
} 
export type DomalNode = DomalElementNode | string;


export type Optional<T> = T | undefined;
