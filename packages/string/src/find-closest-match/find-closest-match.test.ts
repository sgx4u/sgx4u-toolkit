import { describe, expect, it } from "vitest";
import { findClosestMatch } from "./find-closest-match.js";
describe("findClosestMatch", () => {
    it("picks the highest score and the earlier tie", () => {
        expect(
            findClosestMatch({ value: "cat", candidates: ["car", "dog"] })
                ?.value,
        ).toBe("car");
        expect(
            findClosestMatch({ value: "cat", candidates: [] }),
        ).toBeUndefined();
        expect(
            findClosestMatch({
                value: 1 as unknown as string,
                candidates: ["a"],
            }),
        ).toBeUndefined();
    });
});
