import { describe, expect, it } from "vitest";
import { getZScore } from "../index.js";

describe("getZScore", () => {
    it("covers the documented behavior", () => {
        expect(getZScore({ value: 2, mean: 0, standardDeviation: 1 })).toBe(2);
        expect(getZScore({ value: 2, values: [1, 2, 3] })).toEqual(
            expect.any(Number),
        );
        expect(
            getZScore({ value: 1, mean: 1, standardDeviation: 0 }),
        ).toBeUndefined();
        expect(getZScore({ value: 1 })).toBeUndefined();
    });
});
