import { describe, expect, it } from "vitest";
import { randomInteger } from "../index.js";

describe("randomInteger", () => {
    it("covers the documented behavior", () => {
        expect(randomInteger({ lower: 1, upper: 6, random: () => 0 })).toBe(1);
        expect(
            randomInteger({
                lower: 1,
                upper: 6,
                includeUpper: false,
                random: () => 0.999,
            }),
        ).toBe(5);
        expect(() =>
            randomInteger({ lower: 2, upper: 1, random: () => 0 }),
        ).toThrow(RangeError);
        expect(() =>
            randomInteger({ lower: 1.5, upper: 2, random: () => 0 }),
        ).toThrow(RangeError);
    });
});
