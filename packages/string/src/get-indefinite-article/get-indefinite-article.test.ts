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

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getIndefiniteArticle(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(typeof getIndefiniteArticle("")).toBe("string");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof getIndefiniteArticle("👨‍👩‍👧")).toBe("string");
    });
    it("accepts a combining mark", () => {
        expect(typeof getIndefiniteArticle("e\u0301")).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(typeof getIndefiniteArticle("مرحبا")).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(typeof getIndefiniteArticle("你好")).toBe("string");
    });
    it("throws when locale is empty or not text", () => {
        expect(() => getIndefiniteArticle({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            getIndefiniteArticle({ value: "a", locale: 1 as never }),
        ).toThrow(TypeError);
    });
});
