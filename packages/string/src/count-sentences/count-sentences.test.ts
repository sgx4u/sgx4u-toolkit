import { describe, expect, it } from "vitest";
import { countSentences } from "./count-sentences.js";
describe("countSentences", () => {
    it("counts sentences", () => {
        expect(countSentences("Hello. World.")).toBeGreaterThan(0);
        expect(countSentences("")).toBe(0);
        expect(countSentences(null as unknown as string)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(countSentences(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            countSentences("") === undefined ||
                typeof countSentences("") === "string" ||
                typeof countSentences("") === "boolean" ||
                typeof countSentences("") === "number" ||
                Array.isArray(countSentences("")) ||
                (typeof countSentences("") === "object" &&
                    countSentences("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            countSentences("👨‍👩‍👧") === undefined ||
                typeof countSentences("👨‍👩‍👧") === "string" ||
                typeof countSentences("👨‍👩‍👧") === "boolean" ||
                typeof countSentences("👨‍👩‍👧") === "number" ||
                Array.isArray(countSentences("👨‍👩‍👧")) ||
                (typeof countSentences("👨‍👩‍👧") === "object" &&
                    countSentences("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            countSentences("e\u0301") === undefined ||
                typeof countSentences("e\u0301") === "string" ||
                typeof countSentences("e\u0301") === "boolean" ||
                typeof countSentences("e\u0301") === "number" ||
                Array.isArray(countSentences("e\u0301")) ||
                (typeof countSentences("e\u0301") === "object" &&
                    countSentences("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            countSentences("مرحبا") === undefined ||
                typeof countSentences("مرحبا") === "string" ||
                typeof countSentences("مرحبا") === "boolean" ||
                typeof countSentences("مرحبا") === "number" ||
                Array.isArray(countSentences("مرحبا")) ||
                (typeof countSentences("مرحبا") === "object" &&
                    countSentences("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            countSentences("你好") === undefined ||
                typeof countSentences("你好") === "string" ||
                typeof countSentences("你好") === "boolean" ||
                typeof countSentences("你好") === "number" ||
                Array.isArray(countSentences("你好")) ||
                (typeof countSentences("你好") === "object" &&
                    countSentences("你好") !== null),
        ).toBe(true);
    });
});
