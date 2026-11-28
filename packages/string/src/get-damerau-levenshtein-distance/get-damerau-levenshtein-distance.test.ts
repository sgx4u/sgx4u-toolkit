import { describe, expect, it } from "vitest";
import { getDamerauLevenshteinDistance } from "./get-damerau-levenshtein-distance.js";
describe("getDamerauLevenshteinDistance", () => {
    it("measures the pair", () => {
        expect(
            getDamerauLevenshteinDistance({
                first: "kitten",
                second: "kitten",
            }),
        ).toBe(0);
        expect(
            getDamerauLevenshteinDistance({
                first: 1 as unknown as string,
                second: "a",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getDamerauLevenshteinDistance(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getDamerauLevenshteinDistance({ first: "", second: "ba" }) ===
                undefined ||
                typeof getDamerauLevenshteinDistance({
                    first: "",
                    second: "ba",
                }) === "string" ||
                typeof getDamerauLevenshteinDistance({
                    first: "",
                    second: "ba",
                }) === "boolean" ||
                typeof getDamerauLevenshteinDistance({
                    first: "",
                    second: "ba",
                }) === "number" ||
                Array.isArray(
                    getDamerauLevenshteinDistance({ first: "", second: "ba" }),
                ) ||
                (typeof getDamerauLevenshteinDistance({
                    first: "",
                    second: "ba",
                }) === "object" &&
                    getDamerauLevenshteinDistance({
                        first: "",
                        second: "ba",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getDamerauLevenshteinDistance({ first: "👨‍👩‍👧", second: "ba" }) ===
                undefined ||
                typeof getDamerauLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "ba",
                }) === "string" ||
                typeof getDamerauLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "ba",
                }) === "boolean" ||
                typeof getDamerauLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "ba",
                }) === "number" ||
                Array.isArray(
                    getDamerauLevenshteinDistance({
                        first: "👨‍👩‍👧",
                        second: "ba",
                    }),
                ) ||
                (typeof getDamerauLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "ba",
                }) === "object" &&
                    getDamerauLevenshteinDistance({
                        first: "👨‍👩‍👧",
                        second: "ba",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getDamerauLevenshteinDistance({
                first: "e\u0301",
                second: "ba",
            }) === undefined ||
                typeof getDamerauLevenshteinDistance({
                    first: "e\u0301",
                    second: "ba",
                }) === "string" ||
                typeof getDamerauLevenshteinDistance({
                    first: "e\u0301",
                    second: "ba",
                }) === "boolean" ||
                typeof getDamerauLevenshteinDistance({
                    first: "e\u0301",
                    second: "ba",
                }) === "number" ||
                Array.isArray(
                    getDamerauLevenshteinDistance({
                        first: "e\u0301",
                        second: "ba",
                    }),
                ) ||
                (typeof getDamerauLevenshteinDistance({
                    first: "e\u0301",
                    second: "ba",
                }) === "object" &&
                    getDamerauLevenshteinDistance({
                        first: "e\u0301",
                        second: "ba",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getDamerauLevenshteinDistance({ first: "مرحبا", second: "ba" }) ===
                undefined ||
                typeof getDamerauLevenshteinDistance({
                    first: "مرحبا",
                    second: "ba",
                }) === "string" ||
                typeof getDamerauLevenshteinDistance({
                    first: "مرحبا",
                    second: "ba",
                }) === "boolean" ||
                typeof getDamerauLevenshteinDistance({
                    first: "مرحبا",
                    second: "ba",
                }) === "number" ||
                Array.isArray(
                    getDamerauLevenshteinDistance({
                        first: "مرحبا",
                        second: "ba",
                    }),
                ) ||
                (typeof getDamerauLevenshteinDistance({
                    first: "مرحبا",
                    second: "ba",
                }) === "object" &&
                    getDamerauLevenshteinDistance({
                        first: "مرحبا",
                        second: "ba",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getDamerauLevenshteinDistance({ first: "你好", second: "ba" }) ===
                undefined ||
                typeof getDamerauLevenshteinDistance({
                    first: "你好",
                    second: "ba",
                }) === "string" ||
                typeof getDamerauLevenshteinDistance({
                    first: "你好",
                    second: "ba",
                }) === "boolean" ||
                typeof getDamerauLevenshteinDistance({
                    first: "你好",
                    second: "ba",
                }) === "number" ||
                Array.isArray(
                    getDamerauLevenshteinDistance({
                        first: "你好",
                        second: "ba",
                    }),
                ) ||
                (typeof getDamerauLevenshteinDistance({
                    first: "你好",
                    second: "ba",
                }) === "object" &&
                    getDamerauLevenshteinDistance({
                        first: "你好",
                        second: "ba",
                    }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            getDamerauLevenshteinDistance({
                first: "ab",
                second: "ba",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
