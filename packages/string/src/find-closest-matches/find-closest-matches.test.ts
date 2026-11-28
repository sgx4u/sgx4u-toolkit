import { describe, expect, it } from "vitest";
import { findClosestMatches } from "./find-closest-matches.js";
describe("findClosestMatches", () => {
    it("returns the best matches first", () => {
        const matches = findClosestMatches({
            value: "cat",
            candidates: ["car", "dog", "cab"],
            limit: 2,
        });
        expect(matches?.[0]?.value).toBe("car");
        expect(matches?.length).toBeLessThanOrEqual(2);
    });
});
