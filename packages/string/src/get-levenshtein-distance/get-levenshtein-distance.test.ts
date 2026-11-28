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
