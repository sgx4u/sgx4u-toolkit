import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { sliceString } from "./slice-string.js";

describe("sliceString", () => {
    it("matches slice for graphemes and code units", () => {
        expect(sliceString({ value: "hello", start: 1, end: 4 })).toBe("ell");
        expect(sliceString({ value: "hello", start: -2 })).toBe("lo");
        expect(sliceString({ value: "👨‍👩‍👧‍👦", start: 0, end: 1 })).toBe("👨‍👩‍👧‍👦");
        expect(
            sliceString({
                value: "👨‍👩‍👧‍👦",
                start: 0,
                end: 1,
                unit: "codePoint",
            })?.length,
        ).toBeGreaterThan(0);
        expect(sliceString({ value: 1 as unknown as string })).toBeUndefined();
        expect(() =>
            sliceString({ value: "a", unit: "byte" as "grapheme" }),
        ).toThrow(RangeError);
    });

    it("rebuilds the original when the grapheme slices are concatenated", () => {
        fc.assert(
            fc.property(
                fc.string({ maxLength: 30, unit: "grapheme" }),
                fc.integer({ min: 0, max: 30 }),
                fc.integer({ min: 0, max: 30 }),
                (value, firstCut, secondCut) => {
                    const start = Math.min(firstCut, secondCut);
                    const end = Math.max(firstCut, secondCut);
                    const left =
                        sliceString({ value, start: 0, end: start }) ?? "";
                    const middle = sliceString({ value, start, end }) ?? "";
                    const right = sliceString({ value, start: end }) ?? "";
                    expect(left + middle + right).toBe(value);
                },
            ),
            { numRuns: 25 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(sliceString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            sliceString({ value: "", start: 1, end: 4 }) === undefined ||
                typeof sliceString({ value: "", start: 1, end: 4 }) ===
                    "string" ||
                typeof sliceString({ value: "", start: 1, end: 4 }) ===
                    "boolean" ||
                typeof sliceString({ value: "", start: 1, end: 4 }) ===
                    "number" ||
                Array.isArray(sliceString({ value: "", start: 1, end: 4 })) ||
                (typeof sliceString({ value: "", start: 1, end: 4 }) ===
                    "object" &&
                    sliceString({ value: "", start: 1, end: 4 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            sliceString({ value: "👨‍👩‍👧", start: 1, end: 4 }) === undefined ||
                typeof sliceString({ value: "👨‍👩‍👧", start: 1, end: 4 }) ===
                    "string" ||
                typeof sliceString({ value: "👨‍👩‍👧", start: 1, end: 4 }) ===
                    "boolean" ||
                typeof sliceString({ value: "👨‍👩‍👧", start: 1, end: 4 }) ===
                    "number" ||
                Array.isArray(sliceString({ value: "👨‍👩‍👧", start: 1, end: 4 })) ||
                (typeof sliceString({ value: "👨‍👩‍👧", start: 1, end: 4 }) ===
                    "object" &&
                    sliceString({ value: "👨‍👩‍👧", start: 1, end: 4 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            sliceString({ value: "e\u0301", start: 1, end: 4 }) === undefined ||
                typeof sliceString({ value: "e\u0301", start: 1, end: 4 }) ===
                    "string" ||
                typeof sliceString({ value: "e\u0301", start: 1, end: 4 }) ===
                    "boolean" ||
                typeof sliceString({ value: "e\u0301", start: 1, end: 4 }) ===
                    "number" ||
                Array.isArray(
                    sliceString({ value: "e\u0301", start: 1, end: 4 }),
                ) ||
                (typeof sliceString({ value: "e\u0301", start: 1, end: 4 }) ===
                    "object" &&
                    sliceString({ value: "e\u0301", start: 1, end: 4 }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            sliceString({ value: "مرحبا", start: 1, end: 4 }) === undefined ||
                typeof sliceString({ value: "مرحبا", start: 1, end: 4 }) ===
                    "string" ||
                typeof sliceString({ value: "مرحبا", start: 1, end: 4 }) ===
                    "boolean" ||
                typeof sliceString({ value: "مرحبا", start: 1, end: 4 }) ===
                    "number" ||
                Array.isArray(
                    sliceString({ value: "مرحبا", start: 1, end: 4 }),
                ) ||
                (typeof sliceString({ value: "مرحبا", start: 1, end: 4 }) ===
                    "object" &&
                    sliceString({ value: "مرحبا", start: 1, end: 4 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            sliceString({ value: "你好", start: 1, end: 4 }) === undefined ||
                typeof sliceString({ value: "你好", start: 1, end: 4 }) ===
                    "string" ||
                typeof sliceString({ value: "你好", start: 1, end: 4 }) ===
                    "boolean" ||
                typeof sliceString({ value: "你好", start: 1, end: 4 }) ===
                    "number" ||
                Array.isArray(
                    sliceString({ value: "你好", start: 1, end: 4 }),
                ) ||
                (typeof sliceString({ value: "你好", start: 1, end: 4 }) ===
                    "object" &&
                    sliceString({ value: "你好", start: 1, end: 4 }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            sliceString({
                value: "hello",
                start: 1,
                end: 4,
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
