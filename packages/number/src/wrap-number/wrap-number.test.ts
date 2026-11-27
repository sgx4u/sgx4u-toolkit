import { describe, expect, it } from "vitest";
import { wrapNumber } from "../index.js";

describe("wrapNumber", () => {
    it("covers the documented behavior", () => {
        expect(wrapNumber({ value: 370, lower: 0, upper: 360 })).toBe(10);
        expect(wrapNumber({ value: -10, lower: 0, upper: 360 })).toBe(350);
        expect(wrapNumber({ value: 0, lower: 0, upper: 5 })).toBe(0);
        expect(
            wrapNumber({ value: Number.NaN, lower: 0, upper: 1 }),
        ).toBeUndefined();
        expect(() => wrapNumber({ value: 1, lower: 1, upper: 1 })).toThrow(
            RangeError,
        );
    });
});
