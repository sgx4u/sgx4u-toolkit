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
