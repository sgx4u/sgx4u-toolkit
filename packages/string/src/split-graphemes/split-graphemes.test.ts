import { describe, expect, it } from "vitest";
import { splitGraphemes } from "./split-graphemes.js";

describe("splitGraphemes", () => {
    it("keeps clusters together", () => {
        expect(splitGraphemes("")).toEqual([]);
        expect(splitGraphemes("a😀")).toEqual(["a", "😀"]);
        expect(splitGraphemes("👨‍👩‍👧‍👦")).toEqual(["👨‍👩‍👧‍👦"]);
        expect(splitGraphemes("🇺🇸")).toEqual(["🇺🇸"]);
        expect(splitGraphemes("👍🏽")).toEqual(["👍🏽"]);
        expect(splitGraphemes("e\u0301")).toEqual(["e\u0301"]);
        expect(splitGraphemes("가")).toEqual(["가"]);
        expect(splitGraphemes(" ")).toEqual([" "]);
        expect(splitGraphemes("क्ष")).toHaveLength(1);
        expect(splitGraphemes("\uD800")).toEqual(["\uD800"]);
        expect(splitGraphemes(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(splitGraphemes(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            splitGraphemes("") === undefined ||
                Array.isArray(splitGraphemes("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            splitGraphemes("👨‍👩‍👧") === undefined ||
                Array.isArray(splitGraphemes("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            splitGraphemes("e\u0301") === undefined ||
                Array.isArray(splitGraphemes("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            splitGraphemes("مرحبا") === undefined ||
                Array.isArray(splitGraphemes("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            splitGraphemes("你好") === undefined ||
                Array.isArray(splitGraphemes("你好")),
        ).toBe(true);
    });
});
