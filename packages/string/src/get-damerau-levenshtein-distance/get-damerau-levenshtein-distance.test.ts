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
