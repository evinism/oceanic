import * as elements from "./htmlElementList";
import { render } from "../render";

describe("elements", () => {
  describe("various tags", () => {
    it("allows the creation of a large number of tags", () => {
      Object.entries(elements).forEach(([tagName, fn]) => {
        const container = document.createElement("div");
        render(fn(), container);
        expect(container.innerHTML).toContain(`${tagName}`);
      });
    });
  });
});
