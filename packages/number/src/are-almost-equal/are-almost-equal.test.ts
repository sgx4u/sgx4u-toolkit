import { describe, expect, it } from "vitest";
import { areAlmostEqual } from "../index.js";

describe("areAlmostEqual", () => {
    it("covers the documented behavior", () => {
        expect(
            areAlmostEqual({
                first: 0.1 + 0.2,
                second: 0.3,
                absoluteTolerance: 1e-10,
            }),
        ).toBe(true);
        expect(areAlmostEqual({ first: 1, second: 2 })).toBe(false);
        expect(areAlmostEqual({ first: -0, second: 0 })).toBe(true);
        expect(areAlmostEqual({ first: Number.NaN, second: 1 })).toBe(false);
    });
});
