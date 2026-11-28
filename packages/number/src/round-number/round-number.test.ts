import { describe, expect, it } from "vitest";
import { roundNumber } from "../index.js";

describe("roundNumber", () => {
    it("covers the documented behavior", () => {
        expect(roundNumber({ value: 1.5 })).toBe(2);
        expect(roundNumber({ value: 2.5, mode: "halfEven" })).toBe(2);
        expect(roundNumber({ value: 1.5, mode: "halfEven" })).toBe(2);
        expect(roundNumber({ value: -1.5, mode: "halfTrunc" })).toBe(-1);
        expect(roundNumber({ value: -1.2, mode: "floor" })).toBe(-2);
        expect(roundNumber({ value: 1234, precision: -2 })).toBe(1200);
        expect(
            roundNumber({ value: 1.25, precision: 1, mode: "halfEven" }),
        ).toBe(1.2);
        expect(roundNumber({ value: Number.NaN })).toBeUndefined();
        expect(() =>
            roundNumber({ value: 1, mode: "banker" as "halfEven" }),
        ).toThrow(RangeError);
        expect(() => roundNumber({ value: 1, precision: 1.5 })).toThrow(
            RangeError,
        );
    });
});
