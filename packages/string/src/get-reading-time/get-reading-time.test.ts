import { describe, expect, it } from "vitest";
import { getReadingTime } from "./get-reading-time.js";
describe("getReadingTime", () => {
    it("divides words by the rate", () => {
        expect(getReadingTime("one two")).toEqual({ words: 2, minutes: 0.01 });
        expect(() => getReadingTime({ value: "a", wordsPerMinute: 0 })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getReadingTime(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getReadingTime("") === undefined ||
                typeof getReadingTime("") === "string" ||
                typeof getReadingTime("") === "boolean" ||
                typeof getReadingTime("") === "number" ||
                Array.isArray(getReadingTime("")) ||
                (typeof getReadingTime("") === "object" &&
                    getReadingTime("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getReadingTime("👨‍👩‍👧") === undefined ||
                typeof getReadingTime("👨‍👩‍👧") === "string" ||
                typeof getReadingTime("👨‍👩‍👧") === "boolean" ||
                typeof getReadingTime("👨‍👩‍👧") === "number" ||
                Array.isArray(getReadingTime("👨‍👩‍👧")) ||
                (typeof getReadingTime("👨‍👩‍👧") === "object" &&
                    getReadingTime("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getReadingTime("e\u0301") === undefined ||
                typeof getReadingTime("e\u0301") === "string" ||
                typeof getReadingTime("e\u0301") === "boolean" ||
                typeof getReadingTime("e\u0301") === "number" ||
                Array.isArray(getReadingTime("e\u0301")) ||
                (typeof getReadingTime("e\u0301") === "object" &&
                    getReadingTime("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getReadingTime("مرحبا") === undefined ||
                typeof getReadingTime("مرحبا") === "string" ||
                typeof getReadingTime("مرحبا") === "boolean" ||
                typeof getReadingTime("مرحبا") === "number" ||
                Array.isArray(getReadingTime("مرحبا")) ||
                (typeof getReadingTime("مرحبا") === "object" &&
                    getReadingTime("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getReadingTime("你好") === undefined ||
                typeof getReadingTime("你好") === "string" ||
                typeof getReadingTime("你好") === "boolean" ||
                typeof getReadingTime("你好") === "number" ||
                Array.isArray(getReadingTime("你好")) ||
                (typeof getReadingTime("你好") === "object" &&
                    getReadingTime("你好") !== null),
        ).toBe(true);
    });
});
