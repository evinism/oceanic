# Domal: Small yet Mighty DOM library

## WARNING: domal hasn't yet actually been built. This is mostly speculative!

Domal aims to make it easy to build dynamic UIs without the need for fancy compilation.

Think of it as a reduction of the best parts of React, without any magic!

```js
// with html:
// <body><div id="root"></div></body>

import {div, p, render} from domal;

const component = div({class: "foo"},
  p("hello, world!")
);

render(component, document.body.root);
```

Domal supports react-style hooks.

```js
import {useState, div, render} from domal;

const component = () => {
  const [isClicked, setIsClicked] = useState(false);
  return div([
    div(isClicked ? "clicked" : "unclicked!"),
    button({onClick: () => setIsClicked(true)}, "click me!!"),
  ]);
};
```

Domal also supports nested hooks!

```js
import {useState, div, h1, render} from domal;

const component = div([
  h1("Click below I guess!"),
  () => {
    const [isClicked, setIsClicked] = useState(false);
    return div([
      div(isClicked ? "clicked" : "unclicked!"),
      button({onClick: () => setIsClicked(true)}, "click me!!"),
    ]);
  }
]);
```




