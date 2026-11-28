import { describe, expect, it } from "vitest";
import { getIndefiniteArticle } from "./get-indefinite-article.js";
describe("getIndefiniteArticle", () => {
    it("chooses a or an from pronunciation", () => {
        expect(getIndefiniteArticle("apple")).toBe("an");
        expect(getIndefiniteArticle("honour")).toBe("an");
        expect(getIndefiniteArticle("unicorn")).toBe("a");
        expect(getIndefiniteArticle("8")).toBe("an");
        expect(getIndefiniteArticle("FBI")).toBe("an");
        expect(getIndefiniteArticle("cat")).toBe("a");
        expect(getIndefiniteArticle(null as unknown as string)).toBeUndefined();
    });
});
