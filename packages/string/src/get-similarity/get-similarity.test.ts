import { describe, expect, it } from "vitest";
import { getSimilarity } from "./get-similarity.js";
describe("getSimilarity", () => {
    it("scores 1 for equals and supports the other algorithms", () => {
        expect(getSimilarity({ first: "abc", second: "abc" })).toBe(1);
        expect(
            getSimilarity({
                first: "",
                second: "",
                algorithm: "normalized-levenshtein",
            }),
        ).toBe(1);
        expect(
            getSimilarity({ first: "ab", second: "ac", algorithm: "dice" }),
        ).toBeGreaterThanOrEqual(0);
        expect(() =>
            getSimilarity({
                first: "a",
                second: "a",
                algorithm: "xyz" as "dice",
            }),
        ).toThrow(RangeError);
    });
});
