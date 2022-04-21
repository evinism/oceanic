# blorp: Small and mighty React-like that goes "blorp"

blorp aims to make it easy to build dynamic UIs without the need for fancy compilation.

Think of it as a reduction of the best parts of React, without any magic!

installation via `npm install --save protoblorp` for now, until it's a hint more stable.

## Overview / Examples

Basic rendering can be done as follows:

```js
// with html:
// <body><div id="root"></div></body>
import {div, p, h1, render} from 'blorp';

const component = div([
  h1("Hello, world!"),
  p("I'm blorp!")
]);

render(component, document.getElementById('root'));
```

# Hooks

Blorp has 3 hooks: `useState`, `useEffect`, and `useContext`;

Hooks in blorp are similar to their React counterparts, but are provided slightly differently:

```js
import {div, button, render} from 'blorp';

const component = ({ useState }) => {
  const [isClicked, setIsClicked] = useState(false);
  return div([
    div(isClicked ? "clicked" : "unclicked!"),
    button({onClick: () => setIsClicked(true)}, "click me!!"),
  ]);
};

render(component, document.getElementById('root'));
```

Blorp's hook model allows for true referential transparency in functions, allowing for nested
hook usage, even with conditionals!

```js
import {div, render} from 'blorp';

const component = div([
  h1("Click below I guess!"),
  ({useState}) => {
    const [outerState, setOuterState] = useState(true);
    if (!outerState) {
      return null;
    }
    return div(({ useState }) => {
      const [innerState, setInnerState] = useState("todo text");
      return `inner state: ${innerState}`;
    });
  }
]);

render(component, document.getElementById('root'));
```

## Some More Details for Those Who Want Them
If you're here, you clearly want to know more. 

### Blorp's node and component model. 

`BlorpNode`s are anything that Blorp can render. The output of `div()`, `span()`, `frag()`, or any other element is a BlorpNode.

A `Component` in blorp is simply a function from `Hooks` to an optional `BlorpNode` (or another component!);

In most cases where you pass in a Component, you can just directly pass in a Blorp Node instead.

### Dom Diffing

Blorp uses incremental dom, rather than creating a virtual dom.

### Keys
When determining which state lines up to which element in a constantly-changing web app, Blorp (like React), uses keys. While keys in React are represented as props, keys in `blorp` are more separated. Keys can be set via the `key()` function.

When rendering a series of child nodes, Blorp uses a "first come, first serve" model for lining up internal states to branches in the tree, taking keys into account.
