import assert from "assert";
import { renderToText, render, div, span, button, key } from "./blorp";
import { frag, h1 } from "./elements";
import { useState } from "./hooks";

const html = (data: string) =>
  data.trim().replace(/\s+/g, " ").replace(/\s+</g, "<").replace(/>\s+/g, ">");

describe("blorp", () => {
  describe("renderToText", () => {
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
  });

  describe("render", () => {
    it("should render to an element", () => {
      const element = document.createElement("div");
      render(span([]), element);
      expect(element.innerHTML).toBe("<span></span>");
    });

    it("should allow bare elements as children", () => {
      const element = document.createElement("div");
      render(div({ id: 1 }, span("hello")), element);
      expect(element.innerHTML).toBe('<div id="1"><span>hello</span></div>');
    });

    it("should allow fragments", () => {
      const element = document.createElement("div");
      const def = div({ id: "foo" }, [
        frag([div("one"), span("two")]),
        frag([div("three"), span("four")]),
        "five",
      ]);
      render(def, element);
      expect(element.innerHTML).toBe(
        html(`
       <div id="foo">
          <div>one</div>
          <span>two</span>
          <div>three</div>
          <span>four</span>
          five
        </div>`)
      );
    });

    it("should allow manual rerenders", () => {
      const element = document.createElement("div");
      let count = 0;

      const node = div(span(() => `${count}`));
      render(node, element);
      expect(element.innerHTML).toBe("<div><span>0</span></div>");

      count++;
      render(node, element);
      expect(element.innerHTML).toBe("<div><span>1</span></div>");
    });

    it("should allow dynamic rerenders from internal rerenders", () => {
      const element = document.createElement("div");

      let count = 0;
      let rerenderFn: any;
      const node = div(
        span(({ rerender }) => {
          rerenderFn = rerender;
          return `${count}`;
        })
      );

      render(node, element);
      expect(element.innerHTML).toBe("<div><span>0</span></div>");
      count++;
      rerenderFn();
      expect(element.innerHTML).toBe("<div><span>1</span></div>");
    });

    it("should allow basic useState calls", () => {
      let outsideSetCount: any;
      const element = document.createElement("div");
      const node = div(() => {
        const [count, setCount] = useState(0);
        outsideSetCount = setCount;
        return span(`${count}`);
      });

      render(node, element);
      expect(element.innerHTML).toBe("<div><span>0</span></div>");
      outsideSetCount(10);
      expect(element.innerHTML).toBe("<div><span>10</span></div>");
    });

    it("should maintain state when rerendered manually", () => {
      let outsideSetCount: any;
      const element = document.createElement("div");
      const node = div(() => {
        const [count, setCount] = useState(0);
        outsideSetCount = setCount;
        return span(`${count}`);
      });

      render(node, element);
      expect(element.innerHTML).toBe("<div><span>0</span></div>");
      outsideSetCount(10);
      expect(element.innerHTML).toBe("<div><span>10</span></div>");
      element.innerHTML = ""; // while this is undefined behavior, it's a good test
      render(node, element);
      expect(element.innerHTML).toBe("<div><span>10</span></div>");
    });

    it("should allow multiple useState calls", () => {
      let outsideSetCount: any;
      let outsideSetText: any;

      const element = document.createElement("div");
      const node = div(() => {
        const [count, setCount] = useState(0);
        const [text, setText] = useState("hello");
        outsideSetCount = setCount;
        outsideSetText = setText;
        return span(`${count} ${text}`);
      });

      render(node, element);
      expect(element.innerHTML).toBe("<div><span>0 hello</span></div>");
      outsideSetCount(10);
      expect(element.innerHTML).toBe("<div><span>10 hello</span></div>");
      outsideSetText("world");
      expect(element.innerHTML).toBe("<div><span>10 world</span></div>");
      outsideSetCount(20);
      expect(element.innerHTML).toBe("<div><span>20 world</span></div>");
    });

    it("should allow setState of two parallel components", () => {
      let outsideSetCountOne: any;
      let outsideSetCountTwo: any;

      const element = document.createElement("div");
      const node = div([
        () => {
          const [count, setCount] = useState(1);
          outsideSetCountOne = setCount;
          return span(`${count}`);
        },
        () => {
          const [count, setCount] = useState(2);
          outsideSetCountTwo = setCount;
          return span(`${count}`);
        },
      ]);

      render(node, element);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>1</span>
          <span>2</span>
        </div>
      `)
      );
      outsideSetCountOne(10);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>10</span>
          <span>2</span>
        </div>
      `)
      );
      outsideSetCountTwo(20);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>10</span>
          <span>20</span>
        </div>
      `)
      );
      outsideSetCountOne(3);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>3</span>
          <span>20</span>
        </div>
      `)
      );
    });

    it("should allow setState of two parallel fragments", () => {
      let outsideSetCountOne: any;
      let outsideSetCountTwo: any;

      const element = document.createElement("div");
      const node = div([
        () => {
          const [count, setCount] = useState(1);
          outsideSetCountOne = setCount;
          return frag([span(`${count} one`), span(`${count} two`)]);
        },
        () => {
          const [count, setCount] = useState(2);
          outsideSetCountTwo = setCount;
          return frag([span(`${count} three`), span(`${count} four`)]);
        },
      ]);

      render(node, element);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>1 one</span>
          <span>1 two</span>
          <span>2 three</span>
          <span>2 four</span>
        </div>
      `)
      );
      outsideSetCountOne(10);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>10 one</span>
          <span>10 two</span>
          <span>2 three</span>
          <span>2 four</span>
        </div>
      `)
      );
      outsideSetCountTwo(20);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>10 one</span>
          <span>10 two</span>
          <span>20 three</span>
          <span>20 four</span>
        </div>
      `)
      );
      outsideSetCountOne(3);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>3 one</span>
          <span>3 two</span>
          <span>20 three</span>
          <span>20 four</span>
        </div>
      `)
      );
    });

    it("should rebuild render context for eliminated parts of the tree", () => {
      let setExternalState: any;
      let setInternalState: any;

      const element = document.createElement("div");
      const node = div(() => {
        const [shouldRenderChild, setShouldRenderChild] = useState(true);
        setExternalState = setShouldRenderChild;
        return shouldRenderChild
          ? h1(() => {
              const [count, setCount] = useState(1);
              setInternalState = setCount;
              return `${count}`;
            })
          : null;
      });

      render(node, element);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <h1>1</h1>
        </div>
      `)
      );
      setInternalState(2);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <h1>2</h1>
        </div>
      `)
      );
      setExternalState(false);
      expect(element.innerHTML).toBe(
        html(`
        <div></div>
      `)
      );
      setExternalState(true);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <h1>1</h1>
        </div>
      `)
      );
      setInternalState(2);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <h1>2</h1>
        </div>
      `)
      );
    });

    it("should blow away state if rendering something with a new key", () => {
      let outsideSetCount: any[] = [];
      const element = document.createElement("div");
      const node = (num: number) =>
        key(`key${num}`, () => {
          const [count, setCount] = useState(0);
          outsideSetCount[num] = setCount;
          return span(`${count}`);
        });

      render(div([node(0), node(1)]), element);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>0</span>
          <span>0</span>
        </div>
      `)
      );
      outsideSetCount[0](5);
      outsideSetCount[1](6);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>5</span>
          <span>6</span>
        </div>
      `)
      );

      render(div([node(2), node(3)]), element);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>0</span>
          <span>0</span>
        </div>
      `)
      );
    });

    it("should blow away state if rendering something with a new state", () => {
      let outsideSetCount: any[] = [];
      const element = document.createElement("div");
      const node = (num: number) =>
        key(`key${num}`, () => {
          const [count, setCount] = useState(0);
          outsideSetCount[num] = setCount;
          return span(`${count}`);
        });

      render(div([node(0), node(1)]), element);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>0</span>
          <span>0</span>
        </div>
      `)
      );
      outsideSetCount[0](5);
      outsideSetCount[1](6);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>5</span>
          <span>6</span>
        </div>
      `)
      );

      render(div([node(1), node(0)]), element);
      expect(element.innerHTML).toBe(
        html(`
        <div>
          <span>6</span>
          <span>5</span>
        </div>
      `)
      );
    });
  });
});
