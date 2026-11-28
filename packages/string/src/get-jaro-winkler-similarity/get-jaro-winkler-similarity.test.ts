import { describe, expect, it } from "vitest";
import { getJaroWinklerSimilarity } from "./get-jaro-winkler-similarity.js";
describe("getJaroWinklerSimilarity", () => {
    it("scores equal strings as 1", () => {
        expect(getJaroWinklerSimilarity({ first: "abc", second: "abc" })).toBe(
            1,
        );
        expect(getJaroWinklerSimilarity({ first: "", second: "" })).toBe(1);
        expect(
            getJaroWinklerSimilarity({ first: "abc", second: "xyz" }),
        ).toBeLessThan(1);
    });
});
