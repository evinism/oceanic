import assert from "assert";
import { html } from "./testhelpers";

import { renderToText, div, span, frag, CustomHook } from ".";
import { createContext } from "./context";
import { render } from "./render";

function useNumericTransion(
  { useState, useEffect, hook },
  initialValue: number
): [number, number, (value: number) => void] {
  const [value, setValue] = useState(initialValue);
  const [transitionValue, setTransitionValue] = useState(initialValue);
  const setValueWithTransition = (value: number) => {
    setValue(value);
  };
  useEffect(() => {
    const id = setInterval(() => {
      setTransitionValue((transitionValue: number) => {
        if (transitionValue === value) {
          clearInterval(id);
          return value;
        }
        return (
          transitionValue + Math.max(-1, Math.min(1, value - transitionValue))
        );
      });
    }, 20);
    return () => clearInterval(id);
  }, [value]);
  return [value, transitionValue, setValueWithTransition];
}

describe("custom hooks", () => {
  it("should allow bare elements as children", () => {
    const element = document.createElement("div");
    render(div({ id: 1 }, span("hello")), element);
    expect(element.innerHTML).toBe('<div id="1"><span>hello</span></div>');
  });
});
