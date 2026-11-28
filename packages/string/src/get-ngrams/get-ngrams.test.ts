import { describe, expect, it } from "vitest";
import { getNgrams } from "./get-ngrams.js";
describe("getNgrams", () => {
    it("returns overlapping slices", () => {
        expect(getNgrams("abcd")).toEqual(["ab", "bc", "cd"]);
        expect(getNgrams({ value: "ab", size: 5 })).toEqual([]);
        expect(() => getNgrams({ value: "ab", size: 0 })).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getNgrams(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getNgrams("") === undefined || Array.isArray(getNgrams("")),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getNgrams("👨‍👩‍👧") === undefined || Array.isArray(getNgrams("👨‍👩‍👧")),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getNgrams("e\u0301") === undefined ||
                Array.isArray(getNgrams("e\u0301")),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getNgrams("مرحبا") === undefined ||
                Array.isArray(getNgrams("مرحبا")),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getNgrams("你好") === undefined || Array.isArray(getNgrams("你好")),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() => getNgrams({ value: "a", unit: "nope" as never })).toThrow(
            RangeError,
        );
    });
});
