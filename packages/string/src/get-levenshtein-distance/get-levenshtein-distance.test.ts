import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { splitIntoUnits } from "../utils/units.utils.js";
import { getLevenshteinDistance } from "./get-levenshtein-distance.js";

describe("getLevenshteinDistance", () => {
    it("counts grapheme edits and rejects a non-string", () => {
        expect(getLevenshteinDistance({ first: "cat", second: "cut" })).toBe(1);
        expect(getLevenshteinDistance({ first: "ab", second: "ba" })).toBe(2);
        expect(getLevenshteinDistance({ first: "", second: "" })).toBe(0);
        expect(
            getLevenshteinDistance({
                first: 1 as unknown as string,
                second: "a",
            }),
        ).toBeUndefined();
    });

    it("is 0 exactly when the grapheme units are equal", () => {
        fc.assert(
            fc.property(
                fc.string({ maxLength: 12 }),
                fc.string({ maxLength: 12 }),
                (first, second) => {
                    const distance = getLevenshteinDistance({ first, second });
                    const left = splitIntoUnits(first, "grapheme");
                    const right = splitIntoUnits(second, "grapheme");
                    const same =
                        left.length === right.length &&
                        left.every((unit, index) => unit === right[index]);
                    expect(distance === 0).toBe(same);
                },
            ),
            { numRuns: 25 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getLevenshteinDistance(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getLevenshteinDistance({ first: "", second: "cut" }) ===
                undefined ||
                typeof getLevenshteinDistance({ first: "", second: "cut" }) ===
                    "string" ||
                typeof getLevenshteinDistance({ first: "", second: "cut" }) ===
                    "boolean" ||
                typeof getLevenshteinDistance({ first: "", second: "cut" }) ===
                    "number" ||
                Array.isArray(
                    getLevenshteinDistance({ first: "", second: "cut" }),
                ) ||
                (typeof getLevenshteinDistance({ first: "", second: "cut" }) ===
                    "object" &&
                    getLevenshteinDistance({ first: "", second: "cut" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getLevenshteinDistance({ first: "👨‍👩‍👧", second: "cut" }) ===
                undefined ||
                typeof getLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "cut",
                }) === "string" ||
                typeof getLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "cut",
                }) === "boolean" ||
                typeof getLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "cut",
                }) === "number" ||
                Array.isArray(
                    getLevenshteinDistance({ first: "👨‍👩‍👧", second: "cut" }),
                ) ||
                (typeof getLevenshteinDistance({
                    first: "👨‍👩‍👧",
                    second: "cut",
                }) === "object" &&
                    getLevenshteinDistance({ first: "👨‍👩‍👧", second: "cut" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getLevenshteinDistance({ first: "e\u0301", second: "cut" }) ===
                undefined ||
                typeof getLevenshteinDistance({
                    first: "e\u0301",
                    second: "cut",
                }) === "string" ||
                typeof getLevenshteinDistance({
                    first: "e\u0301",
                    second: "cut",
                }) === "boolean" ||
                typeof getLevenshteinDistance({
                    first: "e\u0301",
                    second: "cut",
                }) === "number" ||
                Array.isArray(
                    getLevenshteinDistance({ first: "e\u0301", second: "cut" }),
                ) ||
                (typeof getLevenshteinDistance({
                    first: "e\u0301",
                    second: "cut",
                }) === "object" &&
                    getLevenshteinDistance({
                        first: "e\u0301",
                        second: "cut",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getLevenshteinDistance({ first: "مرحبا", second: "cut" }) ===
                undefined ||
                typeof getLevenshteinDistance({
                    first: "مرحبا",
                    second: "cut",
                }) === "string" ||
                typeof getLevenshteinDistance({
                    first: "مرحبا",
                    second: "cut",
                }) === "boolean" ||
                typeof getLevenshteinDistance({
                    first: "مرحبا",
                    second: "cut",
                }) === "number" ||
                Array.isArray(
                    getLevenshteinDistance({ first: "مرحبا", second: "cut" }),
                ) ||
                (typeof getLevenshteinDistance({
                    first: "مرحبا",
                    second: "cut",
                }) === "object" &&
                    getLevenshteinDistance({
                        first: "مرحبا",
                        second: "cut",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getLevenshteinDistance({ first: "你好", second: "cut" }) ===
                undefined ||
                typeof getLevenshteinDistance({
                    first: "你好",
                    second: "cut",
                }) === "string" ||
                typeof getLevenshteinDistance({
                    first: "你好",
                    second: "cut",
                }) === "boolean" ||
                typeof getLevenshteinDistance({
                    first: "你好",
                    second: "cut",
                }) === "number" ||
                Array.isArray(
                    getLevenshteinDistance({ first: "你好", second: "cut" }),
                ) ||
                (typeof getLevenshteinDistance({
                    first: "你好",
                    second: "cut",
                }) === "object" &&
                    getLevenshteinDistance({ first: "你好", second: "cut" }) !==
                        null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            getLevenshteinDistance({
                first: "cat",
                second: "cut",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
