import { describe, expect, it } from "vitest";
import { randomBigInt } from "../index.js";

describe("randomBigInt", () => {
    it("covers the documented behavior", () => {
        expect(randomBigInt({ lower: 1n, upper: 3n, random: () => 0 })).toBe(
            1n,
        );
        expect(() =>
            randomBigInt({ lower: 3n, upper: 1n, random: () => 0 }),
        ).toThrow(RangeError);
    });
});
