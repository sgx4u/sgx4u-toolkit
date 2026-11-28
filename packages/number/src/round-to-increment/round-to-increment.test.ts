import { describe, expect, it } from "vitest";
import { roundToIncrement } from "../index.js";

describe("roundToIncrement", () => {
    it("covers the documented behavior", () => {
        expect(roundToIncrement({ value: 7, increment: 5 })).toBe(5);
        expect(roundToIncrement({ value: 8, increment: 5 })).toBe(10);
        expect(roundToIncrement({ value: 1, increment: 0 })).toBeUndefined();
        expect(
            roundToIncrement({ value: Number.NaN, increment: 1 }),
        ).toBeUndefined();
    });
});
