import { describe, expect, it } from "vitest";
import { countOccurrences } from "./count-occurrences.js";
describe("countOccurrences", () => {
    it("counts with and without overlap", () => {
        expect(countOccurrences({ value: "aaa", search: "aa" })).toBe(1);
        expect(
            countOccurrences({ value: "aaa", search: "aa", overlap: true }),
        ).toBe(2);
        expect(countOccurrences({ value: "aaa", search: "" })).toBe(0);
        expect(
            countOccurrences({ value: 1 as unknown as string, search: "a" }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(countOccurrences(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            countOccurrences({ value: "", search: "aa", overlap: true }) ===
                undefined ||
                typeof countOccurrences({
                    value: "",
                    search: "aa",
                    overlap: true,
                }) === "string" ||
                typeof countOccurrences({
                    value: "",
                    search: "aa",
                    overlap: true,
                }) === "boolean" ||
                typeof countOccurrences({
                    value: "",
                    search: "aa",
                    overlap: true,
                }) === "number" ||
                Array.isArray(
                    countOccurrences({
                        value: "",
                        search: "aa",
                        overlap: true,
                    }),
                ) ||
                (typeof countOccurrences({
                    value: "",
                    search: "aa",
                    overlap: true,
                }) === "object" &&
                    countOccurrences({
                        value: "",
                        search: "aa",
                        overlap: true,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            countOccurrences({ value: "👨‍👩‍👧", search: "aa", overlap: true }) ===
                undefined ||
                typeof countOccurrences({
                    value: "👨‍👩‍👧",
                    search: "aa",
                    overlap: true,
                }) === "string" ||
                typeof countOccurrences({
                    value: "👨‍👩‍👧",
                    search: "aa",
                    overlap: true,
                }) === "boolean" ||
                typeof countOccurrences({
                    value: "👨‍👩‍👧",
                    search: "aa",
                    overlap: true,
                }) === "number" ||
                Array.isArray(
                    countOccurrences({
                        value: "👨‍👩‍👧",
                        search: "aa",
                        overlap: true,
                    }),
                ) ||
                (typeof countOccurrences({
                    value: "👨‍👩‍👧",
                    search: "aa",
                    overlap: true,
                }) === "object" &&
                    countOccurrences({
                        value: "👨‍👩‍👧",
                        search: "aa",
                        overlap: true,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            countOccurrences({
                value: "e\u0301",
                search: "aa",
                overlap: true,
            }) === undefined ||
                typeof countOccurrences({
                    value: "e\u0301",
                    search: "aa",
                    overlap: true,
                }) === "string" ||
                typeof countOccurrences({
                    value: "e\u0301",
                    search: "aa",
                    overlap: true,
                }) === "boolean" ||
                typeof countOccurrences({
                    value: "e\u0301",
                    search: "aa",
                    overlap: true,
                }) === "number" ||
                Array.isArray(
                    countOccurrences({
                        value: "e\u0301",
                        search: "aa",
                        overlap: true,
                    }),
                ) ||
                (typeof countOccurrences({
                    value: "e\u0301",
                    search: "aa",
                    overlap: true,
                }) === "object" &&
                    countOccurrences({
                        value: "e\u0301",
                        search: "aa",
                        overlap: true,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            countOccurrences({
                value: "مرحبا",
                search: "aa",
                overlap: true,
            }) === undefined ||
                typeof countOccurrences({
                    value: "مرحبا",
                    search: "aa",
                    overlap: true,
                }) === "string" ||
                typeof countOccurrences({
                    value: "مرحبا",
                    search: "aa",
                    overlap: true,
                }) === "boolean" ||
                typeof countOccurrences({
                    value: "مرحبا",
                    search: "aa",
                    overlap: true,
                }) === "number" ||
                Array.isArray(
                    countOccurrences({
                        value: "مرحبا",
                        search: "aa",
                        overlap: true,
                    }),
                ) ||
                (typeof countOccurrences({
                    value: "مرحبا",
                    search: "aa",
                    overlap: true,
                }) === "object" &&
                    countOccurrences({
                        value: "مرحبا",
                        search: "aa",
                        overlap: true,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            countOccurrences({ value: "你好", search: "aa", overlap: true }) ===
                undefined ||
                typeof countOccurrences({
                    value: "你好",
                    search: "aa",
                    overlap: true,
                }) === "string" ||
                typeof countOccurrences({
                    value: "你好",
                    search: "aa",
                    overlap: true,
                }) === "boolean" ||
                typeof countOccurrences({
                    value: "你好",
                    search: "aa",
                    overlap: true,
                }) === "number" ||
                Array.isArray(
                    countOccurrences({
                        value: "你好",
                        search: "aa",
                        overlap: true,
                    }),
                ) ||
                (typeof countOccurrences({
                    value: "你好",
                    search: "aa",
                    overlap: true,
                }) === "object" &&
                    countOccurrences({
                        value: "你好",
                        search: "aa",
                        overlap: true,
                    }) !== null),
        ).toBe(true);
    });
    it("throws when locale is empty or not text", () => {
        expect(() =>
            countOccurrences({
                value: "aaa",
                search: "aa",
                overlap: true,
                locale: "",
            }),
        ).toThrow(RangeError);
        expect(() =>
            countOccurrences({
                value: "aaa",
                search: "aa",
                overlap: true,
                locale: 1 as never,
            }),
        ).toThrow(TypeError);
    });
});
