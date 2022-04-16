import assert from 'assert';
import {renderToText, render, div, span, button} from './domal';

const html = (data: string) => data
  .trim()
  .replace(/\s+/g, ' ')
  .replace(/\s+</g, '<')
  .replace(/>\s+/g, '>');

describe('domal', () => {
  describe('renderToText', () => {
    it('should return a string', () => {
      assert(typeof renderToText(div()) === 'string');
    });

    it('should return a string with a tag', () => {
      const actual = renderToText(div([]));
      const expected = html('<div></div>');
      expect(actual).toBe(expected);
    });

    it('should handle child elements', () => {
      const element = div([
        div([]),
        span(['hello']),
        'hi'
      ]);
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

    it('should handle child elements with props', () => {
      const element = div({id: 'foo'}, [
        div([]),
        span(['hello']),
        'hi'
      ]);
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
  });

  describe("render", () => {
    it("should render to an element", () => {
      const element = document.createElement('div');
      render(span([]), element);
      expect(element.innerHTML).toBe('<span></span>');
    });

    it("should allow bare elements as children", () => {
      const element = document.createElement('div');
      render(div({id: 1}, span('hello')), element);
      expect(element.innerHTML).toBe('<div id="1"><span>hello</span></div>');
    });

    it("should allow manual rerenders", () => {
      const element = document.createElement('div');
      let count = 0;

      const node = div(span(() => `${count}`));
      render(node, element);
      expect(element.innerHTML).toBe('<div><span>0</span></div>');

      count++;
      render(node, element);
      expect(element.innerHTML).toBe('<div><span>1</span></div>');
    });

    it("should allow dynamic rerenders from internal rerenders", () => {
      const element = document.createElement('div');

      let count = 0;
      let rerenderFn: any;
      const node = div(span(({rerender}) => {
        rerenderFn = rerender;
        return `${count}`;
      }));

      render(node, element);
      expect(element.innerHTML).toBe('<div><span>0</span></div>');
      count++;
      rerenderFn();
      expect(element.innerHTML).toBe('<div><span>1</span></div>');
    });
  });
});