import assert from "assert";
import { html } from "./testhelpers";

import { renderToText, div, span, frag } from ".";
import { createContext } from "./context";

describe("#renderToText", () => {
  it("should return a string", () => {
    assert(typeof renderToText(div()) === "string");
  });

  it("should return a string with a tag", () => {
    const actual = renderToText(div([]));
    const expected = html("<div></div>");
    expect(actual).toBe(expected);
  });

  it("should handle child elements", () => {
    const element = div([div([]), span(["hello"]), "hi"]);
    const actual = renderToText(element);
    const expected = html(`
      <div>
        <div></div>
        <span>hello</span>
        hi
      </div>
    `);
    expect(actual).toBe(expected);
  });

  it("should handle child elements with props", () => {
    const element = div({ id: "foo" }, [div([]), span(["hello"]), "hi"]);
    const actual = renderToText(element);
    const expected = html(`
      <div id="foo">
        <div></div>
        <span>hello</span>
        hi
      </div>
    `);
    expect(actual).toBe(expected);
  });

  it("should handle frangments", () => {
    const element = div({ id: "foo" }, [
      frag([div("one"), span("two")]),
      frag([div("three"), span("four")]),
      "five",
    ]);
    const actual = renderToText(element);
    const expected = html(`
      <div id="foo">
        <div>one</div>
        <span>two</span>
        <div>three</div>
        <span>four</span>
        five
      </div>
    `);
    expect(actual).toBe(expected);
  });

  it("should render components with initial state", () => {
    const element = div({ id: "foo" }, ({ useState }) => {
      const [count, __] = useState(0);
      return div("count: " + count);
    });
    const actual = renderToText(element);
    const expected = html(`
      <div id="foo">
        <div>count: 0</div>
      </div>
    `);
    expect(actual).toBe(expected);
  });

  it("should render components with context", () => {
    const context = createContext(501);

    const element = context.provide(
      502,
      div({ id: "foo" }, ({ useContext }) => {
        const value = useContext(context);
        return div("count: " + value);
      })
    );
    const actual = renderToText(element);
    const expected = html(`
      <div id="foo">
        <div>count: 502</div>
      </div>
    `);
    expect(actual).toBe(expected);
  });
  it("should render components with context", () => {
    const context = createContext(501);
    const element = div({ id: "foo" }, ({ useContext }) => {
      const value = useContext(context);
      return div("count: " + value);
    });
    const actual = renderToText(element);
    const expected = html(`
      <div id="foo">
        <div>count: 501</div>
      </div>
    `);
    expect(actual).toBe(expected);
  });

  it("should allow contexts to be overwritten", () => {
    const context = createContext(501);
    const element = context.provide(
      502,
      context.provide(
        503,
        div({ id: "foo" }, ({ useContext }) => {
          const value = useContext(context);
          return div("count: " + value);
        })
      )
    );

    const actual = renderToText(element);
    const expected = html(`
      <div id="foo">
        <div>count: 503</div>
      </div>
    `);
    expect(actual).toBe(expected);
  });
});
