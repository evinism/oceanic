# Oceanic: Small but mighty React-like

Oceanic aims to make it easy to build dynamic UIs without the need for fancy compilation.

Think of it as a reduction of the best parts of React, without any magic!

installation via `npm install --save oceanic`.

## Overview / Examples

Basic rendering can be done as follows:

```js
// with html:
// <body><div id="root"></div></body>
import {div, p, h1, render} from 'oceanic';

const component = div([
  h1("Hello, world!"),
  p("I'm Oceanic!")
]);

render(component, document.getElementById('root'));
```

# Hooks

Oceanic has 3 hooks: `useState`, `useEffect`, and `useContext`;

Hooks in oceanic are similar to their React counterparts, but are provided slightly differently:

```js
import {div, button, render} from 'oceanic';

const component = ({ useState }) => {
  const [isClicked, setIsClicked] = useState(false);
  return div([
    div(isClicked ? "clicked" : "unclicked!"),
    button({onclick: () => setIsClicked(true)}, "click me!!"),
  ]);
};

render(component, document.getElementById('root'));
```

Oceanic's hook model allows for true referential transparency in functions, allowing for nested
hook usage, even with conditionals!

```js
import {div, render} from 'oceanic';

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

## Some More Details for all Who Want Them
If you're here, you clearly want to know more. 

### Oceanic's node and component model. 

`OceanicNode`s are anything that Oceanic can render. The output of `div()`, `span()`, `frag()`, or any other element is a OceanicNode. A `Component` in oceanic is simply a function from `Hooks` to an optional `OceanicNode`

In most cases where you pass in a Component, you can just directly pass in a Oceanic Node instead.

### Dom Diffing

Oceanic uses incremental dom, rather than creating a virtual dom. 

### Keys
When determining which state lines up to which element in a constantly-changing web app, Oceanic (like React), uses keys. While keys in React are represented as props, keys in `oceanic` are more separated. Keys can be set via the `key()` function.

When rendering a series of child nodes, Oceanic uses a "first come, first serve" model for lining up internal states to branches in the tree, taking keys into account.
